import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

/**
 * Register User
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Automatically create Patient profile
    if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          age: 0,
          gender: "Not Specified",
          phone: "Not Provided",
        },
      });
    }

    // Automatically create Doctor profile
    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: "General Physician",
          workingStart: "09:00",
          workingEnd: "17:00",
          slotDuration: 30,
        },
      });
    }

    // Generate JWT Token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Login User
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = generateToken(user);

    // Remove password
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get Logged-in User
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};