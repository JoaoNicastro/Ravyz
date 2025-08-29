import { Router } from "express";
import { prisma } from "../prisma";                    // ajuste se seu export for diferente
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const router = Router();

// ===== ÚNICA definição =====
const UpdateInput = z
  .object({
    fullName: z.string().min(2).optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),

    // MVP1
    cpf: z.string().min(5).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),

    skills: z.array(z.string()).optional(),
  })
  .strip(); // <- remove campos extras do body

router.put("/me", requireAuth, requireRole("CANDIDATE"), async (req: any, res) => {
  const parsed = UpdateInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const d = parsed.data;

  try {
    const profile = await prisma.candidateProfile.upsert({
      where: { userId: req.user.id },
      update: {
        fullName: d.fullName ?? undefined,
        headline: d.headline ?? undefined,
        bio: d.bio ?? undefined,
        location: d.location ?? undefined,
        cpf: d.cpf ?? undefined,
        phone: d.phone ?? undefined,
        address: d.address ?? undefined,
      },
      create: {
        userId: req.user.id,
        fullName: d.fullName || "Candidate",
        headline: d.headline,
        bio: d.bio,
        location: d.location,
        cpf: d.cpf,
        phone: d.phone,
        address: d.address,
      },
    });

    if (d.skills) {
      const skills = await Promise.all(
        d.skills.map((name) =>
          prisma.skill.upsert({ where: { name }, update: {}, create: { name } })
        )
      );
      await prisma.candidateSkill.deleteMany({ where: { candidateId: profile.id } });
      await Promise.all(
        skills.map((s) =>
          prisma.candidateSkill.create({
            data: { candidateId: profile.id, skillId: s.id, level: 3 },
          })
        )
      );
    }

    res.json({ ok: true });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      // unique constraint (ex.: CPF duplicado)
      return res.status(409).json({ error: "CPF já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

router.get("/me/applications", requireAuth, requireRole("CANDIDATE"), async (req: any, res) => {
  const apps = await prisma.application.findMany({
    where: { candidate: { userId: req.user.id } },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(apps);
});

export default router;
