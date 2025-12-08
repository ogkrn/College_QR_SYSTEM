import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env["JWT_SECRET"] || "supersecretkey";

interface JwtPayload {
  userId: string;
  role: Role;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    res.status(403).json({ error: "Super Admin access required" });
    return;
  }
  next();
}
