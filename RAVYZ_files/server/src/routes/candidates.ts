import { Router } from "express";
import { supabase } from "../supabase";                    // ajuste se seu export for diferente
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

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

  const { data: profile, error } = await supabase
    .from("CandidateProfile")
    .upsert(
      {
        userId: req.user.id,
        fullName: d.fullName || "Candidate",
        headline: d.headline,
        bio: d.bio,
        location: d.location,
        cpf: d.cpf,
        phone: d.phone,
        address: d.address,
      },
      { onConflict: "userId" }
    )
    .select()
    .single();

  if (error || !profile) {
    if (error && error.code === "23505") {
      return res.status(409).json({ error: "CPF já cadastrado" });
    }
    return res.status(500).json({ error: error?.message });
  }

  if (d.skills) {
    const skills = await Promise.all(
      d.skills.map((name) =>
        supabase
          .from("Skill")
          .upsert({ name }, { onConflict: "name" })
          .select()
          .single()
      )
    );
    await supabase.from("CandidateSkill").delete().eq("candidateId", profile.id);
    await Promise.all(
      skills.map((s) =>
        s.data
          ? supabase
              .from("CandidateSkill")
              .insert({
                candidateId: profile.id,
                skillId: s.data.id,
                level: 3,
              })
          : null
      )
    );
  }

  res.json({ ok: true });
});

router.get(
  "/me/applications",
  requireAuth,
  requireRole("CANDIDATE"),
  async (req: any, res) => {
    const { data: candidate } = await supabase
      .from("CandidateProfile")
      .select("id")
      .eq("userId", req.user.id)
      .single();
    if (!candidate) return res.json([]);

    const { data: apps } = await supabase
      .from("Application")
      .select("*, job:Job(*)")
      .eq("candidateId", candidate.id)
      .order("createdAt", { ascending: false });
    res.json(apps || []);
  }
);

export default router;
