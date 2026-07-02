import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Book Appointment
 */
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, symptoms } = req.body;

    if (req.user.role !== "PATIENT") {
      return res.status(403).json({
        message: "Only patients can book appointments.",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found.",
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

    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        startTime,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: patient.id,
        date: new Date(date),
        startTime,
        endTime,
        symptoms,
      },
    });

    res.status(201).json({
      success: true,
      appointment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Patient Appointments
 */
export const getMyAppointments = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
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

/**
 * Cancel Appointment
 */
export const cancelAppointment = async (req, res) => {
    try {
  
      // Only patients can cancel
      if (req.user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients can cancel appointments.",
        });
      }
  
      // Find logged-in patient
      const patient = await prisma.patient.findUnique({
        where: {
          userId: req.user.id,
        },
      });
  
      if (!patient) {
        return res.status(404).json({
          message: "Patient profile not found.",
        });
      }
  
      // Find appointment
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: req.params.id,
        },
      });
  
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found.",
        });
      }
  
      // Check ownership
      if (appointment.patientId !== patient.id) {
        return res.status(403).json({
          message: "You can only cancel your own appointments.",
        });
      }
  
      // Prevent cancelling completed appointments
      if (appointment.status === "COMPLETED") {
        return res.status(400).json({
          message: "Completed appointments cannot be cancelled.",
        });
      }
  
      // Already cancelled
      if (appointment.status === "CANCELLED") {
        return res.status(400).json({
          message: "Appointment already cancelled.",
        });
      }
  
      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: req.params.id,
        },
        data: {
          status: "CANCELLED",
        },
      });
  
      res.json({
        success: true,
        appointment: updatedAppointment,
      });
  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        message: "Server Error",
      });
    }
  };
  /**
 * Complete Appointment
 */
export const completeAppointment = async (req, res) => {
    try {
      const { doctorNotes, prescription } = req.body;
  
      if (req.user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors can complete appointments.",
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
  
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: req.params.id,
        },
      });
  
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found.",
        });
      }
  
      if (appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          message: "Unauthorized.",
        });
      }
  
      if (appointment.status === "COMPLETED") {
        return res.status(400).json({
          message: "Appointment already completed.",
        });
      }
  
      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: req.params.id,
        },
        data: {
          doctorNotes,
          prescription,
          status: "COMPLETED",
        },
      });
  
      res.json({
        success: true,
        appointment: updatedAppointment,
      });
  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        message: "Server Error",
      });
    }
  };