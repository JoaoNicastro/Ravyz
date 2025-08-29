import { Router } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
import { hashPassword, checkPassword } from "../auth/hash";
import { signJwt } from "../auth/jwt";

const router = Router();

const RegisterInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CANDIDATE", "EMPLOYER"]).default("CANDIDATE"),
});

router.post("/register", async (req, res) => {
  const parsed = RegisterInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password, role } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  if (role === "CANDIDATE") {
    await prisma.candidateProfile.create({
      data: { userId: user.id, fullName: email.split("@")[0] },
    });
  } else {
    await prisma.company.create({
      data: { userId: user.id, name: email.split("@")[0] },
    });
  }

  const token = signJwt({ id: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = LoginInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await checkPassword(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
