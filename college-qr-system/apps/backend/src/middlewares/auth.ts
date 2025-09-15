import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "supersecretkey"; // move to .env


export function authMiddleware(req: any, res: Response, next: NextFunction) : void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
   res.status(401).json({ error: "No token provided" });
   return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  return;
  }
}

export function requireRole(role: string) {
  return (req: any, res: Response, next: NextFunction) : void => {
    if (req.user.role !== role) {
     res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
