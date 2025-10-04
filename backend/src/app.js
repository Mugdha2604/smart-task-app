// src/app.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { sequelize } from "./config/db.js";

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Import routes (we’ll add them later)
// import authRoutes from "./routes/authRoutes.js";
// app.use("/api/v1/auth", authRoutes);

export default app;
