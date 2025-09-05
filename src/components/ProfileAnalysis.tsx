import { motion } from "motion/react";
import { User, Trophy, Target, Zap, Brain, Heart, TrendingUp, MapPin, Award, Star, Users, Briefcase, GraduationCap, Building2, Languages, Globe, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { UserAvatar } from "./UserAvatar";
import { ProfileIcon } from "./ProfileIcon";

interface ProfileAnalysisProps {
  profileAnswers: { [key: string]: number };
  cultureAnswers: { [key: string]: number };
  userData?: {
    name?: string;
    linkedinData?: {
      profilePhoto?: string;
      name?: string;
    };
    resumeData?: {
      extractedData?: {
        name?: string;
      };
    };
  };
}

export function ProfileAnalysis({ profileAnswers, cultureAnswers, userData }: ProfileAnalysisProps) {
  // Calcula o perfil principal baseado nas respostas
  const calculateMainProfile = () => {
    const avgProfile = Object.values(profileAnswers).reduce((sum, val) => sum + val, 0) / Object.values(profileAnswers).length;
    const avgCulture = Object.values(cultureAnswers).reduce((sum, val) => sum + val, 0) / Object.values(cultureAnswers).length;
    
    if (avgProfile >= 4.5 && avgCulture >= 4.5) return "Inovador Disruptivo";
    if (avgProfile >= 4 && avgCulture >= 4) return "Líder Visionário";
    if (avgProfile >= 3.5 && avgCulture >= 3.5) return "Executor Estratégico";
    if (avgProfile >= 3 && avgCulture >= 3) return "Especialista Colaborativo";
    return "Profissional Estruturado";
  };

  // Mapeia perfis para tipos do ProfileIcon
  const getProfileType = (profileName: string) => {
    const profileMapping = {
      "Inovador Disruptivo": "creative",
      "Líder Visionário": "leadership", 
      "Executor Estratégico": "execution",
      "Especialista Colaborativo": "communication",
      "Profissional Estruturado": "analytical"
    } as const;
    
    return profileMapping[profileName as keyof typeof profileMapping] || "execution";
  };

  // Mapeia perfis para cores
  const getProfileColor = (profileName: string) => {
    const colorMapping = {
      "Inovador Disruptivo": "ravyz-green",
      "Líder Visionário": "ravyz-orange", 
      "Executor Estratégico": "ravyz-orange",
      "Especialista Colaborativo": "ravyz-blue",
      "Profissional Estruturado": "ravyz-purple"
    };
    
    return colorMapping[profileName as keyof typeof colorMapping] || "ravyz-blue";
  };

  const calculateCharacteristics = () => {
    const characteristics = [];
    
    // Baseado nas respostas de perfil
    if (profileAnswers.work_pace >= 4) characteristics.push("Ritmo Acelerado");
    if (profileAnswers.decision_making >= 4) characteristics.push("Tomada de Decisão Rápida");
    if (profileAnswers.communication_style >= 4) characteristics.push("Comunicação Direta");
    if (profileAnswers.learning_style >= 4) characteristics.push("Aprendizado Prático");
    if (profileAnswers.problem_solving >= 4) characteristics.push("Solucionador Criativo");
    if (profileAnswers.work_environment >= 4) characteristics.push("Flexibilidade Remota");
    if (profileAnswers.team_interaction >= 4) characteristics.push("Liderança Natural");
    if (profileAnswers.innovation_comfort >= 4) characteristics.push("Inovador");

    // Baseado nas respostas de cultura
    if (cultureAnswers.company_values >= 4) characteristics.push("Orientado à Inovação");
    if (cultureAnswers.leadership_style >= 4) characteristics.push("Autonomia Elevada");
    if (cultureAnswers.feedback_culture >= 4) characteristics.push("Feedback Contínuo");
    if (cultureAnswers.work_life_balance >= 4) characteristics.push("Work-Life Integration");
    if (cultureAnswers.growth_mindset >= 4) characteristics.push("Crescimento Acelerado");
    if (cultureAnswers.diversity_inclusion >= 4) characteristics.push("Diversidade Ativa");
    if (cultureAnswers.risk_tolerance >= 4) characteristics.push("Alto Risco");

    return characteristics.slice(0, 8); // Máximo de 8 características
  };

  const calculateScores = () => {
    const innovation = Math.round(((profileAnswers.innovation_comfort || 3) + (cultureAnswers.company_values || 3)) / 2 * 20);
    const leadership = Math.round(((profileAnswers.team_interaction || 3) + (cultureAnswers.leadership_style || 3)) / 2 * 20);
    const adaptability = Math.round(((profileAnswers.learning_style || 3) + (cultureAnswers.growth_mindset || 3)) / 2 * 20);
    const communication = Math.round(profileAnswers.communication_style * 20);
    const autonomy = Math.round(cultureAnswers.leadership_style * 20);
    
    return { innovation, leadership, adaptability, communication, autonomy };
  };

  const generateRanking = () => {
    const allScores = Object.values(calculateScores());
    const averageScore = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
    
    // Simula ranking baseado na média dos scores
    if (averageScore >= 90) return { regional: 5, national: 2, percentile: 95 };
    if (averageScore >= 80) return { regional: 15, national: 8, percentile: 85 };
    if (averageScore >= 70) return { regional: 35, national: 25, percentile: 75 };
    if (averageScore >= 60) return { regional: 60, national: 50, percentile: 60 };
    return { regional: 85, national: 75, percentile: 45 };
  };

  // Gera dados detalhados simulados baseados no perfil
  const generateDetailedProfile = () => {
    const userName = userData?.linkedinData?.name || userData?.name || "Breno Calazans";
    
    return {
      education: [
        {
          institution: "Universidade de São Paulo (USP)",
          degree: "Bacharelado em Ciência da Computação",
          period: "2018 - 2022",
          distinction: "Magna Cum Laude",
          highlights: ["Projeto final em IA premiado", "Monitor de Algoritmos e Estruturas de Dados"]
        },
        {
          institution: "Stanford University",
          degree: "Certificação em Machine Learning",
          period: "2023",
          distinction: "Online Course",
          highlights: ["Andrew Ng Course", "98% de aproveitamento"]
        }
      ],
      experience: [
        {
          company: "Nubank",
          position: "Senior Software Engineer",
          period: "2022 - Presente",
          achievements: [
            "Liderou desenvolvimento de sistema de recomendações que aumentou conversão em 23%",
            "Mentoria de 5 desenvolvedores júnior",
            "Implementou arquitetura microserviços que reduziu latência em 40%"
          ]
        },
        {
          company: "iFood",
          position: "Software Engineer",
          period: "2021 - 2022",
          achievements: [
            "Desenvolveu API de geolocalização para otimização de entregas",
            "Contribuiu para redução de 15% no tempo médio de entrega",
            "Participou do projeto de expansão para mercado mexicano"
          ]
        }
      ],
      specializations: [
        {
          title: "Google Cloud Professional Data Engineer",
          issuer: "Google Cloud",
          date: "2023",
          credentialId: "GCP-DE-2023-BC789"
        },
        {
          title: "AWS Solutions Architect Associate",
          issuer: "Amazon Web Services",
          date: "2022",
          credentialId: "AWS-SAA-2022-BC456"
        },
        {
          title: "Scrum Master Certified",
          issuer: "Scrum Alliance",
          date: "2022",
          credentialId: "CSM-2022-BC123"
        }
      ],
      awards: [
        {
          title: "Hackathon Fintech Brasil - 1º Lugar",
          organization: "FIESP",
          year: "2023",
          description: "Solução de crédito usando IA para análise de risco"
        },
        {
          title: "Employee of the Quarter",
          organization: "Nubank",
          year: "2023",
          description: "Reconhecimento por liderança técnica e mentoria"
        },
        {
          title: "Best Final Project",
          organization: "USP - Ciência da Computação",
          year: "2022",
          description: "Sistema de IA para predição de falhas em infraestrutura"
        }
      ],
      languages: [
        { name: "Português", level: "Nativo", proficiency: 100 },
        { name: "Inglês", level: "Fluente", proficiency: 95 },
        { name: "Espanhol", level: "Intermediário", proficiency: 70 },
        { name: "Japonês", level: "Básico", proficiency: 30 }
      ],
      skills: [
        { name: "Python", level: 95 },
        { name: "JavaScript/TypeScript", level: 90 },
        { name: "React", level: 88 },
        { name: "Machine Learning", level: 85 },
        { name: "AWS", level: 82 },
        { name: "Docker/Kubernetes", level: 80 }
      ]
    };
  };

  const mainProfile = calculateMainProfile();
  const characteristics = calculateCharacteristics();
  const scores = calculateScores();
  const ranking = generateRanking();
  const detailedProfile = generateDetailedProfile();

  const profileDescriptions = {
    "Inovador Disruptivo": "Profissional com alta capacidade de inovação e adaptação, busca constantemente novos desafios e soluções criativas.",
    "Líder Visionário": "Natural líder com visão estratégica, capaz de inspirar equipes e conduzir mudanças organizacionais.",
    "Executor Estratégico": "Profissional focado em resultados com boa capacidade de planejamento e execução de projetos complexos.",
    "Especialista Colaborativo": "Especialista técnico com forte orientação para trabalho em equipe e compartilhamento de conhecimento.",
    "Profissional Estruturado": "Profissional que valoriza processos bem definidos e ambientes organizacionais estáveis."
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
          <Brain className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Perfil Profissional</h2>
        <p className="text-gray-600">Análise baseada nas suas respostas</p>
      </div>

      {/* Perfil Principal */}
      <Card className={`p-6 mb-6 border-2 border-${getProfileColor(mainProfile)}/20 bg-gradient-to-br from-white to-${getProfileColor(mainProfile)}/5`}>
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-6">
            <div className="flex items-center justify-center">
              <ProfileIcon 
                profileType={getProfileType(mainProfile)} 
                size="xl"
                className="border-4 border-white shadow-lg"
              />
              {userData?.linkedinData?.profilePhoto && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-ravyz-green rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{mainProfile}</h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                {profileDescriptions[mainProfile as keyof typeof profileDescriptions]}
              </p>
            </div>
            
            {/* Nome do usuário */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <UserAvatar 
                userData={userData} 
                size="sm" 
                className={`w-8 h-8 border-2 border-${getProfileColor(mainProfile)}/20`}
              />
              <p className="font-medium text-gray-900">
                {userData?.linkedinData?.name || userData?.name || "Breno Calazans"}
              </p>
            </div>
            
            {/* Badge de destaque */}
            <div className="flex justify-center">
              <Badge className={`bg-${getProfileColor(mainProfile)}/10 text-${getProfileColor(mainProfile)} border border-${getProfileColor(mainProfile)}/20 px-4 py-1`}>
                <Trophy className="w-4 h-4 mr-2" />
                Perfil de Alto Potencial
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 text-ravyz-orange mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Ranking Regional</h4>
          <p className="text-2xl font-bold text-ravyz-orange">#{ranking.regional}</p>
          <p className="text-sm text-gray-600">São Paulo</p>
        </Card>
        
        <Card className="p-4 text-center">
          <Award className="w-8 h-8 text-ravyz-blue mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Ranking Nacional</h4>
          <p className="text-2xl font-bold text-ravyz-blue">#{ranking.national}</p>
          <p className="text-sm text-gray-600">Brasil</p>
        </Card>
        
        <Card className="p-4 text-center">
          <Star className="w-8 h-8 text-ravyz-green mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Percentil</h4>
          <p className="text-2xl font-bold text-ravyz-green">{ranking.percentile}%</p>
          <p className="text-sm text-gray-600">Top performers</p>
        </Card>
      </div>

      {/* Características */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-ravyz-orange" />
            Principais Características
          </h3>
          
          {/* Ícone do Perfil */}
          <div className="flex items-center gap-3">
            <ProfileIcon 
              profileType={getProfileType(mainProfile)} 
              size="md"
              className="flex-shrink-0"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{mainProfile}</p>
              <p className="text-xs text-gray-500">Seu perfil</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Stats rápidas do perfil */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold text-${getProfileColor(mainProfile)}`}>
                {characteristics.length}
              </p>
              <p className="text-xs text-gray-600">Características</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold text-${getProfileColor(mainProfile)}`}>
                {ranking.percentile}%
              </p>
              <p className="text-xs text-gray-600">Percentil</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold text-${getProfileColor(mainProfile)}`}>
                #{ranking.regional}
              </p>
              <p className="text-xs text-gray-600">Ranking SP</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {characteristics.map((characteristic, index) => (
              <Badge key={index} variant="secondary" className={`bg-${getProfileColor(mainProfile)}/10 text-${getProfileColor(mainProfile)} border-${getProfileColor(mainProfile)}/20 hover:bg-${getProfileColor(mainProfile)}/20 transition-colors`}>
                {characteristic}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Insight sobre o perfil */}
        <div className={`mt-4 p-4 bg-gradient-to-r from-${getProfileColor(mainProfile)}/5 to-${getProfileColor(mainProfile)}/10 rounded-lg border border-${getProfileColor(mainProfile)}/20`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 bg-${getProfileColor(mainProfile)}/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Brain className={`w-4 h-4 text-${getProfileColor(mainProfile)}`} />
            </div>
            <div>
              <p className={`text-sm font-medium text-${getProfileColor(mainProfile)} mb-1`}>💡 Insight do Perfil</p>
              <p className="text-sm text-gray-700">
                Como <strong>{mainProfile}</strong>, você se destaca por {characteristics.slice(0, 3).join(', ').toLowerCase()}. 
                Essas características são altamente valorizadas em posições que exigem 
                {mainProfile.includes('Inovador') ? ' criatividade e visão disruptiva' :
                 mainProfile.includes('Líder') ? ' liderança estratégica e inspiração de equipes' :
                 mainProfile.includes('Executor') ? ' foco em resultados e execução eficiente' :
                 mainProfile.includes('Colaborativo') ? ' trabalho em equipe e comunicação efetiva' :
                 ' organização e processos bem estruturados'}.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Scores Detalhados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-ravyz-green" />
          Análise Detalhada
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-ravyz-purple" />
                <span className="font-medium text-gray-900">Inovação</span>
              </div>
              <span className="text-sm font-medium text-ravyz-purple">{scores.innovation}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ravyz-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${scores.innovation}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ravyz-blue" />
                <span className="font-medium text-gray-900">Liderança</span>
              </div>
              <span className="text-sm font-medium text-ravyz-blue">{scores.leadership}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ravyz-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${scores.leadership}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-ravyz-green" />
                <span className="font-medium text-gray-900">Adaptabilidade</span>
              </div>
              <span className="text-sm font-medium text-ravyz-green">{scores.adaptability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ravyz-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${scores.adaptability}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-ravyz-orange" />
                <span className="font-medium text-gray-900">Comunicação</span>
              </div>
              <span className="text-sm font-medium text-ravyz-orange">{scores.communication}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ravyz-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${scores.communication}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-700" />
                <span className="font-medium text-gray-900">Autonomia</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{scores.autonomy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scores.autonomy}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Formação Acadêmica */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-ravyz-blue" />
          Formação Acadêmica
        </h3>
        <div className="space-y-4">
          {detailedProfile.education.map((edu, index) => (
            <div key={index} className="border-l-2 border-ravyz-blue/20 pl-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-ravyz-blue font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.period}</p>
                  {edu.distinction && (
                    <Badge variant="secondary" className="mt-1 bg-ravyz-blue/10 text-ravyz-blue border-ravyz-blue/20">
                      {edu.distinction}
                    </Badge>
                  )}
                </div>
              </div>
              {edu.highlights && (
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  {edu.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-ravyz-blue rounded-full mt-2 flex-shrink-0"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Experiência Profissional */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-ravyz-green" />
          Experiência Profissional
        </h3>
        <div className="space-y-6">
          {detailedProfile.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-ravyz-green/20 pl-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                  <p className="text-ravyz-green font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <h5 className="font-medium text-gray-900 mb-2">Principais Conquistas:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-ravyz-green rounded-full mt-2 flex-shrink-0"></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certificações e Cursos */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-ravyz-orange" />
          Certificações Especializadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedProfile.specializations.map((cert, index) => (
            <div key={index} className="p-4 bg-ravyz-orange/5 rounded-lg border border-ravyz-orange/20">
              <h4 className="font-semibold text-gray-900 mb-1">{cert.title}</h4>
              <p className="text-ravyz-orange font-medium text-sm">{cert.issuer}</p>
              <p className="text-xs text-gray-600 mt-1">{cert.date}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Prêmios e Reconhecimentos */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-ravyz-purple" />
          Prêmios e Reconhecimentos
        </h3>
        <div className="space-y-4">
          {detailedProfile.awards.map((award, index) => (
            <div key={index} className="p-4 bg-ravyz-purple/5 rounded-lg border border-ravyz-purple/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{award.title}</h4>
                  <p className="text-ravyz-purple font-medium">{award.organization}</p>
                  <p className="text-sm text-gray-600">{award.year}</p>
                </div>
                <Trophy className="w-5 h-5 text-ravyz-purple flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-600">{award.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Idiomas */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5 text-ravyz-blue" />
          Idiomas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedProfile.languages.map((language, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-ravyz-blue" />
                  <span className="font-medium text-gray-900">{language.name}</span>
                  <Badge variant="outline" className="text-xs border-ravyz-blue/30 text-ravyz-blue">
                    {language.level}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-ravyz-blue">{language.proficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ravyz-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${language.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Habilidades Técnicas */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-ravyz-green" />
          Principais Habilidades Técnicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedProfile.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-sm font-medium text-ravyz-green">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ravyz-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-ravyz-purple/10 to-ravyz-blue/10 border-ravyz-purple/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pronto para o Próximo Passo?</h3>
          <p className="text-gray-600 mb-4">
            Agora vamos encontrar empresas que combinam perfeitamente com seu perfil profissional.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}