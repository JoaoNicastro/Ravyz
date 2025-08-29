import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const router = Router();

const JobInput = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().optional(),
  employment: z.string().optional(),
  requirements: z.array(z.string()).default([])
});

// Criar vaga (EMPLOYER)
router.post("/", requireAuth, requireRole("EMPLOYER"), async (req: any, res) => {
  const parsed = JobInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { title, description, location, employment, requirements } = parsed.data;

  const company = await prisma.company.findUnique({ where: { userId: req.user.id } });
  if (!company) return res.status(400).json({ error: "Company profile not found" });

  const job = await prisma.job.create({
    data: { title, description, location, employment, companyId: company.id }
  });

  if (requirements.length) {
    const skills = await Promise.all(
      requirements.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
    );
    await Promise.all(
      skills.map((s) => prisma.jobSkill.create({ data: { jobId: job.id, skillId: s.id, must: true } }))
    );
  }

  res.status(201).json(job);
});

// Listar vagas (público)
router.get("/", async (_req, res) => {
  const jobs = await prisma.job.findMany({
    include: { company: true, requirements: { include: { skill: true } } }
  });
  res.json(jobs);
});

// Aplicar a vaga (CANDIDATE)
router.post("/:id/apply", requireAuth, requireRole("CANDIDATE"), async (req: any, res) => {
  const jobId = req.params.id;

  const profile = await prisma.candidateProfile.findUnique({ where: { userId: req.user.id } });
  if (!profile) return res.status(400).json({ error: "Candidate profile not found" });

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ error: "Job not found" });

  const application = await prisma.application.create({
    data: { jobId, candidateId: profile.id, status: "SUBMITTED" }
  });

  res.status(201).json(application);
});

export default router;
