import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ message: "Auth service working 🚀" });
});

export default router;