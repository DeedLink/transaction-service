import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5004;

app.listen(PORT, async () => {
  console.log(`✅ User service running on port ${PORT}`);
  await initializeAdmin();
});