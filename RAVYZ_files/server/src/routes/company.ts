import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const router = Router();

router.get("/me", requireAuth, requireRole("EMPLOYER"), async (req: any, res) => {
  const company = await prisma.company.findUnique({ where: { userId: req.user.id } });
  res.json(company);
});

const UpdateInput = z.object({
  name: z.string().min(2).optional(),
  website: z.string().url().optional(),
  about: z.string().optional(),
  location: z.string().optional()
});

router.put("/me", requireAuth, requireRole("EMPLOYER"), async (req: any, res) => {
  const parsed = UpdateInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const data = parsed.data;

  const company = await prisma.company.upsert({
    where: { userId: req.user.id },
    update: { ...data },
    create: { userId: req.user.id, name: data.name || "Company" }
  });

  res.json(company);
});

export default router;
