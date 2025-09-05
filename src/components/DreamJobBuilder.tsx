import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, User, FileText, Sparkles, Building2, MapPin, DollarSign, Heart, Target, Zap, Users, Star, Trophy, Brain, Coffee, Lightbulb, Plus, GripVertical } from "lucide-react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { DreamJobPositionStep } from "./DreamJobPositionStep";
import { ProfileAnalysis } from "./ProfileAnalysis";
import { ContextualMentorMessage } from "./MentorMessage";
import { JobSalaryReference } from "./JobSalaryReference";
import { SalarySelectionStep } from "./SalarySelectionStep";
import { UserProfileHeader } from "./UserProfileHeader";
import { PersonalizedMessage } from "./PersonalizedMessage";

interface DreamJobData {
  // Perfil e Cultura (novo - primeiro)
  profileAnswers: { [key: string]: number };
  cultureAnswers: { [key: string]: number };
  
  // Empresas selecionadas
  selectedCompanies: string[];
  additionalCompanies: string[];
  
  // Dados básicos
  position: string;
  positionLevel: string;
  industry: string[];
  salaryRange: { min: number; max: number };
  location: string[];
  workModel: string[];
  companySize: string[];
  companyStage: string[];
  responsibilities: string[];
  challenges: string[];
  personalValues: { value: string; importance: number }[];
  workEnvironment: string[];
  benefits: string[];
  benefitsPriority: string[];
  companyRanking: string[];
  extractedProfile?: {
    currentPosition: string;
    experience: number;
    skills: string[];
    companies: string[];
    education: string[];
    suggestedIndustries: string[];
    suggestedSalary: { min: number; max: number };
  };
}

interface DreamJobBuilderProps {
  onComplete: (dreamJob: DreamJobData) => void;
  onBack: () => void;
  userProfile?: {
    primaryProfile: string;
    secondaryProfile: string;
  };
  userData?: {
    linkedinConnected: boolean;
    linkedinData?: any;
    extractedData?: any;
    mentor?: {
      name: string;
      avatar: string;
      color: string;
      category: string;
    };
  };
}

