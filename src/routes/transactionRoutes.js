import express from "express";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, getTransactionsByDeed, getTransactionsByStatus, getTransactionsByUser, updateStatus, updateTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

// Additional filters
router.get("/status/:status", getTransactionsByStatus);
router.get("/user/:address", getTransactionsByUser);
router.get("/deed/:deedId", getTransactionsByDeed);

// Partial Updates
router.post("/:id", updateStatus);

export default router;