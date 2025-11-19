// src/app.js
//import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"; // <-- NEW IMPORT

// Import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// Load env variables
//dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Set your frontend origin
    credentials: true, // IMPORTANT: Allows cookies to be sent across origins
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser()); // <-- NEW MIDDLEWARE
// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Import routes (we’ll add them later)
// import authRoutes from "./routes/authRoutes.js";
// app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;
