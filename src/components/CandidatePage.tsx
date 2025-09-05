import { useState } from "react";
import { motion } from "motion/react";
import { 
  User, MapPin, Calendar, Phone, Mail, Download, Edit3, 
  TrendingUp, Target, Award, Star, Briefcase, GraduationCap,
  Users, BarChart3, Trophy, Zap, Heart, ExternalLink, Filter,
  Search, Bell, Settings, ChevronRight, ArrowUp, ArrowDown,
  Globe, Languages, Building2, Lightbulb, BookOpen, 
  Clock, CheckCircle, AlertCircle, Percent, TrendingDown, LogOut,
  MessageSquare
} from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { SalaryBenchmarking } from "./SalaryBenchmarking";
import { ProfileIcon, useProfileInfo } from "./ProfileIcon";
import { CandidateFeedback } from "./CandidateFeedback";

interface CandidatePageProps {
  candidateData?: any;
  onBack: () => void;
  onLogout?: () => void;
  onNavigateToMatching?: () => void;
  onNavigateToFeedback?: () => void;
  onNavigateToSalary?: () => void;
}

export function CandidatePage({ 
  candidateData, 
  onBack, 
  onLogout,
  onNavigateToMatching,
  onNavigateToFeedback, 
  onNavigateToSalary
}: CandidatePageProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data do candidato - em produção viria das props
  const defaultCandidate = {
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
    
    // Métricas e ranking
    profileScore: 92,
    marketRanking: 15,
    totalCandidates: 5420,
    categoryRanking: 3,
    totalInCategory: 156,
    profileViews: 234,
    jobApplications: 12,
    interviewInvites: 8,
    
    // Skills e competências
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
    
    // Preferências do cargo dos sonhos
    dreamJob: {
      position: "Head of Product",
      industries: ["Tecnologia", "Fintech", "E-commerce"],
      salaryRange: { min: 15000, max: 25000 },
      workModel: ["Híbrido", "Remoto"],
      companySize: ["Média", "Grande"],
      topValues: ["Inovação", "Work-life balance", "Crescimento rápido"]
    },
    
    // Perfil profissional (resultado da avaliação)
    professionalProfile: {
      primaryProfile: "Líder Estratégico",
      secondaryProfile: "Inovador Criativo",
      profileType: "leadership"
    }
  };

  // Merge candidateData with defaults and ensure arrays exist
  const candidate = {
    ...defaultCandidate,
    ...candidateData,
    technicalSkills: Array.isArray(candidateData?.technicalSkills) ? candidateData.technicalSkills : defaultCandidate.technicalSkills,
    softSkills: Array.isArray(candidateData?.softSkills) ? candidateData.softSkills : defaultCandidate.softSkills,
    dreamJob: {
      ...defaultCandidate.dreamJob,
      ...(candidateData?.dreamJob || {}),
      // Garantir que industries sempre seja um array
      industries: (() => {
        const industries = candidateData?.dreamJob?.industries || candidateData?.dreamJob?.industry || defaultCandidate.dreamJob.industries;
        if (Array.isArray(industries)) return industries;
        if (typeof industries === 'string') return [industries];
        return defaultCandidate.dreamJob.industries;
      })(),
      // Garantir que topValues sempre seja um array
      topValues: (() => {
        const values = candidateData?.dreamJob?.topValues || defaultCandidate.dreamJob.topValues;
        if (Array.isArray(values)) return values;
        if (typeof values === 'string') return [values];
        return defaultCandidate.dreamJob.topValues;
      })()
    }
  };

  // Dados detalhados do perfil
  const detailedProfile = {
    about: `Product Manager sênior com mais de 5 anos de experiência transformando ideias em produtos digitais de sucesso. Especializada em Growth Product Management, com histórico comprovado de aumentar métricas de engajamento em mais de 40% e reduzir churn em 25%. 

Apaixonada por resolver problemas complexos através de dados e experimentação, sempre buscando equilibrar necessidades dos usuários com objetivos de negócio. Experiência sólida liderando equipes multidisciplinares em ambientes ágeis, tanto em startups quanto em grandes corporações.

Atualmente focada em produtos B2B SaaS e marketplaces, com interesse especial em IA aplicada a produtos e sustentabilidade digital.`,
    
    highlights: [
      {
        category: "Liderança de Produto",
        items: [
          "Liderou lançamento de 3 produtos que geraram R$ 2M+ em receita no primeiro ano",
          "Gerenciou roadmap de produto para +50K usuários ativos mensais",
          "Implementou framework de experimentação A/B que aumentou conversão em 35%"
        ]
      },
      {
        category: "Conquistas Técnicas", 
        items: [
          "Arquitetou migração de monolito para microserviços reduzindo latência em 60%",
          "Desenvolveu dashboard de analytics que se tornou padrão da empresa",
          "Criou sistema de recomendações usando ML que aumentou engagement em 45%"
        ]
      },
      {
        category: "Reconhecimentos",
        items: [
          "🏆 Prêmio 'Inovação do Ano' - TechCorp 2023",
          "🎯 Top 1% dos Product Managers na avaliação 360°",
          "📈 Responsável pelo produto com maior NPS (87) da empresa"
        ]
      },
      {
        category: "Impacto de Negócio",
        items: [
          "Aumentou receita recorrente (ARR) em 150% através de otimizações de produto",
          "Reduziu custo de aquisição (CAC) em 30% melhorando funil de conversão", 
          "Liderou expansão internacional que resultou em 40% de novos usuários"
        ]
      }
    ],

    languages: [
      { name: "Português", level: "Nativo", proficiency: 100 },
      { name: "Inglês", level: "Fluente", proficiency: 95 },
      { name: "Espanhol", level: "Intermediário", proficiency: 70 }
    ],

    certifications: [
      { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", year: "2023" },
      { name: "Google Analytics Certified", issuer: "Google", year: "2023" },
      { name: "AWS Solutions Architect Associate", issuer: "Amazon", year: "2022" }
    ],

    projects: [
      {
        title: "Sistema de Recomendações Inteligente",
        description: "Desenvolvimento de algoritmo de ML para recomendação de produtos",
        impact: "Aumento de 45% no engagement e R$ 800K em receita adicional",
        year: "2023"
      },
      {
        title: "Plataforma de Analytics B2B",
        description: "Criação de dashboard self-service para clientes enterprise", 
        impact: "Redução de 70% em tickets de suporte e aumento NPS para 89",
        year: "2022"
      }
    ]
  };

  // Mock vagas recomendadas com ranking de probabilidade
  const recommendedJobs = [
    {
      id: 1,
      title: "Head of Product",
      company: "Fintech Innovation",
      location: "São Paulo, SP", 
      salary: "R$ 18.000 - R$ 28.000",
      matchScore: 96,
      probabilityRank: 2,
      totalCandidates: 23,
      probabilityScore: 87,
      status: "Compatível",
      type: "Premium Match",
      postedDate: "2 dias atrás",
      applicants: 23,
      requirements: ["5+ anos", "Fintech", "Liderança"],
      benefits: ["Stock Options", "Plano de Saúde Premium", "Home Office"],
      whyGoodFit: [
        "Experiência em fintech alinhada",
        "Perfil de liderança comprovado", 
        "Skills técnicas 96% compatíveis"
      ],
      competitionLevel: "Baixa",
      interviewProbability: 85
    },
    {
      id: 2,
      title: "Senior Product Manager",
      company: "E-commerce Giant",
      location: "Remoto",
      salary: "R$ 15.000 - R$ 22.000",
      matchScore: 92,
      probabilityRank: 8,
      totalCandidates: 45,
      probabilityScore: 73,
      status: "Excelente Match",
      type: "AI Recommended",
      postedDate: "1 dia atrás",
      applicants: 45,
      requirements: ["4+ anos", "E-commerce", "Growth"],
      benefits: ["Vale Refeição", "Auxílio Home Office", "Plano Saúde"],
      whyGoodFit: [
        "Experiência em growth comprovada",
        "Trabalho remoto alinhado",
        "Background em e-commerce forte"
      ],
      competitionLevel: "Alta",
      interviewProbability: 68
    },
    {
      id: 3,
      title: "Product Lead",
      company: "Tech Startup",
      location: "São Paulo, SP",
      salary: "R$ 12.000 - R$ 18.000",
      matchScore: 89,
      probabilityRank: 5,
      totalCandidates: 31,
      probabilityScore: 79,
      status: "Bom Match",
      type: "Growth Opportunity",
      postedDate: "3 dias atrás",
      applicants: 31,
      requirements: ["3+ anos", "Startup", "MVP"],
      benefits: ["Equity", "Flexibilidade", "Desenvolvimento"],
      whyGoodFit: [
        "Perfil startup ideal",
        "Experiência com MVP",
        "Flexibilidade valorizada"
      ],
      competitionLevel: "Média",
      interviewProbability: 75
    },
    {
      id: 4,
      title: "Director of Product",
      company: "Corporate Tech",
      location: "São Paulo, SP",
      salary: "R$ 22.000 - R$ 35.000",
      matchScore: 85,
      probabilityRank: 3,
      totalCandidates: 12,
      probabilityScore: 91,
      status: "Potencial Match",
      type: "Career Advancement",
      postedDate: "5 dias atrás",
      applicants: 12,
      requirements: ["7+ anos", "Enterprise", "Estratégia"],
      benefits: ["Carro da Empresa", "Previdência", "Stock Options"],
      whyGoodFit: [
        "Visão estratégica alinhada",
        "Experiência enterprise",
        "Potencial de crescimento"
      ],
      competitionLevel: "Baixa",
      interviewProbability: 89
    }
  ];

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

  const renderJobs = () => (
    <div className="space-y-6">
      {/* Jobs Section - Mock implementation */}
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Vagas Recomendadas</h3>
        <p className="text-gray-600 mb-4">
          Esta seção mostrará vagas personalizadas baseadas no seu perfil e cargo dos sonhos.
        </p>
        <div className="grid gap-4">
          {recommendedJobs.map((job) => (
            <div key={job.id} className="p-4 border border-gray-200 rounded-lg text-left">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                </div>
                <Badge className="bg-ravyz-green/10 text-ravyz-green">
                  {job.matchScore}% Match
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{job.salary}</p>
              <div className="flex flex-wrap gap-1">
                {job.requirements.map((req) => (
                  <Badge key={req} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Score do Perfil</p>
              <p className="text-2xl font-bold text-ravyz-green">{candidate.profileScore}%</p>
            </div>
            <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-ravyz-green" />
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
            <p className="text-sm text-gray-500">Top {Math.round(((candidate.marketRanking || 0) / (candidate.totalCandidates || 1)) * 100)}% de {(candidate.totalCandidates || 0).toLocaleString()}</p>
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

      {/* Ranking Detalhado */}
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
            {Array.isArray(candidate.technicalSkills) && candidate.technicalSkills.slice(0, 4).map((skill: any, index: number) => (
              <div key={skill.name || index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreBg(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getScoreColor(skill.level)}`}>
                    {skill.level}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Perfil Profissional */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-ravyz-purple" />
            Perfil Profissional
          </h3>
          <div className="text-center">
            <ProfileIcon 
              profileType={candidate.professionalProfile?.profileType || 'leadership'} 
              size="lg" 
              className="mx-auto mb-4"
            />
            <h4 className="font-semibold text-gray-900 mb-1">
              {candidate.professionalProfile?.primaryProfile || 'Líder Estratégico'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Com características de {candidate.professionalProfile?.secondaryProfile || 'Inovador Criativo'}
            </p>
            <div className="inline-flex items-center gap-2 bg-ravyz-purple/10 px-3 py-1 rounded-lg">
              <Trophy className="w-4 h-4 text-ravyz-purple" />
              <span className="text-sm font-medium text-ravyz-purple">Perfil de Alto Potencial</span>
            </div>
          </div>
        </Card>

        {/* Cargo dos Sonhos */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-ravyz-blue" />
            Cargo dos Sonhos
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Posição Desejada</h4>
              <p className="font-semibold text-ravyz-blue">{candidate.dreamJob.position}</p>
              <p className="text-sm text-gray-600">
                R$ {(candidate.dreamJob?.salaryRange?.min || 0).toLocaleString()} - 
                R$ {(candidate.dreamJob?.salaryRange?.max || 0).toLocaleString()}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Indústrias de Interesse</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(candidate.dreamJob?.industries) && candidate.dreamJob.industries.map((industry: string) => (
                  <Badge key={industry} variant="secondary" className="text-xs">{industry}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Valores Importantes</h4>
              <div className="space-y-1">
                {Array.isArray(candidate.dreamJob?.topValues) && candidate.dreamJob.topValues.map((value: string) => (
                  <div key={value} className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-ravyz-orange fill-current" />
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={onNavigateToMatching}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-ravyz-blue" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Vagas Compatíveis</h4>
              <p className="text-sm text-gray-600">Ver matching inteligente</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={onNavigateToFeedback}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-ravyz-orange" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Avaliações</h4>
              <p className="text-sm text-gray-600">Feedback de colegas</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={onNavigateToSalary}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-ravyz-green" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Benchmarking</h4>
              <p className="text-sm text-gray-600">Análise salarial</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </Card>
      </div>

      {/* Benchmarking Salarial */}
      <SalaryBenchmarking 
        currentPosition={candidate.title}
        currentLevel="Sênior"
        currentIndustry="Tecnologia"
        currentLocation={candidate.location}
        currentSalary={(candidate.dreamJob?.salaryRange?.min + candidate.dreamJob?.salaryRange?.max) / 2 || 15000}
        selectedMin={candidate.dreamJob?.salaryRange?.min || 12000}
        selectedMax={candidate.dreamJob?.salaryRange?.max || 18000}
      />
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Sobre Mim */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-ravyz-purple" />
            Sobre Mim
          </h3>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{detailedProfile.about}</p>
        </div>
      </Card>

      {/* Principais Destaques */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-ravyz-orange" />
          Principais Destaques
        </h3>
        
        <div className="space-y-8">
          {detailedProfile.highlights.map((highlight, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-ravyz-orange" />
                {highlight.category}
              </h4>
              <div className="grid gap-3 ml-7">
                {highlight.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-ravyz-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projetos Destacados */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-ravyz-blue" />
          Projetos Destacados
        </h3>
        
        <div className="space-y-6">
          {detailedProfile.projects.map((project, index) => (
            <div key={index} className="border-l-4 border-ravyz-blue pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{project.title}</h4>
                <Badge variant="outline" className="text-ravyz-blue border-ravyz-blue">
                  {project.year}
                </Badge>
              </div>
              <p className="text-gray-600">{project.description}</p>
              <div className="bg-ravyz-blue/5 p-3 rounded-lg">
                <p className="text-sm font-medium text-ravyz-blue">
                  💡 Impacto: {project.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Informações Pessoais */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-ravyz-green" />
          Informações Pessoais
        </h3>
        
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

      {/* Idiomas */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Languages className="w-6 h-6 text-ravyz-purple" />
          Idiomas
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {detailedProfile.languages.map((language, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-ravyz-purple" />
                  <span className="font-medium text-gray-900">{language.name}</span>
                  <Badge variant="outline" className="text-xs border-ravyz-purple/30 text-ravyz-purple">
                    {language.level}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-ravyz-purple">{language.proficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ravyz-purple h-2 rounded-full transition-all duration-300"
                  style={{ width: `${language.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certificações */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-ravyz-orange" />
          Certificações
        </h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {detailedProfile.certifications.map((cert, index) => (
            <div key={index} className="p-4 bg-ravyz-orange/5 rounded-lg border border-ravyz-orange/20">
              <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
              <p className="text-ravyz-orange font-medium text-sm">{cert.issuer}</p>
              <p className="text-xs text-gray-600 mt-1">{cert.year}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Técnicas */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-ravyz-green" />
          Competências Técnicas
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {(candidate.technicalSkills || []).map((skill: any) => (
            <div key={skill.name} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getScoreBg(skill.level)}`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(skill.level)} min-w-[3rem]`}>
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Comportamentais */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-ravyz-purple" />
          Competências Comportamentais
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {(candidate.softSkills || []).map((skill: any) => (
            <div key={skill.name} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getScoreBg(skill.level)}`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(skill.level)} min-w-[3rem]`}>
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Avaliações
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Vagas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          {renderProfile()}
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <CandidateFeedback candidateData={candidate} />
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          {renderJobs()}
        </TabsContent>
      </Tabs>
    </div>
  );
}