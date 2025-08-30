import { Router } from "express";
import { supabase } from "../supabase";
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

  const { data: company } = await supabase
    .from("Company")
    .select("id")
    .eq("userId", req.user.id)
    .single();
  if (!company) return res.status(400).json({ error: "Company profile not found" });

  const { data: job, error } = await supabase
    .from("Job")
    .insert({ title, description, location, employment, companyId: company.id })
    .select()
    .single();
  if (error || !job) return res.status(500).json({ error: error?.message });

  if (requirements.length) {
    const skills = await Promise.all(
      requirements.map((name) =>
        supabase
          .from("Skill")
          .upsert({ name }, { onConflict: "name" })
          .select()
          .single()
      )
    );
    await Promise.all(
      skills.map((s) =>
        s.data
          ? supabase
              .from("JobSkill")
              .insert({ jobId: job.id, skillId: s.data.id, must: true })
          : null
      )
    );
  }

  res.status(201).json(job);
});

// Listar vagas (público)
router.get("/", async (_req, res) => {
  const { data: jobs } = await supabase
    .from("Job")
    .select("*, company:Company(*), requirements:JobSkill(skill:Skill(*))");
  res.json(jobs || []);
});

// Aplicar a vaga (CANDIDATE)
router.post("/:id/apply", requireAuth, requireRole("CANDIDATE"), async (req: any, res) => {
  const jobId = req.params.id;

  const { data: profile } = await supabase
    .from("CandidateProfile")
    .select("id")
    .eq("userId", req.user.id)
    .single();
  if (!profile) return res.status(400).json({ error: "Candidate profile not found" });

  const { data: job } = await supabase
    .from("Job")
    .select("id")
    .eq("id", jobId)
    .single();
  if (!job) return res.status(404).json({ error: "Job not found" });

  const { data: application, error } = await supabase
    .from("Application")
    .insert({ jobId, candidateId: profile.id, status: "SUBMITTED" })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(application);
});

export default router;
