import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import candidateRoutes from "./routes/candidates";
import companyRoutes from "./routes/company";
import jobRoutes from "./routes/jobs";

const app = express();

// CORS liberado em dev (já atende OPTIONS/preflight)
app.use(cors({ origin: true })); 

app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/candidates", candidateRoutes);
app.use("/company", companyRoutes);
app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
