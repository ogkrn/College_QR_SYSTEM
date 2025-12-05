import { Router, Request, Response } from "express";
import { prisma } from "../prismaclient";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";

const router = Router();

// REGISTER
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rollNo, name, password, role } = req.body || {};

    // Validate required fields
    if (!rollNo || !name || !password || !role) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Normalize role (to uppercase) so inputs like "student" or "Student" still work
    const normalizedRole = role.toUpperCase();

    if (!Object.values(Role).includes(normalizedRole)) {
      res.status(400).json({ error: `Invalid role: ${role}` });
      return;
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { rollNo } });
    if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password and create user
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        rollNo,
        name,
        password: hashed,
        role: normalizedRole as Role, // enforce enum type
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rollNo, password } = req.body;

    const user = await prisma.user.findUnique({ where: { rollNo } });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token, user });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PROFILE
router.get("/me", async (req: any, res: Response) => {
  res.json(req.user);
});

export default router;
