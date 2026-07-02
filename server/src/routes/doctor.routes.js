import express from "express";

import {
  createDoctor,
  getDoctors,
  getAvailableSlots,
  getDoctorAppointments,
} from "../controllers/doctor.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create Doctor Profile
router.post("/", protect, createDoctor);

// Get All Doctors
router.get("/", getDoctors);

// Get Logged-in Doctor Appointments
router.get("/appointments", protect, getDoctorAppointments);

// Get Available Slots
router.get("/:doctorId/slots", getAvailableSlots);

export default router;