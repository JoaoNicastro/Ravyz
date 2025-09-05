import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Star, MapPin, Building2, GraduationCap, Code, Users, Brain, Mail, Phone, Calendar, Award, Target, TrendingUp, MessageCircle, Database, Bookmark } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { RavyzButton } from "./RavyzButton";
import ravyzLogo from 'figma:asset/8960371eebb802b3117a00de4cf27c5cf9c567af.png';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  matchScore: number;
  
  // Dados básicos
  age: number;
  gender: string;
  
  // Formação
  education: string;
  institution: string;
  
  // Experiência
  currentCompany: string;
  previousCompanies: string[];
  industries: string[];
  
  // Skills
  hardSkills: string[];
  
  // Scores comportamentais (1-5)
  softSkills: {
    leadership: number;
    communication: number;
    problemSolving: number;
    creativity: number;
    teamwork: number;
    adaptability: number;
  };
  
  personality: {
    analytical: number;
    extroversion: number;
    innovation: number;
    resilience: number;
    attention: number;
    autonomy: number;
  };
  
  // Expectativas
  salaryExpectation: {
    min: number;
    max: number;
  };
  workModelPreference: string;
  
  // Disponibilidade
  availability: string;
  lastActive: string;
}

interface CandidateRecommendationsProps {
  jobData: any;
  onBack: () => void;
  onContactCandidate: (candidate: Candidate) => void;
}

interface CandidateAction {
  action: 'message' | 'interview' | 'database' | 'save';
  candidate: Candidate;
}

