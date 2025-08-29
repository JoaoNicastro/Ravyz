import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../auth/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  const token = header.slice(7);
  try {
    const user = verifyJwt<{ id: string; role: "CANDIDATE" | "EMPLOYER" | "ADMIN" }>(token);
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: "CANDIDATE" | "EMPLOYER" | "ADMIN") {
  return (req: any, res: any, next: NextFunction) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
