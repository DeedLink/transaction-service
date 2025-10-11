import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5004;

app.listen(PORT, async () => {
  console.log(`✅ Transaction service running on port ${PORT}`);
});