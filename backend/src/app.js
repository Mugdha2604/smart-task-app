import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"; // Ensure you have installed 'cookie-parser'

// Import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load env variables (if dotenv is handled in server.js, this might be optional here)

const app = express();

// --- CRITICAL FIX: Explicitly allow the local dev origin to bypass Render's variable loading issues ---
const allowedOrigin = 'http://localhost:5173'; 

// Middleware
app.use(cors({
    origin: allowedOrigin, // Use the dynamically allowed origin
    credentials: true,     // CRITICAL: Must be true for HttpOnly cookies
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser()); // <-- NEW MIDDLEWARE
// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Route mounting with V1 prefix
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;