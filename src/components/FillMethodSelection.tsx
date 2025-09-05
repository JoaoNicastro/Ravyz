import { useState } from "react";
import { motion } from "motion/react";
import { 
  MessageCircle, 
  Mic, 
  MousePointer, 
  ArrowRight,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type FillMethod = 'chat' | 'voice' | 'click';
type ProfileType = 'candidate' | 'company';

interface FillMethodSelectionProps {
  profileType: ProfileType;
  onMethodSelect: (method: FillMethod) => void;
  onBack: () => void;
}

interface MethodOption {
  id: FillMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  comingSoon?: boolean;
}

export function FillMethodSelection({ profileType, onMethodSelect, onBack }: FillMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<FillMethod | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isCandidate = profileType === 'candidate';

  const methodOptions: MethodOption[] = [
    {
      id: 'chat',
      title: 'Chat Box',
      description: isCandidate 
        ? 'Converse naturalmente sobre sua experiência e preferências profissionais'
        : 'Descreva sua vaga através de uma conversa intuitiva e natural',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'ravyz-blue',
      benefits: isCandidate 
        ? ['Conversa natural', 'Esclarece dúvidas', 'Mais personalizado']
        : ['Criação intuitiva', 'Refinamento em tempo real', 'Processo conversacional'],
      comingSoon: true
    },
    {
      id: 'voice',
      title: 'Assistente de Voz',
      description: isCandidate
        ? 'Fale sobre seu perfil profissional e deixe nossa IA entender suas necessidades'
        : 'Descreva sua vaga falando naturalmente sobre o que procura',
      icon: <Mic className="w-8 h-8" />,
      color: 'ravyz-purple',
      benefits: isCandidate
        ? ['Hands-free', 'Mais expressivo', 'Rápido e prático']
        : ['Criação por voz', 'Mais dinâmico', 'Interface moderna'],
      comingSoon: true
    },
    {
      id: 'click',
      title: 'Click e Selecione',
      description: isCandidate
        ? 'Complete seu perfil através de perguntas objetivas e seleção de opções'
        : 'Configure sua vaga através de formulários estruturados e seleções',
      icon: <MousePointer className="w-8 h-8" />,
      color: 'ravyz-orange',
      benefits: isCandidate
        ? ['Rápido e direto', 'Controle total', 'Interface familiar']
        : ['Processo estruturado', 'Controle preciso', 'Criação rápida']
    }
  ];

  const handleMethodSelect = (method: FillMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      setIsAnimating(true);
      setTimeout(() => {
        onMethodSelect(selectedMethod);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-ravyz-orange/10 backdrop-blur-sm rounded-lg p-2">
                <RavyzLogo size="sm" variant="compact" className="text-ravyz-orange" />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Passo 2 de {isCandidate ? '3' : '2'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ravyz-orange/10 rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8 text-ravyz-orange" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Conta criada com sucesso! 🎉
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isCandidate 
                  ? 'Agora, como você prefere construir seu perfil profissional?' 
                  : 'Como você prefere criar suas vagas e gerenciar recrutamento?'
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Escolha o método que mais combina com você
              </p>
            </motion.div>
          </div>

          {/* Method Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {methodOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedMethod === option.id
                      ? `ring-2 ring-${option.color} bg-gradient-to-br from-${option.color}/5 to-${option.color}/10`
                      : 'hover:shadow-md border-gray-200'
                  } ${option.comingSoon ? 'opacity-75' : ''}`}
                  onClick={() => !option.comingSoon && handleMethodSelect(option.id)}
                >
                  <CardContent className="p-6">
                    {/* Coming Soon Badge */}
                    {option.comingSoon && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-ravyz-orange/10 text-ravyz-orange text-xs px-2 py-1 rounded-full">
                          Em breve
                        </div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${option.color}/10 rounded-xl mb-4 text-${option.color}`}>
                      {option.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {option.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 bg-${option.color} rounded-full`}></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Selection Indicator */}
                    {selectedMethod === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4"
                      >
                        <div className={`w-6 h-6 bg-${option.color} rounded-full flex items-center justify-center`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedMethod || isAnimating}
              className="bg-ravyz-orange hover:bg-ravyz-orange/90 text-white px-8 py-3 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            {selectedMethod && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500 mt-3"
              >
                {isCandidate 
                  ? 'Vamos construir seu perfil dos sonhos!'
                  : 'Vamos configurar sua primeira vaga!'
                }
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}