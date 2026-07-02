import { PrismaClient } from "@prisma/client";
import { generateSlots } from "../utils/slotGenerator.js";

const prisma = new PrismaClient();

/**
 * Create Doctor Profile
 */
export const createDoctor = async (req, res) => {
  try {
    const {
      specialization,
      workingStart,
      workingEnd,
      slotDuration,
    } = req.body;

    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({
        message: "Only doctors can create a doctor profile.",
      });
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor profile already exists.",
      });
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId: req.user.id,
        specialization,
        workingStart,
        workingEnd,
        slotDuration,
      },
    });

    res.status(201).json({
      success: true,
      doctor,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get All Doctors
 */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      doctors,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get Available Slots
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    // Generate all slots
    const slots = generateSlots(
      doctor.workingStart,
      doctor.workingEnd,
      doctor.slotDuration
    );

    // Fetch booked appointments
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: "BOOKED",
      },
    });

    // Mark unavailable slots
    const availableSlots = slots.map((slot) => {
      const booked = bookedAppointments.find(
        (appointment) =>
          appointment.startTime === slot.startTime
      );

      return {
        ...slot,
        available: !booked,
      };
    });

    res.json({
      success: true,
      slots: availableSlots,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get Logged-in Doctor Appointments
 */
export const getDoctorAppointments = async (req, res) => {
  try {

    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({
        message: "Only doctors can access this route.",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};