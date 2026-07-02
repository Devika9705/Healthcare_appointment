import express from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/me", protect, getMe);

export default router;