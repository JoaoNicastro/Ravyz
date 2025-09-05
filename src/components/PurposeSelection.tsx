import { useState } from "react";
import { motion } from "motion/react";
import { User, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PurposeSelectionProps {
  onSelect: (purpose: 'candidate' | 'company') => void;
  onBack: () => void;
}

export function PurposeSelection({ onSelect, onBack }: PurposeSelectionProps) {
  const [selectedPurpose, setSelectedPurpose] = useState<'candidate' | 'company' | null>(null);
  const [isHovered, setIsHovered] = useState<'candidate' | 'company' | null>(null);

  const purposes = [
    {
      id: 'candidate' as const,
      title: 'Busco Vaga',
      subtitle: 'Encontre oportunidades perfeitas para sua carreira',
      description: 'Conecte-se com empresas que valorizam seu perfil e encontre a vaga dos seus sonhos',
      icon: User,
      color: 'ravyz-purple',
      gradient: 'from-purple-500 to-indigo-600',
      features: [
        '🎯 Matches inteligentes baseados no seu perfil',
        '🚀 Mentoria personalizada com IA',
        '💰 Benchmarking salarial preciso',
        '📈 Acompanhamento de carreira'
      ]
    },
    {
      id: 'company' as const,
      title: 'Busco Candidato',
      subtitle: 'Encontre talentos excepcionais para sua empresa',
      description: 'Descubra candidatos ideais através do nosso sistema de matching inteligente',
      icon: Building2,
      color: 'ravyz-blue',
      gradient: 'from-blue-500 to-cyan-600',
      features: [
        '🔍 Busca avançada por competências',
        '⚡ Processo seletivo gamificado',
        '🎯 Matching baseado em fit cultural',
        '📊 Analytics e insights de contratação'
      ]
    }
  ];

  const handleContinue = () => {
    if (selectedPurpose) {
      onSelect(selectedPurpose);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-ravyz-orange to-orange-500 rounded-2xl mb-6">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="mb-4 text-ravyz-black">
            Qual é o seu objetivo?
          </h1>
          <p className="text-ravyz-gray-500 max-w-2xl mx-auto">
            Escolha o que melhor descreve o que você está procurando para personalizar sua experiência no RAVYZ
          </p>
        </motion.div>

        {/* Purpose Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {purposes.map((purpose, index) => {
            const Icon = purpose.icon;
            const isSelected = selectedPurpose === purpose.id;
            const isCardHovered = isHovered === purpose.id;

            return (
              <motion.div
                key={purpose.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative cursor-pointer border-2 transition-all duration-300 ${
                    isSelected
                      ? `border-${purpose.color} bg-gradient-to-br ${purpose.gradient} bg-opacity-5`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  onMouseEnter={() => setIsHovered(purpose.id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="p-8">
                    {/* Icon and Selection Indicator */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                        isSelected || isCardHovered
                          ? `bg-${purpose.color} text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      {/* Selection Radio */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? `border-${purpose.color} bg-${purpose.color}`
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h3 className={`mb-2 transition-colors duration-300 ${
                        isSelected ? `text-${purpose.color}` : 'text-ravyz-black'
                      }`}>
                        {purpose.title}
                      </h3>
                      <p className="text-ravyz-gray-700 mb-2">
                        {purpose.subtitle}
                      </p>
                      <p className="text-ravyz-gray-500">
                        {purpose.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {purpose.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                          className="flex items-center text-sm text-ravyz-gray-600"
                        >
                          <span className="mr-3">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  {isCardHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg pointer-events-none"
                    />
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedPurpose}
            className={`flex items-center gap-2 transition-all duration-300 ${
              selectedPurpose
                ? 'bg-ravyz-orange hover:bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-ravyz-gray-500">
            Não se preocupe, você pode alterar isso depois nas configurações da sua conta
          </p>
        </motion.div>
      </div>
    </div>
  );
}