// src/routes/authRoutes.js
import express from "express";
import { body } from "express-validator";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * body: { name, email, password, role? }
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("name is required"),
    body("email").isEmail().withMessage("valid email required"),
    body("password").isLength({ min: 6 }).withMessage("password min 6 chars"),
  ],
  register
);

/**
 * @route POST /api/v1/auth/login
 * body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("valid email required"),
    body("password").exists().withMessage("password is required"),
  ],
  login
);

router.post("/logout", logout); // <-- NEW ROUTE

export default router;
