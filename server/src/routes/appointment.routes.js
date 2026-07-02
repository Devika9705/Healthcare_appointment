import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  completeAppointment,
} from "../controllers/appointment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch("/:id/complete", protect, completeAppointment);

export default router;