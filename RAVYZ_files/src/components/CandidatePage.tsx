import { useEffect, useMemo, useState } from "react";
import { listJobs, applyToJob } from "../lib/jobs";
import { motion } from "motion/react";
import { 
  User, MapPin, Phone, Mail, Edit3, 
  BarChart3, Target, Users, Star, Briefcase, GraduationCap,
  ExternalLink, Filter, Bell, Settings, ArrowUp
} from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

import { getCandidateMe } from "../lib/profile";

interface CandidatePageProps {
  candidateData?: any; // ainda aceitamos dados vindos do fluxo do Figma
  onBack: () => void;
}

// === helpers de UI ===
const getScoreColor = (score: number) => {
  if (score >= 90) return "text-ravyz-green";
  if (score >= 80) return "text-ravyz-orange";
  if (score >= 70) return "text-ravyz-blue";
  return "text-ravyz-purple";
};
const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-ravyz-green";
  if (score >= 80) return "bg-ravyz-orange";
  if (score >= 70) return "bg-ravyz-blue";
  return "bg-ravyz-purple";
};

// mapeia o payload da API -> estrutura usada pelo layout
function mapApiCandidateToView(me: any) {
  if (!me) return undefined;
  // prisma.candidateProfile inclui: fullName, location, skills: [{ skill: { name } }]
  const apiSkills = (me.skills || []).map((cs: any) => ({
    name: cs.skill?.name || "",
    level: 85, // não temos nível no backend; usa um default amigável
  }));

  return {
    name: me.fullName || "Candidate",
    email: me.email || "", // a rota /candidates/me não retorna email; se quiser, adicione via join no backend
    phone: me.phone || "",
    location: me.location || "",
    profileImage: null,
    title: me.headline || "Profissional",
    company: "",
    experience: 0,
    education: "",
    linkedinUrl: me.linkedinUrl || "#",

    // métricas “fake” até termos dados reais
    profileScore: 90,
    marketRanking: 25,
    totalCandidates: 1000,
    categoryRanking: 8,
    totalInCategory: 150,
    profileViews: 42,
    jobApplications: 3,
    interviewInvites: 1,

    technicalSkills: apiSkills,
    softSkills: [],

    dreamJob: {
      position: me.dreamJobPosition || "Cargo dos sonhos",
      industries: me.industries || [],
      salaryRange: { min: 0, max: 0 },
      workModel: [],
      companySize: [],
      topValues: [],
    },
  };
}

