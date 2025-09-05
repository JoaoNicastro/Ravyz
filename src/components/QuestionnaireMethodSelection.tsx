import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, MessageSquare, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface QuestionnaireMethodSelectionProps {
  onMethodSelect: (method: 'manual' | 'ai-writing' | 'ai-conversation') => void;
  onBack: () => void;
  mentorData?: {
    name: string;
    avatar: string;
    color: string;
    description?: string;
  };
}

export function QuestionnaireMethodSelection({ 
  onMethodSelect, 
  onBack, 
  mentorData 
}: QuestionnaireMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'ai-writing' | 'ai-conversation' | null>(null);

  // Definir cor do mentor ou usar padrão
  const mentorColor = mentorData?.color || 'ravyz-purple';
  const colorClass = mentorColor.includes('-') ? `text-${mentorColor}` : 'text-ravyz-purple';
  const bgColorClass = mentorColor.includes('-') ? `bg-${mentorColor}` : 'bg-ravyz-purple';

  const methods = [
    {
      id: 'manual' as const,
      title: 'Questionário Manual',
      description: 'Responda perguntas tradicionais de múltipla escolha de forma estruturada',
      icon: FileText,
      features: [
        'Perguntas diretas e objetivas',
        'Múltipla escolha e escalas',
        'Processo rápido e familiar',
        'Ideal para quem prefere praticidade'
      ],
      time: '5-8 minutos',
      color: 'bg-ravyz-blue',
      textColor: 'text-ravyz-blue'
    },
    {
      id: 'ai-writing' as const,
      title: 'Escrevendo com IA',
      description: 'Descreva sua experiência profissional e a IA criará seu perfil automaticamente',
      icon: Bot,
      features: [
        'Escreva livremente sobre sua carreira',
        'IA analisa e extrai insights',
        'Perfil mais detalhado e personalizado',
        'Ideal para quem gosta de se expressar'
      ],
      time: '8-12 minutos',
      color: 'bg-ravyz-green',
      textColor: 'text-ravyz-green'
    },
    {
      id: 'ai-conversation' as const,
      title: 'Conversa com IA',
      description: 'Tenha uma conversa natural com seu mentor para descobrir seu perfil ideal',
      icon: MessageSquare,
      features: [
        'Conversa interativa e personalizada',
        'Perguntas adaptadas às suas respostas',
        'Experiência mais humana e envolvente',
        'Ideal para quem quer se conhecer melhor'
      ],
      time: '5-10 minutos',
      color: `${bgColorClass}`,
      textColor: `${colorClass}`
    }
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      onMethodSelect(selectedMethod);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              {mentorData && (
                <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
                  <span className="text-white text-lg">{mentorData.avatar}</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Como você prefere responder?
                </h1>
                <p className="text-gray-600">
                  {mentorData ? `${mentorData.name} preparou` : 'Escolha'} diferentes formas de descobrir seu perfil profissional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mentor Message */}
        {mentorData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-lg">{mentorData.avatar}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${colorClass} mb-2`}>
                    {mentorData.name} diz:
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Agora vamos descobrir seu perfil profissional! Preparei três formas diferentes para você responder. 
                    Cada uma tem suas vantagens - escolha a que mais combina com seu estilo. O importante é que seja 
                    autêntico(a) em suas respostas para eu poder te ajudar da melhor forma! 🎯"
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Method Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {methods.map((method, index) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected 
                      ? `ring-2 ring-${method.color.replace('bg-', '')} bg-gray-50` 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {method.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {method.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full ${method.color}`} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <span className={`inline-flex items-center gap-1 ${method.textColor} text-sm font-medium`}>
                      <span>⏱️</span>
                      {method.time}
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className={`w-6 h-6 ${method.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className={`px-8 py-3 ${
              selectedMethod 
                ? `${methods.find(m => m.id === selectedMethod)?.color} hover:opacity-90` 
                : 'bg-gray-300'
            } text-white transition-all duration-200`}
          >
            {selectedMethod 
              ? `Continuar com ${methods.find(m => m.id === selectedMethod)?.title}`
              : 'Selecione um método para continuar'
            }
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}