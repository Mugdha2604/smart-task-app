// src/routes/taskRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createTask);         // Create task
router.get("/", getTasks);            // List tasks
router.get("/:id", getTaskById);      // Get task by ID
router.put("/:id", updateTask);       // Update task
router.delete("/:id", deleteTask);    // Delete task

export default router;