export function CandidatePage({ candidateData, onBack }: CandidatePageProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [me, setMe] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsErr, setJobsErr] = useState("");
  const [jobsLoading, setJobsLoading] = useState(true);


  // carrega da API quando a página abrir
  useEffect(() => {
  (async () => {
    try {
      const data = await listJobs();
      setJobs(data);
    } catch (e: any) {
      setJobsErr(e?.message || "Falha ao carregar vagas");
    } finally {
      setJobsLoading(false);
    }
  })();
}, []);




  // dados default (mock) para preencher o visual quando algo não veio do backend
  const defaultCandidate = useMemo(() => ({
    name: "Ana Carolina Silva",
    email: "ana.silva@email.com",
    phone: "+55 11 99999-9999",
    location: "São Paulo, SP",
    profileImage: null,
    title: "Product Manager Sênior",
    company: "TechCorp",
    experience: 5,
    education: "Bacharelado em Administração - USP",
    linkedinUrl: "https://linkedin.com/in/ana-silva",
    profileScore: 92,
    marketRanking: 15,
    totalCandidates: 5420,
    categoryRanking: 3,
    totalInCategory: 156,
    profileViews: 234,
    jobApplications: 12,
    interviewInvites: 8,
    technicalSkills: [
      { name: "Product Management", level: 95 },
      { name: "Data Analysis", level: 88 },
      { name: "Agile/Scrum", level: 92 },
      { name: "UX/UI Design", level: 78 },
      { name: "Growth Hacking", level: 85 },
      { name: "SQL", level: 72 }
    ],
    softSkills: [
      { name: "Liderança", level: 94 },
      { name: "Comunicação", level: 91 },
      { name: "Resolução de Problemas", level: 89 },
      { name: "Trabalho em Equipe", level: 95 },
      { name: "Adaptabilidade", level: 87 }
    ],
    dreamJob: {
      position: "Head of Product",
      industries: ["Tecnologia", "Fintech", "E-commerce"],
      salaryRange: { min: 15000, max: 25000 },
      workModel: ["Híbrido", "Remoto"],
      companySize: ["Média", "Grande"],
      topValues: ["Inovação", "Work-life balance", "Crescimento rápido"]
    }
  }), []);

  // junta: MOCK (fallback) <- props do fluxo do Figma <- dados reais da API
  const candidate = useMemo(() => {
    const fromApi = mapApiCandidateToView(me);
    const merged = {
      ...defaultCandidate,
      ...(candidateData || {}),
      ...(fromApi || {}),
    };
    // garantir arrays
    merged.technicalSkills = merged.technicalSkills || defaultCandidate.technicalSkills;
    merged.softSkills = merged.softSkills || defaultCandidate.softSkills;
    merged.dreamJob = {
      ...defaultCandidate.dreamJob,
      ...(merged.dreamJob || {}),
      industries:
        merged.dreamJob?.industries ||
        merged.dreamJob?.industry ||
        defaultCandidate.dreamJob.industries,
      topValues: merged.dreamJob?.topValues || defaultCandidate.dreamJob.topValues,
    };
    return merged;
  }, [me, candidateData, defaultCandidate]);

  // vagas mock por enquanto (quando ligarmos /jobs recomendadas, a gente troca)
  const recommendedJobs = [
    { id: 1, title: "Head of Product", company: "Fintech Innovation", location: "São Paulo, SP", salary: "R$ 18.000 - R$ 28.000", matchScore: 96, type: "Premium Match", postedDate: "2 dias atrás", applicants: 23, requirements: ["5+ anos", "Fintech", "Liderança"], benefits: ["Stock Options", "Plano de Saúde Premium", "Home Office"] },
    { id: 2, title: "Senior Product Manager", company: "E-commerce Giant", location: "Remoto", salary: "R$ 15.000 - R$ 22.000", matchScore: 92, type: "AI Recommended", postedDate: "1 dia atrás", applicants: 45, requirements: ["4+ anos", "E-commerce", "Growth"], benefits: ["Vale Refeição", "Auxílio Home Office", "Plano Saúde"] },
    { id: 3, title: "Product Lead", company: "Tech Startup", location: "São Paulo, SP", salary: "R$ 12.000 - R$ 18.000", matchScore: 89, type: "Growth Opportunity", postedDate: "3 dias atrás", applicants: 31, requirements: ["3+ anos", "Startup", "MVP"], benefits: ["Equity", "Flexibilidade", "Desenvolvimento"] },
    { id: 4, title: "Director of Product", company: "Corporate Tech", location: "São Paulo, SP", salary: "R$ 22.000 - R$ 35.000", matchScore: 85, type: "Career Advancement", postedDate: "5 dias atrás", applicants: 12, requirements: ["7+ anos", "Enterprise", "Estratégia"], benefits: ["Carro da Empresa", "Previdência", "Stock Options"] },
  ];

  

  // ======= se estiver carregando ou sem token, feedback simples =======
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Carregando seu perfil…
      </div>
    );
  }
  if (err) {
    return (
      <div className="min-h-screen grid place-items-center text-center p-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Não foi possível carregar seu perfil</h2>
          <p className="text-gray-600 mb-4">{err}</p>
          <p className="text-gray-500">Verifique se você está logado (o token deve estar no Local Storage) e tente novamente.</p>
          <div className="mt-6">
            <Button variant="outline" onClick={onBack}>Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  // ======= UI original (agora preenchida com 'candidate') =======
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Score do Perfil</p>
              <p className="text-2xl font-bold text-ravyz-green">{candidate.profileScore}%</p>
            </div>
            <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-ravyz-green" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-ravyz-green">
              <ArrowUp className="w-4 h-4" />
              <span>+5% esta semana</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ranking Geral</p>
              <p className="text-2xl font-bold text-ravyz-orange">#{candidate.marketRanking}</p>
            </div>
            <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-ravyz-orange" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Top {Math.round(((candidate.marketRanking || 0) / (candidate.totalCandidates || 1)) * 100)}% de {(candidate.totalCandidates || 0).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visualizações</p>
              <p className="text-2xl font-bold text-ravyz-blue">{candidate.profileViews}</p>
            </div>
            <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-ravyz-blue" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-ravyz-blue">
              <ArrowUp className="w-4 h-4" />
              <span>+12% este mês</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entrevistas</p>
              <p className="text-2xl font-bold text-ravyz-purple">{candidate.interviewInvites}</p>
            </div>
            <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-ravyz-purple" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">de {candidate.jobApplications} candidaturas</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Posição no Mercado</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ranking Geral</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">#{candidate.marketRanking}</span>
                <span className="text-sm text-gray-500">de {(candidate.totalCandidates || 0).toLocaleString()}</span>
              </div>
            </div>
            <Progress value={(1 - (candidate.marketRanking || 0) / (candidate.totalCandidates || 1)) * 100} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product Management</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ravyz-orange">#{candidate.categoryRanking}</span>
                <span className="text-sm text-gray-500">de {candidate.totalInCategory}</span>
              </div>
            </div>
            <Progress value={(1 - (candidate.categoryRanking || 0) / (candidate.totalInCategory || 1)) * 100} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Competências Destacadas</h3>
          <div className="space-y-3">
            {(candidate.technicalSkills || []).slice(0, 4).map((skill: any) => (
              <div key={skill.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getScoreBg(skill.level)}`} style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className={`text-sm font-semibold ${getScoreColor(skill.level)}`}>{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Perfil do Cargo dos Sonhos</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Posição Desejada</h4>
            <p className="text-lg font-semibold text-ravyz-purple">{candidate.dreamJob.position}</p>
            <p className="text-sm text-gray-600 mt-1">
              {candidate.dreamJob?.salaryRange?.min
                ? <>R$ {(candidate.dreamJob.salaryRange.min || 0).toLocaleString()} - R$ {(candidate.dreamJob.salaryRange.max || 0).toLocaleString()}</>
                : "Faixa salarial não informada"}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Indústrias de Interesse</h4>
            <div className="flex flex-wrap gap-2">
              {(candidate.dreamJob?.industries || []).map((industry: string) => (
                <Badge key={industry} variant="secondary">{industry}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Valores Importantes</h4>
            <div className="space-y-1">
              {(candidate.dreamJob?.topValues || []).map((value: string) => (
                <div key={value} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-ravyz-orange fill-current" />
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Informações Pessoais</h3>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{candidate.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{candidate.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{candidate.location}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-gray-400" />
              <a href={candidate.linkedinUrl} className="text-ravyz-blue hover:underline" target="_blank" rel="noopener noreferrer">
                Ver perfil no LinkedIn
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{candidate.experience} anos de experiência</span>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{candidate.education}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Competências Técnicas</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {(candidate.technicalSkills || []).map((skill: any) => (
            <div key={skill.name} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getScoreBg(skill.level)}`} style={{ width: `${skill.level}%` }} />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(skill.level)} min-w-[3rem]`}>{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderJobs = () => {
  // se quiser manter as recomendadas como fallback:
  const jobsToShow =
    !jobsLoading && jobs?.length ? jobs : recommendedJobs;

  const filtradas = (jobsToShow || []).filter((j: any) =>
    (j?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar vagas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          Filtros
        </Button>
      </div>

      {/* Estados */}
      {jobsLoading && <p>Carregando vagas…</p>}
      {jobsErr && <p className="text-red-500">{jobsErr}</p>}

      {/* Lista */}
      <div className="space-y-4">
        {filtradas.map((job: any) => {
          // requirements pode vir como strings ou JobSkill -> { skill: { name } }
          const reqs =
            job.requirements?.map((r: any) => r?.skill?.name || r?.name || r) || [];

        return (
          <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <Badge variant="outline">
                    {job.company?.name || job.company || "Empresa"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">{job.company?.name || job.company || ""}</span>
                  <span>•</span>
                  <span>{job.location || "Remoto"}</span>
                </div>
              </div>

              {/* Botão para aplicar */}
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    await applyToJob(job.id);
                    alert("Candidatura enviada!");
                  } catch (e: any) {
                    alert("Erro ao candidatar: " + (e?.message || e));
                  }
                }}
              >
                Candidatar-se
              </Button>
            </div>

            {reqs.length > 0 && (
              <div className="text-sm">
                <p className="font-medium text-gray-700 mb-2">Requisitos</p>
                <div className="flex flex-wrap gap-1">
                  {reqs.map((r: string) => (
                    <Badge key={r} variant="secondary" className="text-xs">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );})}
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RavyzLogo size="sm" variant="compact" />
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Painel do Candidato</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm"><Bell className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm"><Settings className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={onBack}>Voltar</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-ravyz-purple to-ravyz-blue rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{candidate.name}</h1>
              <p className="text-gray-600 mb-2">{candidate.title} • {candidate.company}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{candidate.location}</span>
                <span>•</span>
                <span>{candidate.experience} anos de experiência</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-ravyz-green mb-1">{candidate.profileScore}%</div>
              <div className="text-sm text-gray-600">Score do Perfil</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-ravyz-orange/10 data-[state=active]:text-ravyz-orange">Dashboard</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-ravyz-purple/10 data-[state=active]:text-ravyz-purple">Perfil Completo</TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-ravyz-blue/10 data-[state=active]:text-ravyz-blue">Vagas Recomendadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="mt-0">{renderDashboard()}</TabsContent>
          <TabsContent value="profile" className="mt-0">{renderProfile()}</TabsContent>
          <TabsContent value="jobs" className="mt-0">{renderJobs()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
