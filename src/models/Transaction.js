import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  deedId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  hash: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["gift", "open_market", "direct_transfer", "closed", "init", "sale_transfer", "escrow_sale"], required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  share: { type: Number, default: 100 },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
``