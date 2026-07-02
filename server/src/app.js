import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Healthcare Appointment API Running 🚀",
  });
});

export default app;