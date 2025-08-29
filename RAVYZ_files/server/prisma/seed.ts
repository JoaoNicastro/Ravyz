import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // skills
  const skills = await prisma.$transaction([
    prisma.skill.upsert({ where: { name: "React" }, update: {}, create: { name: "React" } }),
    prisma.skill.upsert({ where: { name: "Node" }, update: {}, create: { name: "Node" } }),
    prisma.skill.upsert({ where: { name: "SQL" }, update: {}, create: { name: "SQL" } }),
    prisma.skill.upsert({ where: { name: "Tailwind" }, update: {}, create: { name: "Tailwind" } })
  ]);

  // employer user + company
  const employerPass = await bcrypt.hash("123456", 10);
  const employer = await prisma.user.upsert({
    where: { email: "employer@ravyz.com" },
    update: {},
    create: { email: "employer@ravyz.com", password: employerPass, role: "EMPLOYER" }
  });

  await prisma.company.upsert({
    where: { userId: employer.id },
    update: {},
    create: { userId: employer.id, name: "RAVYZ Inc", website: "https://ravyz.example", about: "Contratando!", location: "Boulder, CO" }
  });

  // candidate user + profile
  const candidatePass = await bcrypt.hash("123456", 10);
  const candidate = await prisma.user.upsert({
    where: { email: "candidate@ravyz.com" },
    update: {},
    create: { email: "candidate@ravyz.com", password: candidatePass, role: "CANDIDATE" }
  });

  const cand = await prisma.candidateProfile.upsert({
    where: { userId: candidate.id },
    update: {},
    create: { userId: candidate.id, fullName: "Candidate One", headline: "Front-end Dev", location: "Boulder, CO" }
  });

  // candidate skills
  for (const s of skills) {
    await prisma.candidateSkill.upsert({
      where: { candidateId_skillId: { candidateId: cand.id, skillId: s.id } },
      update: {},
      create: { candidateId: cand.id, skillId: s.id, level: 3 }
    });
  }

  // job + requirements
  const company = await prisma.company.findUniqueOrThrow({ where: { userId: employer.id } });

  const job = await prisma.job.upsert({
    where: { id: "seed-job-1" },
    update: {},
    create: {
      id: "seed-job-1",
      companyId: company.id,
      title: "Front-end Developer",
      description: "Trabalhar com React + Vite + Tailwind",
      location: "Remoto",
      employment: "Full-time"
    }
  });

  const reactSkill = skills.find(s => s.name === "React")!;
  const tailwindSkill = skills.find(s => s.name === "Tailwind")!;
  await prisma.jobSkill.upsert({
    where: { jobId_skillId: { jobId: job.id, skillId: reactSkill.id } },
    update: {},
    create: { jobId: job.id, skillId: reactSkill.id, must: true }
  });
  await prisma.jobSkill.upsert({
    where: { jobId_skillId: { jobId: job.id, skillId: tailwindSkill.id } },
    update: {},
    create: { jobId: job.id, skillId: tailwindSkill.id, must: true }
  });

  // candidate applies
  await prisma.application.create({
    data: { jobId: job.id, candidateId: cand.id, status: "SUBMITTED" }
  });

  console.log("Seed concluído ✅");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
