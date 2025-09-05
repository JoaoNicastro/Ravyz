import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, User, TrendingUp, Target, Zap, Star, Building2, DollarSign, MapPin, Trophy, Sparkles, BarChart3, Users, Award, Crown, Send, Bookmark, Share, ChevronDown, Search } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SalaryBenchmarking } from "./SalaryBenchmarking";
import { UserProfileHeader } from "./UserProfileHeader";
import { PersonalizedMessage } from "./PersonalizedMessage";

interface MatchingPageProps {
  dreamJobData: any;
  userData: any;
  onComplete: (matchingData: any) => void;
  onBack: () => void;
}

interface CurrentJobData {
  currentPosition: string;
  currentLevel: string;
  currentIndustry: string;
  currentCompany: string;
  currentSalary: number;
  currentLocation: string;
  currentBenefits: string[];
  satisfaction: {
    salary: number;
    growth: number;
    culture: number;
    benefits: number;
    workLifeBalance: number;
  };
  lookingReason: string[];
}

const mockOpportunities = [
  {
    id: 1,
    company: 'Google',
    logo: '🔍',
    position: 'Senior Product Manager',
    level: 'Sênior',
    salaryRange: { min: 18000, max: 25000 },
    location: 'São Paulo - SP',
    workModel: 'Híbrido',
    synergy: 95,
    benefits: ['Stock options', 'Plano de saúde premium', 'Flexibilidade total', '20% learning time'],
    highlights: [
      { metric: 'Salário', improvement: '+65%', color: 'ravyz-green' },
      { metric: 'Crescimento', improvement: 'Excelente', color: 'ravyz-green' },
      { metric: 'Cultura', improvement: '+40%', color: 'ravyz-blue' },
      { metric: 'Benefícios', improvement: 'Premium', color: 'ravyz-purple' }
    ]
  },
  {
    id: 2,
    company: 'Nubank',
    logo: '💜',
    position: 'Product Manager',
    level: 'Sênior',
    salaryRange: { min: 16000, max: 22000 },
    location: 'São Paulo - SP',
    workModel: 'Híbrido',
    synergy: 92,
    benefits: ['Stock options', 'NuCare', 'Horário flexível', 'Auxílio pets'],
    highlights: [
      { metric: 'Salário', improvement: '+45%', color: 'ravyz-green' },
      { metric: 'Crescimento', improvement: 'Acelerado', color: 'ravyz-green' },
      { metric: 'Inovação', improvement: '+50%', color: 'ravyz-orange' },
      { metric: 'Impacto', improvement: 'Massivo', color: 'ravyz-purple' }
    ]
  },
  {
    id: 3,
    company: 'Stone',
    logo: '💎',
    position: 'Senior Product Manager',
    level: 'Sênior',
    salaryRange: { min: 15000, max: 20000 },
    location: 'São Paulo - SP',
    workModel: 'Híbrido',
    synergy: 88,
    benefits: ['Equity program', 'Plano de saúde', 'Budget para cursos', 'Stone Cares'],
    highlights: [
      { metric: 'Salário', improvement: '+33%', color: 'ravyz-green' },
      { metric: 'Autonomia', improvement: 'Total', color: 'ravyz-blue' },
      { metric: 'Aprendizado', improvement: '+60%', color: 'ravyz-orange' },
      { metric: 'Responsabilidade', improvement: 'Líder', color: 'ravyz-purple' }
    ]
  }
];

