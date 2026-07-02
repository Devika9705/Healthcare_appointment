import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (body) => {
  const { name, email, password, role } = body;

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  const token = generateToken(user);

  return {
    token,
    user,
  };
};