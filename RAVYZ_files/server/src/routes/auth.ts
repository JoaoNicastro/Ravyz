import { Router } from "express";
import { supabase } from "../supabase";
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

  const { data: exists } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hashed = await hashPassword(password);
  const { data: user, error } = await supabase
    .from("User")
    .insert({ email, password: hashed, role })
    .select()
    .single();

  if (error || !user) return res.status(500).json({ error: error?.message });

  if (role === "CANDIDATE") {
    await supabase.from("CandidateProfile").insert({
      userId: user.id,
      fullName: email.split("@")[0],
    });
  } else {
    await supabase.from("Company").insert({
      userId: user.id,
      name: email.split("@")[0],
    });
  }

  const token = signJwt({ id: user.id, role: user.role });
  res
    .status(201)
    .json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = LoginInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;
  const { data: user } = await supabase
    .from("User")
    .select("id, email, password, role")
    .eq("email", email)
    .maybeSingle();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await checkPassword(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
