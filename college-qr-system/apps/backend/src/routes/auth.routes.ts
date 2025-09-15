import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../prismaclient.js";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt.js";
const router = Router();


router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { rollNo, name, password, role } = req.body || {};
if (!rollNo || !name || !password || !role) {
  res.status(400).json({ error: "Missing required fields" });
  return;
}

  const existing = await prisma.user.findUnique({ where: { rollNo } });
  if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
}

const hashed = await hashPassword(password);
const user = await prisma.user.create({
  data: { rollNo, name, password: hashed, role },
});

res.json(user);
const newUser = await prisma.user.create({
  data: { 
    rollNo, 
    name, 
    password: hashed, 
    role: Role.STUDENT   // convert input to enum
  },

})
res.json(newUser);
}
);



// Login
router.post("/login", async (req, res) : Promise<void>  => {
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
});

// PROFILE
router.get("/me", async (req: any, res) => {
  res.json(req.user); 
});

export default router;