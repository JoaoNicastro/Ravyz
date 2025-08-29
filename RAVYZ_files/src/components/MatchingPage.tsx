import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, User, TrendingUp, Target, Zap, Star, Building2, DollarSign, MapPin, Trophy, Sparkles, BarChart3, Users, Award, Crown } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface MatchingPageProps {
  dreamJobData: any;
  userData: any;
  onComplete: (matchingData: any) => void;
  onBack: () => void;
}

interface CurrentJobData {
  currentPosition: string;
  currentLevel: string;
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
      onComplete({ currentJob: currentJobData, opportunities: mockOpportunities });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Posição atual
        return currentJobData.currentPosition && currentJobData.currentLevel && currentJobData.currentCompany;
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
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-ravyz-blue flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua posição atual</h2>
              <p className="text-gray-600">Nos conte sobre seu trabalho atual para criarmos comparativos precisos</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPosition">Cargo atual *</Label>
                <Input
                  id="currentPosition"
                  value={currentJobData.currentPosition}
                  onChange={(e) => updateCurrentJob('currentPosition', e.target.value)}
                  placeholder="Ex: Product Manager, Desenvolvedor Pleno, Analista de Marketing..."
                  className="mt-2"
                />
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
                <Label htmlFor="currentCompany">Empresa atual *</Label>
                <Input
                  id="currentCompany"
                  value={currentJobData.currentCompany}
                  onChange={(e) => updateCurrentJob('currentCompany', e.target.value)}
                  placeholder="Nome da empresa onde trabalha atualmente"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Salário atual: R$ {currentJobData.currentSalary.toLocaleString()}</Label>
                <Slider
                  value={[currentJobData.currentSalary]}
                  onValueChange={(value) => updateCurrentJob('currentSalary', value[0])}
                  max={50000}
                  min={1000}
                  step={500}
                  className="mt-2"
                />
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-ravyz-green flex-shrink-0" />
                          Faixa Salarial
                        </h4>
                        <p className="text-gray-700">
                          R$ {opportunity.salaryRange.min.toLocaleString()} - R$ {opportunity.salaryRange.max.toLocaleString()}
                        </p>
                        <p className="text-sm text-ravyz-green font-medium">
                          {Math.round(((opportunity.salaryRange.min - currentJobData.currentSalary) / currentJobData.currentSalary) * 100)}% 
                          a 
                          {Math.round(((opportunity.salaryRange.max - currentJobData.currentSalary) / currentJobData.currentSalary) * 100)}% 
                          de aumento
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-ravyz-purple flex-shrink-0" />
                          Benefícios Premium
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.benefits.slice(0, 3).map((benefit) => (
                            <Badge key={benefit} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {opportunity.benefits.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{opportunity.benefits.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-ravyz-green hover:bg-ravyz-green/90">
                        <Award className="w-4 h-4 mr-2" />
                        Candidatar-se
                      </Button>
                      <Button variant="outline" className="border-ravyz-blue text-ravyz-blue hover:bg-ravyz-blue/5">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-gradient-to-r from-ravyz-green/5 to-ravyz-blue/5 border-ravyz-green/20">
              <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-2">🎉 Parabéns!</h3>
                <p className="text-gray-700">
                  Encontramos <span className="font-bold text-ravyz-green">{mockOpportunities.length} oportunidades excepcionais</span> que superam 
                  sua posição atual em múltiplos aspectos. Suas chances de sucesso são muito altas!
                </p>
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
            className="bg-ravyz-green h-1 transition-all duration-500 ease-out"
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
                    ? 'bg-ravyz-green text-white border-ravyz-green shadow-md'
                    : isCompleted
                    ? 'bg-ravyz-blue text-white border-ravyz-blue shadow-md'
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="mt-3 text-center w-16 sm:w-20">
                  <div className={`text-xs font-medium leading-tight mb-1 ${
                    isActive ? 'text-ravyz-green' : isCompleted ? 'text-ravyz-blue' : 'text-gray-500'
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
            {currentStep === 0 ? 'Voltar ao perfil' : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full sm:flex-1 bg-ravyz-green hover:bg-ravyz-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === steps.length - 1 ? 'Explorar oportunidades' : 'Próximo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}