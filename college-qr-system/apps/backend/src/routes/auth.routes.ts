import { Router } from "express";
import { prisma } from "../prismaclient.js";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt.js";
const router = Router();

router.post("/register", async (req, res) => {
  const { rollNo, name, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { rollNo } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { rollNo, name, password: hashed, role },
  });

  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;
  const user = await prisma.user.findUnique({ where: { rollNo } });

  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken({ id: user.id, role: user.role });
  res.json({ token, user });
});

// PROFILE
router.get("/me", async (req: any, res) => {
  res.json(req.user); 
});

export default router;