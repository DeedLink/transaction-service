import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  hash: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['gift', 'open_market', 'direct_transfer', 'closed'], required: true },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;