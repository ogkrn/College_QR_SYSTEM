import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRoutes);
app.use("/admins", adminRoutes);
app.use("/students", studentRoutes);
app.get("/", (_, res) => {
  res.send("🚀 Server is running");
});
export { app };