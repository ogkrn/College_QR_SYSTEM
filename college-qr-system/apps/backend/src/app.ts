import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRoutes);
app.get("/", (_, res) => {
  res.send("🚀 Server is running");
});
export { app };