import express from "express";
import { 
  createTransaction, 
  deleteTransaction, 
  getAllTransactions, 
  getTransactionById, 
  getTransactionsByDeed, 
  getTransactionsByStatus, 
  getTransactionsByUser, 
  updateStatus, 
  updateTransaction 
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);

router.get("/status/:status", getTransactionsByStatus);
router.get("/user/:address", getTransactionsByUser);
router.get("/deed/:deedId", getTransactionsByDeed);

router.post("/status/:blockchain_identification", updateStatus);

router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
