import { Router } from "express";
import { registerInit, verifyOTP, resendOTP, login, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/register", registerInit);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticate, getProfile);

export default router;