export function MatchingPage({ dreamJobData, userData, onComplete, onBack }: MatchingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentJobData, setCurrentJobData] = useState<CurrentJobData>({
    currentPosition: '',
    currentLevel: '',
    currentIndustry: '',
    currentCompany: '',
    currentSalary: 8000,
    currentLocation: '',
    currentBenefits: [],
    satisfaction: {
      salary: 3,
      growth: 3,
      culture: 3,
      benefits: 3,
      workLifeBalance: 3
    },
    lookingReason: []
  });

  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState('');

  // Dados estruturados de cargos comuns
  const commonPositions = [
    'Product Manager', 'Software Engineer', 'Desenvolvedor Frontend', 'Desenvolvedor Backend',
    'Data Scientist', 'UX Designer', 'UI Designer', 'Marketing Manager',
    'Sales Manager', 'Business Analyst', 'Project Manager', 'Scrum Master',
    'DevOps Engineer', 'QA Engineer', 'Content Manager', 'Growth Hacker',
    'Customer Success', 'Analista Financeiro', 'Recruiter', 'HR Business Partner'
  ];

  // Dados estruturados de indústrias e empresas
  const industriesData = {
    'Tecnologia': ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Salesforce', 'Netflix', 'Adobe', 'Oracle', 'IBM'],
    'Fintech': ['Nubank', 'Stone', 'PagSeguro', 'Creditas', 'C6 Bank', 'Inter', 'Pix', 'Mercado Pago', 'PayPal', 'Stripe'],
    'E-commerce': ['Mercado Livre', 'Amazon', 'B2W', 'Via Varejo', 'Magazine Luiza', 'Americanas', 'Shopee', 'OLX', 'iFood', 'Rappi'],
    'Consultoria': ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting', 'Roland Berger'],
    'Banco/Financeiro': ['Itaú', 'Bradesco', 'Banco do Brasil', 'Santander', 'Caixa', 'BTG Pactual', 'XP', 'Warren', 'Genial', 'Rico'],
    'Varejo': ['Ambev', 'JBS', 'Unilever', 'Nestlé', 'P&G', 'Coca-Cola', 'Pepsico', 'Loreal', 'Johnson & Johnson', 'Raia Drogasil'],
    'Saúde': ['Hospital Albert Einstein', 'Fleury', 'Dasa', 'Hapvida', 'SulAmérica', 'Amil', 'Bradesco Saúde', 'Porto Seguro Saúde', 'Prevent Senior', 'Care Plus'],
    'Educação': ['Kroton', 'Estácio', 'Anima', 'Ser Educacional', 'Yduqs', 'Vitru', 'Arco Educação', 'Somos Educação', 'Eleva Educação', 'Descomplica'],
    'Energia': ['Petrobras', 'Vale', 'Eletrobras', 'CPFL', 'Engie', 'EDP', 'Equinor', 'Shell', 'Raízen', 'Ultrapar'],
    'Telecomunicações': ['Vivo', 'Claro', 'TIM', 'Oi', 'Algar', 'Nextel', 'Sky', 'NET', 'América Móvil', 'Telefônica']
  };

  const availableBenefits = [
    'Plano de Saúde', 'Plano Odontológico', 'Vale Refeição', 'Vale Alimentação',
    'Auxílio Transporte', 'Seguro de Vida', 'Previdência Privada', 'Participação nos Lucros',
    'Stock Options', 'Home Office', 'Horário Flexível', 'Gympass',
    'Auxílio Creche', 'Licença Maternidade Estendida', 'Licença Paternidade Estendida', 'Day Off Aniversário',
    'Auxílio Educação', 'Cursos e Certificações', 'Conferences e Eventos', 'Mentoria',
    'Carro da Empresa', 'Combustível', 'Estacionamento', 'Celular Corporativo'
  ];

  const steps = [
    { title: "Posição Atual", description: "Seu trabalho hoje", icon: Briefcase },
    { title: "Satisfação", description: "Como você avalia", icon: Star },
    { title: "Motivação", description: "Por que mudar?", icon: Target },
    { title: "Oportunidades", description: "Matches perfeitos", icon: Sparkles }
  ];

  const satisfactionLabels = {
    salary: 'Salário',
    growth: 'Crescimento',
    culture: 'Cultura',
    benefits: 'Benefícios',
    workLifeBalance: 'Work-life Balance'
  };

  // Helper function para obter mensagem personalizada por etapa
  const getStepMessageType = () => {
    switch (currentStep) {
      case 0: return 'guidance';
      case 1: return 'encouragement';
      case 2: return 'motivation';
      case 3: return 'completion';
      default: return 'guidance';
    }
  };

  const getStepContext = () => {
    switch (currentStep) {
      case 0: return 'Vamos começar coletando informações sobre sua posição atual no mercado';
      case 1: return 'Agora vou te ajudar a refletir sobre sua satisfação atual';
      case 2: return 'É importante entendermos suas motivações para essa mudança';
      case 3: return 'Encontramos oportunidades incríveis que combinam perfeitamente com você';
      default: return '';
    }
  };

  const updateCurrentJob = useCallback((field: keyof CurrentJobData, value: any) => {
    setCurrentJobData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSatisfaction = useCallback((field: keyof CurrentJobData['satisfaction'], value: number) => {
    setCurrentJobData(prev => ({
      ...prev,
      satisfaction: { ...prev.satisfaction, [field]: value }
    }));
  }, []);

  const toggleArrayItem = useCallback((field: keyof CurrentJobData, item: string) => {
    setCurrentJobData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const finalJobData = {
        ...currentJobData,
        currentCompany: showCustomCompany ? customCompanyName : currentJobData.currentCompany
      };
      onComplete({ currentJob: finalJobData, opportunities: mockOpportunities });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleApply = (opportunity: any) => {
    console.log('Candidatar-se:', opportunity);
    alert(`Candidatando-se para ${opportunity.position} na ${opportunity.company}...`);
  };

  const handleSave = (opportunity: any) => {
    console.log('Salvar vaga:', opportunity);
    alert(`Vaga ${opportunity.position} na ${opportunity.company} salva!`);
  };

  const handleShare = (opportunity: any) => {
    console.log('Encaminhar vaga:', opportunity);
    alert(`Encaminhando vaga ${opportunity.position} na ${opportunity.company}...`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Posição atual
        return currentJobData.currentPosition && 
               currentJobData.currentLevel && 
               currentJobData.currentIndustry &&
               (currentJobData.currentCompany || customCompanyName);
      case 1: // Satisfação
        return true; // Sempre pode prosseguir, valores padrão
      case 2: // Motivação
        return currentJobData.lookingReason.length > 0;
      case 3: // Oportunidades
        return true;
      default:
        return false;
    }
  };

  const renderChipSelector = (options: string[], selected: string[], field: keyof CurrentJobData) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        
        return (
          <button
            key={option}
            onClick={() => toggleArrayItem(field, option)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              isSelected
                ? 'bg-ravyz-purple text-white border-ravyz-purple'
                : 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
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
      case 0: // Posição Atual
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Mensagem Personalizada do Mentor */}
            <PersonalizedMessage
              mentorData={userData?.mentor}
              messageType={getStepMessageType()}
              context={getStepContext()}
              className="mb-6"
            />

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-ravyz-blue flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua posição atual</h2>
              <p className="text-gray-600">Nos conte sobre seu trabalho atual para criarmos comparativos precisos</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Cargo atual *</Label>
                <p className="text-sm text-gray-600 mb-3">Selecione seu cargo atual ou digite um personalizado</p>
                
                {/* Cargos Comuns */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {commonPositions.map((position) => (
                    <button
                      key={position}
                      onClick={() => updateCurrentJob('currentPosition', position)}
                      className={`p-3 rounded-lg border transition-all text-left text-sm ${
                        currentJobData.currentPosition === position
                          ? 'bg-ravyz-purple text-white border-ravyz-purple'
                          : 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                      }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
                
                {/* Campo personalizado */}
                <div className="pt-2 border-t border-gray-200">
                  <Label htmlFor="customPosition" className="text-sm text-gray-600">Ou digite seu cargo:</Label>
                  <Input
                    id="customPosition"
                    value={currentJobData.currentPosition}
                    onChange={(e) => updateCurrentJob('currentPosition', e.target.value)}
                    placeholder="Ex: Gerente de Vendas, Analista de BI, Coordenador de RH..."
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Nível hierárquico atual *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Júnior', 'Pleno', 'Sênior', 'Gerencial', 'Diretoria', 'C-Level'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateCurrentJob('currentLevel', level)}
                      className={`p-3 rounded-xl border transition-all ${
                        currentJobData.currentLevel === level
                          ? 'bg-ravyz-blue text-white border-ravyz-blue'
                          : 'border-gray-300 hover:border-ravyz-blue hover:bg-ravyz-blue/5'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="currentIndustry">Indústria/Setor atual *</Label>
                <Select value={currentJobData.currentIndustry} onValueChange={(value) => {
                  updateCurrentJob('currentIndustry', value);
                  setCurrentJobData(prev => ({ ...prev, currentCompany: '' }));
                  setShowCustomCompany(false);
                  setCustomCompanyName('');
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o setor da sua empresa atual" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(industriesData).map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentJobData.currentIndustry && (
                <div>
                  <Label htmlFor="currentCompany">Empresa atual *</Label>
                  <div className="mt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {industriesData[currentJobData.currentIndustry as keyof typeof industriesData]?.map((company) => (
                        <button
                          key={company}
                          onClick={() => {
                            updateCurrentJob('currentCompany', company);
                            setShowCustomCompany(false);
                            setCustomCompanyName('');
                          }}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            currentJobData.currentCompany === company
                              ? 'bg-ravyz-green text-white border-ravyz-green'
                              : 'border-gray-300 hover:border-ravyz-green hover:bg-ravyz-green/5'
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowCustomCompany(!showCustomCompany);
                          updateCurrentJob('currentCompany', '');
                        }}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          showCustomCompany
                            ? 'bg-ravyz-blue text-white border-ravyz-blue'
                            : 'border-gray-300 hover:border-ravyz-blue hover:bg-ravyz-blue/5'
                        }`}
                      >
                        ✏️ Outra empresa (escrever nome)
                      </button>
                      
                      {showCustomCompany && (
                        <Input
                          value={customCompanyName}
                          onChange={(e) => setCustomCompanyName(e.target.value)}
                          placeholder="Nome da empresa onde trabalha atualmente"
                          className="mt-3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>Salário atual *</Label>
                <div className="mt-2 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Seu salário atual</span>
                      <span className="font-medium">R$ {currentJobData.currentSalary.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[currentJobData.currentSalary]}
                      onValueChange={(value) => updateCurrentJob('currentSalary', value[0])}
                      max={50000}
                      min={1000}
                      step={500}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="bg-ravyz-blue/5 p-3 rounded-lg">
                    <p className="text-sm text-ravyz-blue font-medium">
                      💰 Salário atual: R$ {currentJobData.currentSalary.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Benchmarking Salarial */}
                {currentJobData.currentPosition && currentJobData.currentLevel && currentJobData.currentIndustry && (
                  <div className="mt-6">
                    <SalaryBenchmarking
                      currentPosition={currentJobData.currentPosition}
                      currentLevel={currentJobData.currentLevel}
                      currentIndustry={currentJobData.currentIndustry}
                      currentLocation={currentJobData.currentLocation || 'São Paulo'}
                      currentSalary={currentJobData.currentSalary}
                      selectedMin={currentJobData.currentSalary * 0.9}
                      selectedMax={currentJobData.currentSalary * 1.1}
                      onSuggestionApply={(min, max) => {
                        updateCurrentJob('currentSalary', Math.round((min + max) / 2));
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Principais benefícios atuais</Label>
                <p className="text-sm text-gray-600 mb-3">Selecione os benefícios que você tem atualmente</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableBenefits.map((benefit) => {
                    const isSelected = currentJobData.currentBenefits.includes(benefit);
                    
                    return (
                      <button
                        key={benefit}
                        onClick={() => toggleArrayItem('currentBenefits', benefit)}
                        className={`p-2 rounded-lg border transition-all text-sm text-left ${
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
                
                {currentJobData.currentBenefits.length > 0 && (
                  <div className="mt-4 p-4 bg-ravyz-purple/5 rounded-lg border border-ravyz-purple/20">
                    <h4 className="font-medium text-gray-900 mb-2">Seus benefícios atuais:</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentJobData.currentBenefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="border-ravyz-purple text-ravyz-purple text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="currentLocation">Localização atual</Label>
                <Input
                  id="currentLocation"
                  value={currentJobData.currentLocation}
                  onChange={(e) => updateCurrentJob('currentLocation', e.target.value)}
                  placeholder="Cidade onde trabalha ou 'Remoto'"
                  className="mt-2"
                />
              </div>
            </div>
          </motion.div>
        );

      case 1: // Satisfação
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Mensagem Personalizada do Mentor */}
            <PersonalizedMessage
              mentorData={userData?.mentor}
              messageType={getStepMessageType()}
              context={getStepContext()}
              className="mb-6"
            />

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-ravyz-orange flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Avalie sua satisfação atual</h2>
              <p className="text-gray-600">Como você avalia diferentes aspectos do seu trabalho atual?</p>
            </div>

            <div className="space-y-6">
              {Object.entries(satisfactionLabels).map(([key, label]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{label}</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => updateSatisfaction(key as keyof CurrentJobData['satisfaction'], rating)}
                          className="transition-colors"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              rating <= currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']]
                                ? 'text-ravyz-orange fill-ravyz-orange'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']] === 1 && 'Muito insatisfeito'}
                    {currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']] === 2 && 'Insatisfeito'}
                    {currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']] === 3 && 'Neutro'}
                    {currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']] === 4 && 'Satisfeito'}
                    {currentJobData.satisfaction[key as keyof CurrentJobData['satisfaction']] === 5 && 'Muito satisfeito'}
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-6 bg-ravyz-blue/5 border-ravyz-blue/20">
              <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-2">Sua Avaliação Geral</h3>
                <div className="text-3xl font-bold text-ravyz-blue mb-2">
                  {(Object.values(currentJobData.satisfaction).reduce((a, b) => a + b, 0) / 5).toFixed(1)}/5
                </div>
                <p className="text-sm text-gray-600">
                  {Object.values(currentJobData.satisfaction).reduce((a, b) => a + b, 0) / 5 >= 4 
                    ? 'Você está bem satisfeito com seu trabalho atual'
                    : Object.values(currentJobData.satisfaction).reduce((a, b) => a + b, 0) / 5 >= 3
                    ? 'Satisfação moderada com pontos de melhoria'
                    : 'Há bastante espaço para melhorias'}
                </p>
              </div>
            </Card>
          </motion.div>
        );

      case 2: // Motivação
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Mensagem Personalizada do Mentor */}
            <PersonalizedMessage
              mentorData={userData?.mentor}
              messageType={getStepMessageType()}
              context={getStepContext()}
              className="mb-6"
            />

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-ravyz-purple flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Por que buscar uma mudança?</h2>
              <p className="text-gray-600">Selecione os principais motivos que te levam a buscar novas oportunidades</p>
            </div>

            <div className="space-y-4">
              <Label>Motivações para mudança *</Label>
              {renderChipSelector([
                'Maior salário',
                'Melhor cargo/posição',
                'Mais crescimento profissional',
                'Melhor cultura organizacional',
                'Maior flexibilidade',
                'Novos desafios',
                'Melhor work-life balance',
                'Empresa mais inovadora',
                'Melhor localização',
                'Melhores benefícios',
                'Maior autonomia',
                'Equipe mais engajada'
              ], currentJobData.lookingReason, 'lookingReason')}
            </div>

            {currentJobData.lookingReason.length > 0 && (
              <Card className="p-6 bg-ravyz-purple/5 border-ravyz-purple/20">
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Suas Prioridades</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentJobData.lookingReason.map((reason) => (
                      <Badge key={reason} variant="outline" className="border-ravyz-purple text-ravyz-purple">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        );

      case 3: // Oportunidades
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Mensagem Personalizada do Mentor */}
            <PersonalizedMessage
              mentorData={userData?.mentor}
              messageType={getStepMessageType()}
              context={getStepContext()}
              className="mb-6"
            />

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 text-ravyz-green flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Suas oportunidades perfeitas</h2>
              <p className="text-gray-600">Baseado no seu perfil e posição atual, encontramos estas oportunidades excepcionais</p>
            </div>

            <div className="space-y-6">
              {mockOpportunities.map((opportunity, index) => (
                <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-ravyz-green/20">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{opportunity.logo}</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{opportunity.position}</h3>
                          <p className="text-ravyz-blue font-medium">{opportunity.company}</p>
                          <p className="text-sm text-gray-600">{opportunity.location} • {opportunity.workModel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-ravyz-green mb-1">{opportunity.synergy}%</div>
                        <div className="text-sm text-gray-500">match</div>
                      </div>
                    </div>

                    {/* Melhorias */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {opportunity.highlights.map((highlight, idx) => (
                        <div key={idx} className={`bg-${highlight.color}/10 border border-${highlight.color}/20 rounded-lg p-3 text-center`}>
                          <div className={`text-lg font-bold text-${highlight.color} mb-1`}>
                            {highlight.improvement}
                          </div>
                          <div className="text-sm text-gray-600">{highlight.metric}</div>
                        </div>
                      ))}
                    </div>

                    {/* Detalhes */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">R$ {opportunity.salaryRange.min.toLocaleString()} - {opportunity.salaryRange.max.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1">
                          {opportunity.benefits.slice(0, 2).map((benefit, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {opportunity.benefits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{opportunity.benefits.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave(opportunity)}
                          className="hover:bg-ravyz-blue/10 hover:border-ravyz-blue"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(opportunity)}
                          className="hover:bg-ravyz-purple/10 hover:border-ravyz-purple"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleApply(opportunity)}
                          className="bg-ravyz-green hover:bg-ravyz-green/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Candidatar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Avatar do Usuário */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <RavyzLogo size="sm" variant="compact" />
          </div>

          {/* User Profile Header Desktop */}
          <div className="hidden sm:flex">
            <UserProfileHeader 
              userData={userData} 
              showMentor={true} 
              compact={true}
            />
          </div>
          
          <div className="text-right sm:hidden">
            <p className="text-sm text-gray-600">
              Etapa {currentStep + 1} de {steps.length}
            </p>
          </div>
        </div>

        {/* Mobile User Profile */}
        <div className="sm:hidden mt-4">
          <UserProfileHeader 
            userData={userData} 
            showMentor={true} 
            compact={true}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-ravyz-purple h-1 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center gap-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-ravyz-green border-ravyz-green text-white'
                      : isCurrent
                      ? 'bg-ravyz-purple border-ravyz-purple text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`font-medium text-sm ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-ravyz-green' : 'bg-gray-300'
                  }`} />
                )}
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
            {currentStep === 0 ? 'Voltar' : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full sm:flex-1 bg-ravyz-purple hover:bg-ravyz-purple/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === steps.length - 1 ? 'Ver Minha Página' : 'Próximo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}