export function CandidateRecommendations({ jobData, onBack, onContactCandidate }: CandidateRecommendationsProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Dados padrão caso jobData seja null
  const defaultJobData = {
    title: "Desenvolvedor Frontend React",
    department: "Tecnologia",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 8000, max: 15000 },
    benefits: ["Vale Refeição", "Plano de Saúde", "Flex Office"],
    hardSkills: ["JavaScript", "React", "TypeScript", "Git", "HTML/CSS"],
    industries: ["technology"],
    companies: ["Nubank", "iFood", "Stone"]
  };

  // Usar jobData se existir, senão usar dados padrão
  const currentJobData = jobData || defaultJobData;

  const handleCandidateAction = (action: CandidateAction['action'], candidate: Candidate) => {
    switch (action) {
      case 'message':
        console.log(`Enviando mensagem para ${candidate.name}`);
        alert(`💬 Mensagem enviada para ${candidate.name}!`);
        break;
      case 'interview':
        console.log(`Agendando entrevista com ${candidate.name}`);
        alert(`📅 Entrevista agendada com ${candidate.name}!`);
        break;
      case 'database':
        console.log(`Adicionando ${candidate.name} ao banco de dados`);
        alert(`💾 ${candidate.name} adicionado ao banco de dados!`);
        break;
      case 'save':
        console.log(`Salvando ${candidate.name} para depois`);
        alert(`🔖 ${candidate.name} salvo para análise posterior!`);
        break;
    }
  };

  // Mock candidates baseados nas flags da vaga
  const generateMockCandidates = (): Candidate[] => {
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Ana Silva Santos',
        title: 'Desenvolvedora Frontend Sênior',
        location: 'São Paulo, SP',
        avatar: 'https://images.unsplash.com/photo-1712174766230-cb7304feaafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjA2OTgxMnww&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 95,
        age: 28,
        gender: 'female',
        education: 'bachelor',
        institution: 'USP',
        currentCompany: 'Nubank',
        previousCompanies: ['iFood', 'Stone'],
        industries: ['technology', 'finance'],
        hardSkills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Git', 'SQL'],
        softSkills: {
          leadership: 4,
          communication: 5,
          problemSolving: 5,
          creativity: 4,
          teamwork: 5,
          adaptability: 4
        },
        personality: {
          analytical: 5,
          extroversion: 4,
          innovation: 4,
          resilience: 5,
          attention: 5,
          autonomy: 4
        },
        salaryExpectation: {
          min: 8000,
          max: 12000
        },
        workModelPreference: 'hibrido',
        availability: 'Disponível em 30 dias',
        lastActive: '2 horas atrás'
      },
      {
        id: '2',
        name: 'Carlos Eduardo Lima',
        title: 'Desenvolvedor Full Stack',
        location: 'Rio de Janeiro, RJ',
        avatar: 'https://images.unsplash.com/photo-1731951039706-0e793240bb32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYxNTMxMzF8MA&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 92,
        age: 32,
        gender: 'male',
        education: 'postgrad',
        institution: 'PUC-RJ',
        currentCompany: 'Stone',
        previousCompanies: ['Globo', 'Petrobras'],
        industries: ['technology', 'media'],
        hardSkills: ['JavaScript', 'React', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
        softSkills: {
          leadership: 5,
          communication: 4,
          problemSolving: 5,
          creativity: 3,
          teamwork: 4,
          adaptability: 5
        },
        personality: {
          analytical: 5,
          extroversion: 3,
          innovation: 4,
          resilience: 4,
          attention: 5,
          autonomy: 5
        },
        salaryExpectation: {
          min: 10000,
          max: 15000
        },
        workModelPreference: 'remoto',
        availability: 'Disponível imediatamente',
        lastActive: '1 dia atrás'
      },
      {
        id: '3',
        name: 'Mariana Costa Oliveira',
        title: 'Desenvolvedora Frontend',
        location: 'Belo Horizonte, MG',
        avatar: 'https://images.unsplash.com/photo-1726639348456-19645d99d9d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU2MTQ0OTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 89,
        age: 26,
        gender: 'female',
        education: 'bachelor',
        institution: 'UFMG',
        currentCompany: 'Mercado Livre',
        previousCompanies: ['Magazine Luiza'],
        industries: ['technology', 'retail'],
        hardSkills: ['JavaScript', 'React', 'TypeScript', 'Figma', 'HTML/CSS', 'Git'],
        softSkills: {
          leadership: 3,
          communication: 5,
          problemSolving: 4,
          creativity: 5,
          teamwork: 5,
          adaptability: 4
        },
        personality: {
          analytical: 4,
          extroversion: 5,
          innovation: 5,
          resilience: 4,
          attention: 4,
          autonomy: 3
        },
        salaryExpectation: {
          min: 7000,
          max: 10000
        },
        workModelPreference: 'hibrido',
        availability: 'Disponível em 45 dias',
        lastActive: '3 horas atrás'
      },
      {
        id: '4',
        name: 'Roberto Santos Silva',
        title: 'Tech Lead Frontend',
        location: 'São Paulo, SP',
        avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjEwOTI0M3ww&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 87,
        age: 35,
        gender: 'male',
        education: 'masters',
        institution: 'Insper',
        currentCompany: 'iFood',
        previousCompanies: ['Uber', '99'],
        industries: ['technology'],
        hardSkills: ['JavaScript', 'React', 'Node.js', 'AWS', 'MongoDB', 'Git'],
        softSkills: {
          leadership: 5,
          communication: 4,
          problemSolving: 5,
          creativity: 3,
          teamwork: 4,
          adaptability: 3
        },
        personality: {
          analytical: 5,
          extroversion: 3,
          innovation: 3,
          resilience: 5,
          attention: 5,
          autonomy: 5
        },
        salaryExpectation: {
          min: 12000,
          max: 18000
        },
        workModelPreference: 'presencial',
        availability: 'Avaliando propostas',
        lastActive: '5 horas atrás'
      },
      {
        id: '5',
        name: 'Juliana Ferreira Costa',
        title: 'Desenvolvedora React',
        location: 'Florianópolis, SC',
        avatar: 'https://images.unsplash.com/photo-1745434159123-4908d0b9df94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYwOTQxODB8MA&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 85,
        age: 29,
        gender: 'female',
        education: 'bachelor',
        institution: 'UFSC',
        currentCompany: 'Conta Azul',
        previousCompanies: ['SoftExpert'],
        industries: ['technology'],
        hardSkills: ['JavaScript', 'React', 'TypeScript', 'Redux', 'Jest', 'Git'],
        softSkills: {
          leadership: 3,
          communication: 4,
          problemSolving: 5,
          creativity: 4,
          teamwork: 5,
          adaptability: 5
        },
        personality: {
          analytical: 4,
          extroversion: 4,
          innovation: 4,
          resilience: 4,
          attention: 5,
          autonomy: 4
        },
        salaryExpectation: {
          min: 8500,
          max: 12000
        },
        workModelPreference: 'remoto',
        availability: 'Disponível em 30 dias',
        lastActive: '1 hora atrás'
      },
      {
        id: '6',
        name: 'Felipe Rodrigues Alves',
        title: 'Desenvolvedor Frontend Pleno',
        location: 'Porto Alegre, RS',
        avatar: 'https://images.unsplash.com/photo-1638452033979-14fba9e17fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5b3VuZyUyMG1hbiUyMGRldmVsb3BlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTYxNTMxNDR8MA&ixlib=rb-4.1.0&q=80&w=400',
        matchScore: 83,
        age: 27,
        gender: 'male',
        education: 'bachelor',
        institution: 'UFRGS',
        currentCompany: 'Banrisul',
        previousCompanies: ['Dell', 'HP'],
        industries: ['finance', 'technology'],
        hardSkills: ['JavaScript', 'React', 'Vue.js', 'Node.js', 'SQL', 'Git'],
        softSkills: {
          leadership: 2,
          communication: 4,
          problemSolving: 4,
          creativity: 4,
          teamwork: 5,
          adaptability: 4
        },
        personality: {
          analytical: 4,
          extroversion: 3,
          innovation: 4,
          resilience: 4,
          attention: 5,
          autonomy: 3
        },
        salaryExpectation: {
          min: 6500,
          max: 9000
        },
        workModelPreference: 'hibrido',
        availability: 'Disponível em 60 dias',
        lastActive: '2 dias atrás'
      }
    ];

    return mockCandidates;
  };

  const candidates = generateMockCandidates();

  const getMatchReasons = (candidate: Candidate) => {
    const reasons = [];
    
    // Skills match
    const skillsMatch = candidate.hardSkills.filter(skill => currentJobData.hardSkills?.includes(skill)).length;
    if (skillsMatch > 0) {
      reasons.push(`${skillsMatch} hard skills em comum`);
    }
    
    // Industry match
    const industryMatch = candidate.industries.some(ind => currentJobData.industries?.includes(ind));
    if (industryMatch) {
      reasons.push('Experiência no setor desejado');
    }
    
    // Company match
    const companyMatch = candidate.previousCompanies.some(comp => currentJobData.companies?.includes(comp)) || 
                        currentJobData.companies?.includes(candidate.currentCompany);
    if (companyMatch) {
      reasons.push('Experiência em empresa de referência');
    }
    
    // Work model match
    if (candidate.workModelPreference === currentJobData.workModel) {
      reasons.push('Preferência de modelo de trabalho compatível');
    }
    
    // Salary match
    const salaryCompatible = candidate.salaryExpectation.min <= currentJobData.salary?.max && 
                           candidate.salaryExpectation.max >= currentJobData.salary?.min;
    if (salaryCompatible) {
      reasons.push('Expectativa salarial compatível');
    }
    
    return reasons.slice(0, 3); // Mostrar apenas os 3 principais
  };

  const getSkillsMatchPercentage = (candidate: Candidate) => {
    if (!currentJobData.hardSkills || currentJobData.hardSkills.length === 0) return 0;
    const matchingSkills = candidate.hardSkills.filter(skill => currentJobData.hardSkills.includes(skill)).length;
    return Math.round((matchingSkills / currentJobData.hardSkills.length) * 100);
  };

  const getSoftSkillAverage = (candidate: Candidate) => {
    const values = Object.values(candidate.softSkills);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 20); // Convert to percentage
  };

  const getPersonalityAverage = (candidate: Candidate) => {
    const values = Object.values(candidate.personality);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 20); // Convert to percentage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 bg-gray-50 rounded-md flex items-center justify-center p-1 border border-gray-200">
                  <img 
                    src={ravyzLogo} 
                    alt="RAVYZ" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Candidatos Recomendados</h1>
                  <p className="text-sm text-gray-600">Baseado no perfil da vaga criada</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-ravyz-green/10 text-ravyz-green border-ravyz-green/20">
                {candidates.length} candidatos encontrados
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-ravyz-green to-ravyz-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Candidatos Perfeitos para {currentJobData.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nossa IA analisou nosso banco de talentos e encontrou os candidatos com maior compatibilidade 
            baseado no perfil que você definiu.
          </p>
        </div>

        {/* Job Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentJobData.title}</h2>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {currentJobData.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentJobData.location}
                  </span>
                  <span>•</span>
                  <span>{currentJobData.workModel}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-ravyz-green">
                  R$ {currentJobData.salary?.min?.toLocaleString()} - {currentJobData.salary?.max?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{currentJobData.benefits?.length} benefícios</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentJobData.hardSkills?.slice(0, 6).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Candidates Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedCandidate(candidate)}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-ravyz-orange fill-current" />
                        <span className="font-bold text-ravyz-orange">{candidate.matchScore}%</span>
                      </div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {candidate.currentCompany}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Match */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Skills Match</span>
                  <span className="text-sm font-bold text-ravyz-green">
                    {getSkillsMatchPercentage(candidate)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-ravyz-green to-ravyz-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getSkillsMatchPercentage(candidate)}%` }}
                  />
                </div>
              </div>

              {/* Match Reasons */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Por que é um bom match:</h4>
                <div className="space-y-1">
                  {getMatchReasons(candidate).map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-ravyz-green rounded-full"></div>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{candidate.age}</div>
                  <div className="text-xs text-gray-600">Anos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    R$ {candidate.salaryExpectation.min / 1000}k-{candidate.salaryExpectation.max / 1000}k
                  </div>
                  <div className="text-xs text-gray-600">Expectativa</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{candidate.workModelPreference}</div>
                  <div className="text-xs text-gray-600">Preferência</div>
                </div>
              </div>

              {/* Skills Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Principais Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {candidate.hardSkills.slice(0, 4).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className={`text-xs ${currentJobData.hardSkills?.includes(skill) ? 'bg-ravyz-green text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {candidate.hardSkills.length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      +{candidate.hardSkills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ravyz-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">{candidate.availability}</span>
                </div>
                <span className="text-xs text-gray-500">{candidate.lastActive}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCandidateAction('message', candidate);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mensagem
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCandidateAction('interview', candidate);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCandidateAction('database', candidate);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    Banco
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCandidateAction('save', candidate);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Gostou dos candidatos encontrados?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa IA continua buscando novos talentos que se encaixem no perfil da sua vaga. 
              Você receberá notificações quando encontrarmos mais candidatos compatíveis.
            </p>
            <div className="flex gap-4 justify-center">
              <RavyzButton variant="outline" onClick={onBack}>
                Refinar Perfil da Vaga
              </RavyzButton>
              <RavyzButton variant="primary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Dashboard Completo
              </RavyzButton>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={selectedCandidate.avatar} 
                      alt={selectedCandidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                    <p className="text-gray-600">{selectedCandidate.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-ravyz-orange fill-current" />
                      <span className="font-bold text-ravyz-orange">{selectedCandidate.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Informações Básicas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Idade:</span>
                      <span className="font-medium">{selectedCandidate.age} anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Localização:</span>
                      <span className="font-medium">{selectedCandidate.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disponibilidade:</span>
                      <span className="font-medium">{selectedCandidate.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Último acesso:</span>
                      <span className="font-medium">{selectedCandidate.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Expectativas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salário:</span>
                      <span className="font-medium">
                        R$ {selectedCandidate.salaryExpectation.min / 1000}k - {selectedCandidate.salaryExpectation.max / 1000}k
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo de trabalho:</span>
                      <span className="font-medium capitalize">{selectedCandidate.workModelPreference}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hard Skills */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Hard Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.hardSkills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className={`${currentJobData.hardSkills?.includes(skill) ? 'bg-ravyz-green text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedCandidate.softSkills).map(([skill, score]) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-ravyz-purple h-2 rounded-full"
                            style={{ width: `${(score / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{score}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Experiência</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Empresa atual:</span>
                    <span className="font-medium ml-2">{selectedCandidate.currentCompany}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Empresas anteriores:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCandidate.previousCompanies.map((company) => (
                        <Badge key={company} variant="outline" className="bg-gray-50">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Setores:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCandidate.industries.map((industry) => (
                        <Badge key={industry} variant="outline" className="bg-blue-50 text-blue-700">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleCandidateAction('message', selectedCandidate)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar Mensagem
                </button>
                <button
                  onClick={() => handleCandidateAction('interview', selectedCandidate)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Agendar Entrevista
                </button>
                <button
                  onClick={() => handleCandidateAction('save', selectedCandidate)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  <Bookmark className="w-5 h-5" />
                  Salvar Candidato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}