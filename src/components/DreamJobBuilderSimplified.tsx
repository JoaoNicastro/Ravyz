import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, User, Heart, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface DreamJobData {
  position: string;
  industry: string;
  salaryRange: { min: number; max: number };
  location: string;
  workModel: string;
}

interface DreamJobBuilderProps {
  onComplete: (dreamJob: DreamJobData) => void;
  onBack: () => void;
  userProfile?: {
    primaryProfile: string;
    secondaryProfile: string;
  };
  userData?: any;
}

export function DreamJobBuilderSimplified({ onComplete, onBack, userProfile, userData }: DreamJobBuilderProps) {
  console.log("🏗️ DreamJobBuilderSimplified - Componente renderizado");
  console.log("📦 Props recebidas:", { onComplete: typeof onComplete, onBack: typeof onBack, userData });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [dreamJob, setDreamJob] = useState<DreamJobData>({
    position: 'Senior Developer',
    industry: 'Tecnologia',
    salaryRange: { min: 8000, max: 15000 },
    location: 'São Paulo',
    workModel: 'Híbrido'
  });

  const steps = [
    { title: "Posição Desejada", description: "Qual cargo você busca?", icon: Briefcase },
    { title: "Setor", description: "Em que área deseja trabalhar?", icon: Target },
    { title: "Finalização", description: "Revisar informações", icon: CheckCircle }
  ];

  const handleNext = () => {
    console.log("🚀 DreamJobBuilder - handleNext chamado, step atual:", currentStep);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log("✅ DreamJobBuilder - Completando com dados:", dreamJob);
      onComplete(dreamJob);
    }
  };

  const handlePrevious = () => {
    console.log("⬅️ DreamJobBuilder - handlePrevious chamado, step atual:", currentStep);
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-ravyz-purple" />
              </div>
              <h2 className="font-bold text-gray-900 mb-2">Posição Desejada</h2>
              <p className="text-gray-600">Qual cargo você está buscando?</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {['Senior Developer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager'].map((position) => (
                  <button
                    key={position}
                    onClick={() => setDreamJob(prev => ({ ...prev, position }))}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      dreamJob.position === position
                        ? 'border-ravyz-purple bg-ravyz-purple/5 text-ravyz-purple'
                        : 'border-gray-200 hover:border-ravyz-purple/50'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-ravyz-orange" />
              </div>
              <h2 className="font-bold text-gray-900 mb-2">Setor</h2>
              <p className="text-gray-600">Em que área deseja trabalhar?</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {['Tecnologia', 'Financeiro', 'Marketing', 'Vendas', 'Recursos Humanos'].map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setDreamJob(prev => ({ ...prev, industry }))}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      dreamJob.industry === industry
                        ? 'border-ravyz-orange bg-ravyz-orange/5 text-ravyz-orange'
                        : 'border-gray-200 hover:border-ravyz-orange/50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-ravyz-green" />
              </div>
              <h2 className="font-bold text-gray-900 mb-2">Finalização</h2>
              <p className="text-gray-600">Confirme suas informações</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Posição:</span>
                    <span className="text-gray-900">{dreamJob.position}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Setor:</span>
                    <span className="text-gray-900">{dreamJob.industry}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Faixa Salarial:</span>
                    <span className="text-gray-900">R$ {dreamJob.salaryRange.min.toLocaleString()} - R$ {dreamJob.salaryRange.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Localização:</span>
                    <span className="text-gray-900">{dreamJob.location}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-medium text-gray-700">Modelo de Trabalho:</span>
                    <span className="text-gray-900">{dreamJob.workModel}</span>
                  </div>
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
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-ravyz-orange/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevious}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <span 
                  className="font-bold text-white"
                  style={{ 
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  RAVYZ
                </span>
              </div>
            </div>
            <div className="text-white/80">
              Etapa {currentStep + 1} de {steps.length}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-ravyz-orange h-1 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
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
            className="bg-ravyz-purple hover:bg-ravyz-purple/90 text-white flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}