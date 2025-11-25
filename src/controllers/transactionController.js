import Transaction from "../models/Transaction.js";
import { publishTransaction } from "../mQ/transactionProducer.js";
import { sendToQueue } from "../utils/producer.js";

export const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    if (transaction.type === "init") {
      transaction.status = "init";
    }
    const savedTransaction = await transaction.save();

    // Publish to existing transaction events queue (for other services)
    await publishTransaction(
      transaction,
      "transaction_created"
    );

    // Send email notification for buyer (especially for escrow transactions)
    // Run in background so transaction creation doesn't fail if RabbitMQ is down
    (async () => {
      try {
        // Only send notifications for transactions with a buyer (to field)
        // Especially important for escrow_sale transactions
        if (savedTransaction.to && (savedTransaction.type === "escrow_sale" || savedTransaction.type === "sale_transfer" || savedTransaction.type === "direct_transfer")) {
          // Convert Mongoose document to plain object for RabbitMQ
          const transactionObject = savedTransaction.toObject ? savedTransaction.toObject() : savedTransaction;
          
          const payload = {
            buyerWalletAddress: savedTransaction.to,
            sellerWalletAddress: savedTransaction.from,
            transaction: transactionObject,
            transactionType: savedTransaction.type,
            time: new Date().toISOString()
          };

          console.log("Preparing to send transaction notification for:", savedTransaction._id);
          console.log("Buyer wallet address:", savedTransaction.to);
          console.log("Transaction type:", savedTransaction.type);
          
          await sendToQueue(payload);
          console.log("Transaction notification sent to queue successfully");
        } else {
          console.log("Skipping notification - transaction type:", savedTransaction.type, "or missing buyer address");
        }
      } catch (notificationError) {
        // Log but don't fail transaction creation
        console.error("Failed to send transaction notification (non-critical):", notificationError.message);
        console.error("Notification error stack:", notificationError.stack);
      }
    })();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { blockchain_identification: req.params.blockchain_identification },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await publishTransaction(
      updatedTransaction,
      "transaction_status_updated"
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsByStatus = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: req.params.status });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsByUser = async (req, res) => {
  try {
    const { address } = req.params;
    const transactions = await Transaction.find({
      $or: [{ from: address }, { to: address }]
    }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsByDeed = async (req, res) => {
  try {
    const { deedId } = req.params;
    const transactions = await Transaction.find({ deedId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};