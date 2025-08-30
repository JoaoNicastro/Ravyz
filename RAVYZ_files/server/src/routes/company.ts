import { Router } from "express";
import { supabase } from "../supabase";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const router = Router();

router.get("/me", requireAuth, requireRole("EMPLOYER"), async (req: any, res) => {
  const { data } = await supabase
    .from("Company")
    .select("*")
    .eq("userId", req.user.id)
    .maybeSingle();
  res.json(data);
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

  const { data: company, error } = await supabase
    .from("Company")
    .upsert(
      { userId: req.user.id, name: data.name || "Company", ...data },
      { onConflict: "userId" }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(company);
});

export default router;
