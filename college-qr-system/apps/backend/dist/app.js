import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);
export { app };
//# sourceMappingURL=app.js.map