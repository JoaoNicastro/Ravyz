import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
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
    setDreamJob(prev => ({
      ...prev,
      [isProfile ? 'profileAnswers' : 'cultureAnswers']: {
        ...prev[isProfile ? 'profileAnswers' : 'cultureAnswers'],
        [questionId]: value
      }
    }));
  }, []);

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
        setCurrentQuestionIndex(profileQuestions.length - 1);
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
      case 2: // Empresas
        return dreamJob.selectedCompanies.length > 0 || dreamJob.additionalCompanies.length > 0;
      case 3: // Localização
        return dreamJob.location.length > 0 || dreamJob.workModel.length > 0;
      case 4: // Cargo
        return dreamJob.position && dreamJob.positionLevel;
      case 5: // Salário
        return dreamJob.salaryRange.min > 0 && dreamJob.salaryRange.max > 0;
      case 6: // Benefícios
        return dreamJob.benefitsPriority.length >= 3;
      case 7: // Finalização
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil Profissional</h2>
              <p className="text-gray-600">Pergunta {currentQuestionIndex + 1} de {profileQuestions.length}</p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
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
                    
                    return (
                      <button
                        key={index}
                        onClick={() => updateAnswer(currentProfileQuestion.id, option.value, true)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-ravyz-purple bg-ravyz-purple/5 text-ravyz-purple'
                            : 'border-gray-200 hover:border-ravyz-purple/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-ravyz-purple bg-ravyz-purple'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 1: // Cultura Organizacional
        const currentCultureQuestion = cultureQuestions[currentQuestionIndex];
        if (!currentCultureQuestion) return null;
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-ravyz-green flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cultura Organizacional</h2>
              <p className="text-gray-600">Pergunta {currentQuestionIndex + 1} de {cultureQuestions.length}</p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
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
                    
                    return (
                      <button
                        key={index}
                        onClick={() => updateAnswer(currentCultureQuestion.id, option.value, false)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-ravyz-green bg-ravyz-green/5 text-ravyz-green'
                            : 'border-gray-200 hover:border-ravyz-green/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-ravyz-green bg-ravyz-green'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 2: // Seleção de Empresas
        const synergyCompanies = getCompanySynergy();
        
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-ravyz-blue flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresas dos seus sonhos</h2>
              <p className="text-gray-600">Selecione empresas com alta sinergia com seu perfil e adicione outras que admira</p>
            </div>

            {/* Empresas com alta sinergia */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-ravyz-blue flex-shrink-0" />
                <h3 className="font-bold text-gray-900">Empresas com alta sinergia</h3>
                <Badge variant="outline" className="border-ravyz-blue text-ravyz-blue">
                  Baseado no seu perfil
                </Badge>
              </div>

              {synergyCompanies.slice(0, 6).map((company) => {
                const isSelected = dreamJob.selectedCompanies.includes(company.name);
                
                return (
                  <Card 
                    key={company.name} 
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-ravyz-blue bg-ravyz-blue/5' : ''
                    }`}
                    onClick={() => toggleCompanySelection(company.name, false)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{company.logo}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.industry}</p>
                          <p className="text-xs text-gray-500 mt-1">{company.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            company.synergy >= 80 ? 'text-ravyz-green' :
                            company.synergy >= 60 ? 'text-ravyz-orange' :
                            'text-ravyz-purple'
                          }`}>
                            {company.synergy}%
                          </div>
                          <div className="text-xs text-gray-500">sinergia</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-ravyz-blue bg-ravyz-blue'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Empresas adicionais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-ravyz-orange flex-shrink-0" />
                  <h3 className="font-bold text-gray-900">Empresas que você admira</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdditionalCompanies(!showAdditionalCompanies)}
                  className="text-ravyz-orange border-ravyz-orange hover:bg-ravyz-orange/5"
                >
                  {showAdditionalCompanies ? 'Ocultar' : 'Adicionar empresas'}
                </Button>
              </div>

              {showAdditionalCompanies && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allCompanies.filter(c => !synergyCompanies.some(sc => sc.name === c.name)).map((company) => {
                    const isSelected = dreamJob.additionalCompanies.includes(company.name);
                    
                    return (
                      <button
                        key={company.name}
                        onClick={() => toggleCompanySelection(company.name, true)}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-ravyz-orange text-white border-ravyz-orange'
                            : 'border-gray-300 hover:border-ravyz-orange hover:bg-ravyz-orange/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{company.logo}</span>
                          <div>
                            <div className="font-medium text-sm">{company.name}</div>
                            <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                              {company.industry}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {dreamJob.additionalCompanies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Empresas selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {dreamJob.additionalCompanies.map((companyName) => {
                      const company = allCompanies.find(c => c.name === companyName);
                      return (
                        <Badge key={companyName} variant="outline" className="border-ravyz-orange text-ravyz-orange">
                          {company?.logo} {companyName}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-ravyz-blue/10 border border-ravyz-blue/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="w-5 h-5 text-ravyz-blue flex-shrink-0" />
                <h4 className="font-semibold text-ravyz-blue">Dica</h4>
              </div>
              <p className="text-gray-700 text-sm">
                Selecione empresas com alta sinergia para maximizar suas chances de match. 
                Você também pode adicionar empresas que admira, mesmo que tenham menor sinergia.
              </p>
            </div>
          </motion.div>
        );

      case 3: // Localização
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-ravyz-green flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Localização e modelo de trabalho</h2>
              <p className="text-gray-600">Onde e como você gostaria de trabalhar</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Modelo de trabalho *</Label>
                <div className="mt-2">
                  {renderChipSelector([
                    'Remoto', 'Híbrido', 'Presencial'
                  ], dreamJob.workModel, 'workModel')}
                </div>
              </div>

              <div>
                <Label>Cidades de interesse</Label>
                <div className="mt-2">
                  {renderChipSelector([
                    'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Brasília - DF',
                    'Porto Alegre - RS', 'Curitiba - PR', 'Salvador - BA', 'Recife - PE',
                    'Fortaleza - CE', 'Campinas - SP', 'Florianópolis - SC'
                  ], dreamJob.location, 'location')}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4: // Cargo dos Sonhos
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-ravyz-orange flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargo dos seus sonhos</h2>
              <p className="text-gray-600">Defina a posição e nível hierárquico que você busca</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="position">Cargo/Posição desejada *</Label>
                <Input
                  id="position"
                  value={dreamJob.position}
                  onChange={(e) => updateDreamJob('position', e.target.value)}
                  placeholder="Ex: Product Manager, Desenvolvedor Senior, Analista de Marketing..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="level">Nível hierárquico desejado *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Júnior', 'Pleno', 'Sênior', 'Gerencial', 'Diretoria', 'C-Level'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateDreamJob('positionLevel', level)}
                      className={`p-3 rounded-xl border transition-all ${
                        dreamJob.positionLevel === level
                          ? 'bg-ravyz-orange text-white border-ravyz-orange'
                          : 'border-gray-300 hover:border-ravyz-orange hover:bg-ravyz-orange/5'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5: // Salário
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Faixa salarial desejada</h2>
              <p className="text-gray-600">Defina sua expectativa salarial</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Salário mínimo desejado: R$ {dreamJob.salaryRange.min.toLocaleString()}</Label>
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
                <Label>Salário máximo desejado: R$ {dreamJob.salaryRange.max.toLocaleString()}</Label>
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
          </motion.div>
        );

      case 6: // Benefícios com Drag and Drop
        return (
          <DndProvider backend={HTML5Backend}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8 text-ravyz-blue flex-shrink-0" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Benefícios prioritários</h2>
                <p className="text-gray-600">Selecione e organize por ordem de prioridade (arraste para reordenar)</p>
              </div>

              <div className="space-y-6">
                {/* Seleção de benefícios */}
                <div>
                  <Label>Selecione seus benefícios prioritários *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {benefitOptions.map((benefit) => {
                      const isSelected = dreamJob.benefitsPriority.includes(benefit);
                      
                      return (
                        <button
                          key={benefit}
                          onClick={() => toggleBenefitSelection(benefit)}
                          className={`px-4 py-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-ravyz-purple text-white border-ravyz-purple'
                              : 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                          }`}
                        >
                          {benefit}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lista ordenável de benefícios selecionados */}
                {dreamJob.benefitsPriority.length > 0 && (
                  <div>
                    <Label>Seus benefícios em ordem de prioridade</Label>
                    <p className="text-sm text-gray-500 mb-4">Arraste os itens para reordenar por prioridade</p>
                    
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
                )}

                {dreamJob.benefitsPriority.length < 3 && (
                  <div className="bg-ravyz-orange/10 border border-ravyz-orange/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-ravyz-orange flex-shrink-0" />
                      <h4 className="font-semibold text-ravyz-orange">Selecione pelo menos 3 benefícios</h4>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Para prosseguir, você precisa selecionar pelo menos 3 benefícios prioritários. 
                      Isso nos ajudará a encontrar as melhores oportunidades para você.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </DndProvider>
        );

      case 7: // Finalização
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-ravyz-green flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil completo!</h2>
              <p className="text-gray-600">Seu perfil profissional está pronto. Vamos encontrar as melhores oportunidades para você.</p>
            </div>

            <Card className="p-6 bg-gradient-to-r from-ravyz-green/5 to-ravyz-blue/5 border-ravyz-green/20">
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 text-center mb-4">Resumo do seu Perfil RAVYZ</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-ravyz-purple">{Object.keys(dreamJob.profileAnswers).length}</div>
                    <div className="text-sm text-gray-600">Perguntas de perfil</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-ravyz-green">{Object.keys(dreamJob.cultureAnswers).length}</div>
                    <div className="text-sm text-gray-600">Perguntas de cultura</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-ravyz-blue">
                      {dreamJob.selectedCompanies.length + dreamJob.additionalCompanies.length}
                    </div>
                    <div className="text-sm text-gray-600">Empresas selecionadas</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-ravyz-orange">{dreamJob.benefitsPriority.length}</div>
                    <div className="text-sm text-gray-600">Benefícios prioritários</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Com base nas suas respostas, nossa IA já identificou empresas com alta sinergia 
                    com seu perfil profissional e preferências culturais.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 flex-shrink-0" />
            </button>
            <RavyzLogo size="sm" variant="compact" />
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Etapa {currentStep + 1} de {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-ravyz-orange h-1 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="flex justify-between items-start gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-ravyz-purple text-white border-ravyz-purple shadow-md'
                    : isCompleted
                    ? 'bg-ravyz-green text-white border-ravyz-green shadow-md'
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="mt-3 text-center w-16 sm:w-20">
                  <div className={`text-xs font-medium leading-tight mb-1 ${
                    isActive ? 'text-ravyz-purple' : isCompleted ? 'text-ravyz-green' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 hidden sm:block leading-tight">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 && currentQuestionIndex === 0 ? 'Voltar' : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full sm:flex-1 bg-ravyz-orange hover:bg-ravyz-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === steps.length - 1 ? 'Ir para matching' :
                 (currentStep === 0 && currentQuestionIndex < profileQuestions.length - 1) ||
                 (currentStep === 1 && currentQuestionIndex < cultureQuestions.length - 1) ? 'Próxima pergunta' : 'Próximo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}