import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import doctorRoutes from "./routes/doctor.routes.js";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Healthcare Appointment API Running 🚀",
  });
});

export default app;