interface DraggableBenefitProps {
  benefit: string;
  index: number;
  moveBenefit: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableBenefit: React.FC<DraggableBenefitProps> = ({ benefit, index, moveBenefit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'benefit',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'benefit',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBenefit(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 bg-white border-2 border-ravyz-purple/20 rounded-xl cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:border-ravyz-purple/40 hover:shadow-sm'
      }`}
    >
      <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-ravyz-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <span className="font-medium text-gray-900">{benefit}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {index === 0 ? 'Mais importante' : index === 1 ? '2º lugar' : index === 2 ? '3º lugar' : `${index + 1}º lugar`}
      </div>
    </div>
  );
};

export function DreamJobBuilder(props: DreamJobBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAdditionalCompanies, setShowAdditionalCompanies] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMentorMessage, setShowMentorMessage] = useState(true);
  
  const [dreamJob, setDreamJob] = useState<DreamJobData>({
    profileAnswers: {},
    cultureAnswers: {},
    selectedCompanies: [],
    additionalCompanies: [],
    position: '',
    positionLevel: '',
    industry: [],
    salaryRange: { min: 3000, max: 12000 },
    location: [],
    workModel: [],
    companySize: [],
    companyStage: [],
    responsibilities: [],
    challenges: [],
    personalValues: [],
    workEnvironment: [],
    benefits: [],
    benefitsPriority: [],
    companyRanking: []
  });

  const steps = [
    { title: "Perfil Profissional", description: "Como você trabalha", icon: User },
    { title: "Cultura Organizacional", description: "Ambiente ideal", icon: Heart },
    { title: "Análise do Perfil", description: "Seus resultados", icon: Brain },
    { title: "Seleção de Empresas", description: "Empresas dos seus sonhos", icon: Building2 },
    { title: "Localização", description: "Onde trabalhar", icon: MapPin },
    { title: "Cargo dos Sonhos", description: "Posição e nível desejado", icon: Briefcase },
    { title: "Salário", description: "Faixa salarial desejada", icon: DollarSign },
    { title: "Benefícios", description: "Priorize o que é importante", icon: Trophy },
    { title: "Finalização", description: "Revisar e finalizar", icon: CheckCircle }
  ];

  const profileQuestions = [
    {
      id: 'work_pace',
      question: 'Como você prefere trabalhar?',
      description: 'Seu ritmo e estilo de trabalho ideal',
      options: [
        { text: 'Ritmo acelerado, sempre com urgência', value: 5 },
        { text: 'Ritmo dinâmico, mas com planejamento', value: 4 },
        { text: 'Ritmo equilibrado, sem pressa excessiva', value: 3 },
        { text: 'Ritmo mais calmo, com tempo para reflexão', value: 2 },
        { text: 'Ritmo bem tranquilo, sem pressão', value: 1 }
      ]
    },
    {
      id: 'decision_making',
      question: 'Como você toma decisões importantes?',
      description: 'Seu processo de tomada de decisão',
      options: [
        { text: 'Decido rapidamente, confio na intuição', value: 5 },
        { text: 'Analiso dados básicos e decido', value: 4 },
        { text: 'Busco equilíbrio entre análise e intuição', value: 3 },
        { text: 'Preciso de dados detalhados para decidir', value: 2 },
        { text: 'Analiso exaustivamente antes de decidir', value: 1 }
      ]
    },
    {
      id: 'communication_style',
      question: 'Como você prefere se comunicar no trabalho?',
      description: 'Seu estilo de comunicação preferido',
      options: [
        { text: 'Comunicação direta e objetiva', value: 5 },
        { text: 'Clara, mas com contexto', value: 4 },
        { text: 'Equilibrada entre formal e informal', value: 3 },
        { text: 'Mais elaborada e detalhada', value: 2 },
        { text: 'Formal e muito estruturada', value: 1 }
      ]
    },
    {
      id: 'learning_style',
      question: 'Como você aprende melhor?',
      description: 'Sua forma preferida de aprendizado',
      options: [
        { text: 'Experimentando e errando na prática', value: 5 },
        { text: 'Combinando teoria e prática', value: 4 },
        { text: 'Com mentoria e feedback constante', value: 3 },
        { text: 'Estudando teoria antes da prática', value: 2 },
        { text: 'Cursos estruturados e certificações', value: 1 }
      ]
    },
    {
      id: 'problem_solving',
      question: 'Como você resolve problemas complexos?',
      description: 'Sua abordagem para resolução de problemas',
      options: [
        { text: 'Soluções criativas e inovadoras', value: 5 },
        { text: 'Combino criatividade com métodos testados', value: 4 },
        { text: 'Uso abordagens equilibradas', value: 3 },
        { text: 'Prefiro métodos já validados', value: 2 },
        { text: 'Sigo processos estruturados e conhecidos', value: 1 }
      ]
    },
    {
      id: 'work_environment',
      question: 'Qual ambiente de trabalho você prefere?',
      description: 'Seu ambiente físico ideal',
      options: [
        { text: 'Totalmente remoto, máxima flexibilidade', value: 5 },
        { text: 'Híbrido, mais remoto que presencial', value: 4 },
        { text: 'Híbrido equilibrado', value: 3 },
        { text: 'Híbrido, mais presencial que remoto', value: 2 },
        { text: 'Presencial, interação constante', value: 1 }
      ]
    },
    {
      id: 'team_interaction',
      question: 'Como você trabalha em equipe?',
      description: 'Seu estilo de colaboração',
      options: [
        { text: 'Lidero e tomo iniciativas', value: 5 },
        { text: 'Contribuo ativamente com ideias', value: 4 },
        { text: 'Participo equilibradamente', value: 3 },
        { text: 'Prefiro executar bem as tarefas', value: 2 },
        { text: 'Trabalho melhor individualmente', value: 1 }
      ]
    },
    {
      id: 'innovation_comfort',
      question: 'Como você lida com mudanças e inovação?',
      description: 'Sua adaptabilidade a novidades',
      options: [
        { text: 'Busco constantemente inovações', value: 5 },
        { text: 'Gosto de testar novidades', value: 4 },
        { text: 'Aceito mudanças quando necessário', value: 3 },
        { text: 'Prefiro melhorar o que já existe', value: 2 },
        { text: 'Valorizo estabilidade e previsibilidade', value: 1 }
      ]
    }
  ];

  const cultureQuestions = [
    {
      id: 'company_values',
      question: 'Que tipo de valores empresariais são importantes para você?',
      description: 'Princípios organizacionais que valoriza',
      options: [
        { text: 'Inovação e disrupção constante', value: 5 },
        { text: 'Crescimento rápido e resultados', value: 4 },
        { text: 'Equilíbrio entre inovação e estabilidade', value: 3 },
        { text: 'Qualidade e excelência operacional', value: 2 },
        { text: 'Tradição e processos consolidados', value: 1 }
      ]
    },
    {
      id: 'leadership_style',
      question: 'Que estilo de liderança você prefere?',
      description: 'Como gosta de ser liderado',
      options: [
        { text: 'Total autonomia, mínima supervisão', value: 5 },
        { text: 'Direcionamento claro, execução livre', value: 4 },
        { text: 'Equilíbrio entre autonomia e orientação', value: 3 },
        { text: 'Orientação regular e feedback', value: 2 },
        { text: 'Supervisão próxima e estruturada', value: 1 }
      ]
    },
    {
      id: 'feedback_culture',
      question: 'Como você prefere receber feedback?',
      description: 'Frequência e estilo de feedback',
      options: [
        { text: 'Feedback contínuo e em tempo real', value: 5 },
        { text: 'Feedback frequente e direto', value: 4 },
        { text: 'Feedback regular e estruturado', value: 3 },
        { text: 'Feedback formal em reuniões', value: 2 },
        { text: 'Feedback apenas em avaliações', value: 1 }
      ]
    },
    {
      id: 'work_life_balance',
      question: 'Qual é sua expectativa sobre work-life balance?',
      description: 'Equilíbrio entre vida pessoal e profissional',
      options: [
        { text: 'Flexibilidade total, work-life integration', value: 5 },
        { text: 'Horários flexíveis, mas produtividade alta', value: 4 },
        { text: 'Equilíbrio saudável entre ambos', value: 3 },
        { text: 'Horários definidos, mas alguma flexibilidade', value: 2 },
        { text: 'Estrutura clara de horários', value: 1 }
      ]
    },
    {
      id: 'growth_mindset',
      question: 'Como você enxerga seu desenvolvimento profissional?',
      description: 'Sua abordagem de crescimento',
      options: [
        { text: 'Aprendizado contínuo e experimental', value: 5 },
        { text: 'Crescimento acelerado com desafios', value: 4 },
        { text: 'Desenvolvimento constante e estruturado', value: 3 },
        { text: 'Crescimento planejado e gradual', value: 2 },
        { text: 'Especialização profunda na área', value: 1 }
      ]
    },
    {
      id: 'diversity_inclusion',
      question: 'Quão importante é diversidade e inclusão para você?',
      description: 'Valorização da diversidade no ambiente',
      options: [
        { text: 'Fundamental, busco diversidade ativa', value: 5 },
        { text: 'Muito importante, valorizo diferenças', value: 4 },
        { text: 'Importante, respeito todas as pessoas', value: 3 },
        { text: 'Relevante, mas não é prioridade', value: 2 },
        { text: 'Não é um fator decisivo', value: 1 }
      ]
    },
    {
      id: 'risk_tolerance',
      question: 'Qual seu nível de conforto com riscos profissionais?',
      description: 'Tolerância a incertezas e riscos',
      options: [
        { text: 'Alto risco, alta recompensa', value: 5 },
        { text: 'Riscos calculados para crescimento', value: 4 },
        { text: 'Riscos moderados e bem avaliados', value: 3 },
        { text: 'Baixo risco, preferência por segurança', value: 2 },
        { text: 'Evito riscos, priorizo estabilidade', value: 1 }
      ]
    }
  ];

  const allCompanies = [
    { name: 'Google', logo: '🔍', industry: 'Tecnologia', description: 'Inovação e tecnologia de ponta' },
    { name: 'Microsoft', logo: '🪟', industry: 'Tecnologia', description: 'Transformação digital global' },
    { name: 'Apple', logo: '🍎', industry: 'Tecnologia', description: 'Design e inovação premium' },
    { name: 'Meta', logo: '📘', industry: 'Tecnologia', description: 'Conexões e realidade virtual' },
    { name: 'Amazon', logo: '📦', industry: 'E-commerce/Cloud', description: 'Liderança em e-commerce e cloud' },
    { name: 'Netflix', logo: '🎬', industry: 'Mídia/Tech', description: 'Entretenimento global streaming' },
    { name: 'Nubank', logo: '💜', industry: 'Fintech', description: 'Revolução no sistema financeiro' },
    { name: 'Stone', logo: '💎', industry: 'Fintech', description: 'Soluções de pagamento inovadoras' },
    { name: 'PagSeguro', logo: '💳', industry: 'Fintech', description: 'Ecossistema financeiro completo' },
    { name: 'XP Investimentos', logo: '💰', industry: 'Fintech', description: 'Democratização dos investimentos' },
    { name: 'BTG Pactual', logo: '🏦', industry: 'Fintech', description: 'Banco de investimento líder' },
    { name: 'iFood', logo: '🍔', industry: 'Delivery/Tech', description: 'Maior foodtech da América Latina' },
    { name: 'Magazine Luiza', logo: '🛒', industry: 'Varejo/Tech', description: 'Transformação digital no varejo' },
    { name: 'Mercado Livre', logo: '💛', industry: 'E-commerce', description: 'E-commerce líder na América Latina' },
    { name: 'Shopee', logo: '🛍️', industry: 'E-commerce', description: 'E-commerce social e gamificado' },
    { name: 'Tesla', logo: '⚡', industry: 'Automotivo/Tech', description: 'Mobilidade elétrica sustentável' },
    { name: 'Spotify', logo: '🎵', industry: 'Mídia/Tech', description: 'Streaming de música global' },
    { name: 'Uber', logo: '🚗', industry: 'Mobilidade', description: 'Mobilidade urbana inteligente' },
    { name: 'Airbnb', logo: '🏠', industry: 'Turismo/Tech', description: 'Experiências de hospedagem únicas' },
    { name: 'Ambev', logo: '🍺', industry: 'Consumo', description: 'Bebidas e experiências memoráveis' },
    { name: 'Vale', logo: '⛏️', industry: 'Mineração', description: 'Mineração sustentável global' },
    { name: 'Petrobras', logo: '🛢️', industry: 'Energia', description: 'Energia integrada e sustentável' },
    { name: 'Bradesco', logo: '🏛️', industry: 'Financeiro', description: 'Soluções financeiras completas' },
    { name: 'Itaú', logo: '🧡', industry: 'Financeiro', description: 'Banco digital líder' }
  ];

  const benefitOptions = [
    'Plano de saúde', 'Plano odontológico', 'Vale refeição', 'Vale alimentação',
    'Gympass', 'Home office', 'Horário flexível', 'Férias flexíveis',
    'Participação nos lucros', 'Stock options', 'Cursos e certificações',
    'Auxílio creche', 'Seguro de vida', 'Previdência privada', 'Day off aniversário'
  ];

  const getCompanySynergy = () => {
    const profile = dreamJob.profileAnswers;
    const culture = dreamJob.cultureAnswers;
    
    const companies = [
      {
        name: 'Google',
        logo: '🔍',
        industry: 'Tecnologia',
        synergy: calculateSynergy(profile, culture, {
          innovation: 5, pace: 4, autonomy: 4, learning: 5, diversity: 5
        }),
        description: 'Inovação, autonomia e aprendizado contínuo'
      },
      {
        name: 'Nubank',
        logo: '💜',
        industry: 'Fintech',
        synergy: calculateSynergy(profile, culture, {
          innovation: 5, pace: 5, communication: 4, growth: 5, balance: 4
        }),
        description: 'Cultura de inovação e crescimento rápido'
      },
      {
        name: 'iFood',
        logo: '🍔',
        industry: 'Tecnologia/Delivery',
        synergy: calculateSynergy(profile, culture, {
          pace: 5, innovation: 4, collaboration: 5, growth: 5, diversity: 4
        }),
        description: 'Ritmo acelerado e colaboração intensa'
      },
      {
        name: 'Stone',
        logo: '💎',
        industry: 'Fintech',
        synergy: calculateSynergy(profile, culture, {
          innovation: 4, autonomy: 4, results: 5, growth: 5, risk: 4
        }),
        description: 'Ambiente empreendedor e orientado a resultados'
      },
      {
        name: 'Magazine Luiza',
        logo: '🛒',
        industry: 'Varejo/Tech',
        synergy: calculateSynergy(profile, culture, {
          innovation: 4, diversity: 5, collaboration: 4, growth: 4, balance: 3
        }),
        description: 'Transformação digital e diversidade'
      },
      {
        name: 'Ambev',
        logo: '🍺',
        industry: 'Consumo',
        synergy: calculateSynergy(profile, culture, {
          results: 5, leadership: 4, structure: 3, growth: 4, tradition: 3
        }),
        description: 'Foco em resultados e desenvolvimento estruturado'
      }
    ];

    return companies.sort((a, b) => b.synergy - a.synergy);
  };

  const calculateSynergy = (profileAnswers: any, cultureAnswers: any, companyProfile: any) => {
    let totalScore = 0;
    let weights = 0;

    const userProfile = {
      innovation: (profileAnswers.innovation_comfort || 3) + (cultureAnswers.company_values || 3) / 2,
      pace: profileAnswers.work_pace || 3,
      autonomy: (profileAnswers.decision_making || 3) + (cultureAnswers.leadership_style || 3) / 2,
      learning: (profileAnswers.learning_style || 3) + (cultureAnswers.growth_mindset || 3) / 2,
      diversity: cultureAnswers.diversity_inclusion || 3,
      communication: profileAnswers.communication_style || 3,
      growth: cultureAnswers.growth_mindset || 3,
      balance: cultureAnswers.work_life_balance || 3,
      results: profileAnswers.problem_solving || 3,
      leadership: cultureAnswers.leadership_style || 3,
      structure: 6 - (profileAnswers.innovation_comfort || 3),
      tradition: 6 - (cultureAnswers.company_values || 3),
      collaboration: profileAnswers.team_interaction || 3,
      risk: cultureAnswers.risk_tolerance || 3
    };

    Object.keys(companyProfile).forEach(key => {
      if (userProfile[key] !== undefined) {
        const distance = Math.abs(userProfile[key] - companyProfile[key]);
        const score = Math.max(0, 5 - distance);
        totalScore += score;
        weights += 1;
      }
    });

    return weights > 0 ? Math.round((totalScore / weights) * 20) : 50;
  };

  const updateAnswer = useCallback((questionId: string, value: number, isProfile: boolean = true) => {
    setSelectedOption(value);
    setIsTransitioning(true);

    // Primeiro atualiza a resposta
    setDreamJob(prev => ({
      ...prev,
      [isProfile ? 'profileAnswers' : 'cultureAnswers']: {
        ...prev[isProfile ? 'profileAnswers' : 'cultureAnswers'],
        [questionId]: value
      }
    }));

    // Depois de um pequeno delay, avança automaticamente
    setTimeout(() => {
      const isLastProfileQuestion = isProfile && currentQuestionIndex === profileQuestions.length - 1;
      const isLastCultureQuestion = !isProfile && currentQuestionIndex === cultureQuestions.length - 1;

      if (isLastProfileQuestion || isLastCultureQuestion) {
        // Se é a última pergunta da seção, vai para a próxima etapa
        setCurrentStep(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Senão, vai para a próxima pergunta
        setCurrentQuestionIndex(prev => prev + 1);
      }
      
      setIsTransitioning(false);
      setSelectedOption(null);
    }, 800);
  }, [currentQuestionIndex]);

  const updateDreamJob = useCallback((field: keyof DreamJobData, value: any) => {
    setDreamJob(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayItem = useCallback((field: keyof DreamJobData, item: string) => {
    setDreamJob(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const toggleCompanySelection = useCallback((companyName: string, isAdditional: boolean = false) => {
    const field = isAdditional ? 'additionalCompanies' : 'selectedCompanies';
    setDreamJob(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(companyName)
        ? currentArray.filter(c => c !== companyName)
        : [...currentArray, companyName];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const toggleBenefitSelection = useCallback((benefit: string) => {
    setDreamJob(prev => {
      const currentArray = prev.benefitsPriority;
      let newArray;
      
      if (currentArray.includes(benefit)) {
        // Remove benefit
        newArray = currentArray.filter(b => b !== benefit);
      } else {
        // Add benefit
        newArray = [...currentArray, benefit];
      }
      
      return { ...prev, benefitsPriority: newArray };
    });
  }, []);

  const moveBenefit = useCallback((dragIndex: number, hoverIndex: number) => {
    setDreamJob(prev => {
      const newBenefits = [...prev.benefitsPriority];
      const draggedBenefit = newBenefits[dragIndex];
      newBenefits.splice(dragIndex, 1);
      newBenefits.splice(hoverIndex, 0, draggedBenefit);
      return { ...prev, benefitsPriority: newBenefits };
    });
  }, []);

  const handleSalaryRangeUpdate = useCallback((min: number, max: number) => {
    setDreamJob(prev => ({
      ...prev,
      salaryRange: { min, max }
    }));
  }, []);

  const handleNext = () => {
    if (currentStep === 0 && currentQuestionIndex < profileQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return;
    }
    
    if (currentStep === 1 && currentQuestionIndex < cultureQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      props.onComplete(dreamJob);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      return;
    }
    
    if (currentStep === 1 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      return;
    }
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === 1) {
        setCurrentQuestionIndex(cultureQuestions.length - 1);
      } else if (currentStep === 2) {
        setCurrentQuestionIndex(cultureQuestions.length - 1);
      } else {
        setCurrentQuestionIndex(0);
      }
    } else {
      props.onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Perfil
        return dreamJob.profileAnswers[profileQuestions[currentQuestionIndex]?.id] !== undefined;
      case 1: // Cultura
        return dreamJob.cultureAnswers[cultureQuestions[currentQuestionIndex]?.id] !== undefined;
      case 2: // Análise do Perfil
        return Object.keys(dreamJob.profileAnswers).length > 0 && Object.keys(dreamJob.cultureAnswers).length > 0;
      case 3: // Empresas
        return dreamJob.selectedCompanies.length > 0 || dreamJob.additionalCompanies.length > 0;
      case 4: // Localização
        return dreamJob.location.length > 0 || dreamJob.workModel.length > 0;
      case 5: // Cargo
        return dreamJob.position && dreamJob.positionLevel;
      case 6: // Salário
        return dreamJob.salaryRange.min > 0 && dreamJob.salaryRange.max > 0;
      case 7: // Benefícios
        return dreamJob.benefitsPriority.length >= 3;
      case 8: // Finalização
        return true;
      default:
        return false;
    }
  };

  const renderChipSelector = (options: string[], selected: string[], field: keyof DreamJobData, maxSelect?: number) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const canSelect = !maxSelect || selected.length < maxSelect || isSelected;
        
        return (
          <button
            key={option}
            onClick={() => canSelect && toggleArrayItem(field, option)}
            disabled={!canSelect}
            className={`px-4 py-2 rounded-xl border transition-all ${
              isSelected
                ? 'bg-ravyz-purple text-white border-ravyz-purple'
                : canSelect
                ? 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Perfil Profissional
        const currentProfileQuestion = profileQuestions[currentQuestionIndex];
        if (!currentProfileQuestion) return null;
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil Profissional</h2>
              <p className="text-gray-600">Pergunta {currentQuestionIndex + 1} de {profileQuestions.length}</p>
            </div>

            <Card className="p-8 mb-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentProfileQuestion.question}
                    </h3>
                    <p className="text-gray-600">
                      {currentProfileQuestion.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentProfileQuestion.options.map((option, index) => {
                      const isSelected = dreamJob.profileAnswers[currentProfileQuestion.id] === option.value;
                      const isSelectedNow = selectedOption === option.value;
                      
                      return (
                        <motion.button
                          key={index}
                          onClick={() => updateAnswer(currentProfileQuestion.id, option.value)}
                          disabled={isTransitioning}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                            isSelected || isSelectedNow
                              ? 'border-ravyz-purple bg-ravyz-purple/5'
                              : 'border-gray-200 hover:border-ravyz-purple/50'
                          } ${isTransitioning ? 'pointer-events-none' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{option.text}</span>
                            {(isSelected || isSelectedNow) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-ravyz-purple rounded-full flex items-center justify-center"
                              >
                                <CheckCircle className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        );

      case 1: // Cultura Organizacional
        const currentCultureQuestion = cultureQuestions[currentQuestionIndex];
        if (!currentCultureQuestion) return null;
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cultura Organizacional</h2>
              <p className="text-gray-600">Pergunta {currentQuestionIndex + 1} de {cultureQuestions.length}</p>
            </div>

            <Card className="p-8 mb-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentCultureQuestion.question}
                    </h3>
                    <p className="text-gray-600">
                      {currentCultureQuestion.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentCultureQuestion.options.map((option, index) => {
                      const isSelected = dreamJob.cultureAnswers[currentCultureQuestion.id] === option.value;
                      const isSelectedNow = selectedOption === option.value;
                      
                      return (
                        <motion.button
                          key={index}
                          onClick={() => updateAnswer(currentCultureQuestion.id, option.value, false)}
                          disabled={isTransitioning}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                            isSelected || isSelectedNow
                              ? 'border-ravyz-purple bg-ravyz-purple/5'
                              : 'border-gray-200 hover:border-ravyz-purple/50'
                          } ${isTransitioning ? 'pointer-events-none' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{option.text}</span>
                            {(isSelected || isSelectedNow) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-ravyz-purple rounded-full flex items-center justify-center"
                              >
                                <CheckCircle className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        );

      case 2: // Análise do Perfil
        return (
          <ProfileAnalysis 
            profileAnswers={dreamJob.profileAnswers}
            cultureAnswers={dreamJob.cultureAnswers}
            userData={props.userData}
          />
        );

      case 3: // Seleção de Empresas
        const topCompanies = getCompanySynergy().slice(0, 6);
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresas dos Seus Sonhos</h2>
              <p className="text-gray-600">
                Baseado no seu perfil, essas são as empresas com maior sinergia com você
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresas Recomendadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topCompanies.map((company) => (
                      <motion.button
                        key={company.name}
                        onClick={() => toggleCompanySelection(company.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          dreamJob.selectedCompanies.includes(company.name)
                            ? 'border-ravyz-purple bg-ravyz-purple/5'
                            : 'border-gray-200 hover:border-ravyz-purple/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{company.logo}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{company.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {company.synergy}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                            <p className="text-xs text-gray-500">{company.description}</p>
                          </div>
                          {dreamJob.selectedCompanies.includes(company.name) && (
                            <CheckCircle className="w-5 h-5 text-ravyz-purple flex-shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {!showAdditionalCompanies && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAdditionalCompanies(true)}
                      className="text-ravyz-purple border-ravyz-purple hover:bg-ravyz-purple/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ver mais empresas
                    </Button>
                  </div>
                )}

                {showAdditionalCompanies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Outras Empresas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allCompanies.map((company) => (
                        <motion.button
                          key={company.name}
                          onClick={() => toggleCompanySelection(company.name, true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            dreamJob.additionalCompanies.includes(company.name)
                              ? 'border-ravyz-purple bg-ravyz-purple/5'
                              : 'border-gray-200 hover:border-ravyz-purple/50'
                          }`}
                        >
                          <span className="text-xl mb-1 block">{company.logo}</span>
                          <span className="text-sm font-medium text-gray-900 block">{company.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );

      case 4: // Localização
        const locationOptions = [
          'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba',
          'Porto Alegre', 'Salvador', 'Recife', 'Fortaleza', 'Florianópolis'
        ];
        const workModelOptions = ['Remoto', 'Híbrido', 'Presencial'];
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Localização</h2>
              <p className="text-gray-600">Onde você gostaria de trabalhar</p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cidades de Interesse</h3>
                    {renderChipSelector(locationOptions, dreamJob.location, 'location', 3)}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Modelo de Trabalho</h3>
                    {renderChipSelector(workModelOptions, dreamJob.workModel, 'workModel')}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        );

      case 5: // Cargo dos Sonhos - Nova implementação
        return (
          <DreamJobPositionStep
            position={dreamJob.position}
            positionLevel={dreamJob.positionLevel}
            onPositionChange={(position) => updateDreamJob('position', position)}
            onLevelChange={(level) => updateDreamJob('positionLevel', level)}
          />
        );

      case 6: // Salário
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Faixa Salarial</h2>
              <p className="text-gray-600">Qual sua expectativa salarial?</p>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Faixa desejada</p>
                  <p className="text-2xl font-bold text-ravyz-purple">
                    R$ {dreamJob.salaryRange.min.toLocaleString()} - R$ {dreamJob.salaryRange.max.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Salário Mínimo</Label>
                    <Slider
                      value={[dreamJob.salaryRange.min]}
                      onValueChange={(value) => updateDreamJob('salaryRange', { ...dreamJob.salaryRange, min: value[0] })}
                      max={50000}
                      min={1000}
                      step={500}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Salário Máximo</Label>
                    <Slider
                      value={[dreamJob.salaryRange.max]}
                      onValueChange={(value) => updateDreamJob('salaryRange', { ...dreamJob.salaryRange, max: value[0] })}
                      max={50000}
                      min={dreamJob.salaryRange.min}
                      step={500}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 7: // Benefícios
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Benefícios</h2>
              <p className="text-gray-600">Selecione e priorize os benefícios mais importantes</p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Selecione os Benefícios</h3>
                  <div className="flex flex-wrap gap-2">
                    {benefitOptions.map((benefit) => (
                      <button
                        key={benefit}
                        onClick={() => toggleBenefitSelection(benefit)}
                        className={`px-4 py-2 rounded-xl border transition-all ${
                          dreamJob.benefitsPriority.includes(benefit)
                            ? 'bg-ravyz-purple text-white border-ravyz-purple'
                            : 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                        }`}
                      >
                        {benefit}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {dreamJob.benefitsPriority.length > 0 && (
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Priorize os Benefícios</h3>
                    <p className="text-sm text-gray-600">Arraste para reordenar por importância</p>
                    <div className="space-y-3">
                      {dreamJob.benefitsPriority.map((benefit, index) => (
                        <DraggableBenefit
                          key={benefit}
                          benefit={benefit}
                          index={index}
                          moveBenefit={moveBenefit}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        );

      case 8: // Finalização
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pronto!</h2>
              <p className="text-gray-600">Seu perfil de emprego dos sonhos está completo</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumo do Seu Perfil</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Cargo Desejado</h4>
                    <p className="text-gray-900">{dreamJob.position} - {dreamJob.positionLevel}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Faixa Salarial</h4>
                    <p className="text-gray-900">
                      R$ {dreamJob.salaryRange.min.toLocaleString()} - R$ {dreamJob.salaryRange.max.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Localização</h4>
                    <p className="text-gray-900">{dreamJob.location.join(', ') || 'Não especificado'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Modelo de Trabalho</h4>
                    <p className="text-gray-900">{dreamJob.workModel.join(', ') || 'Não especificado'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Empresas Selecionadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...dreamJob.selectedCompanies, ...dreamJob.additionalCompanies].map((company) => (
                      <Badge key={company} variant="secondary" className="bg-ravyz-purple text-white">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Top 3 Benefícios</h4>
                  <div className="flex flex-wrap gap-2">
                    {dreamJob.benefitsPriority.slice(0, 3).map((benefit, index) => (
                      <Badge key={benefit} variant="outline" className="border-ravyz-purple text-ravyz-purple">
                        {index + 1}. {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 6: // Salário
        return <SalarySelectionStep 
          dreamJob={dreamJob} 
          onSalaryUpdate={handleSalaryRangeUpdate} 
        />;
        
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <RavyzLogo />
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Etapa {currentStep + 1} de {steps.length}
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ravyz-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-ravyz-purple text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isActive ? 'text-ravyz-purple' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 z-50">
          <div className="max-w-4xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-ravyz-purple hover:bg-ravyz-purple/90"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}