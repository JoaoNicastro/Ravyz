import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface CandidateAvatarSelectionProps {
  onComplete: (avatarData: {
    selectedAvatar: any;
  }) => void;
  onBack: () => void;
}

export function CandidateAvatarSelection({ onComplete, onBack }: CandidateAvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);

  const avatarOptions = [
    {
      id: "conselheiro",
      name: "Conselheiro",
      avatar: "🎓",
      color: "ravyz-blue",
      description: "Orientação acadêmica e estratégica baseada em conhecimento profundo"
    },
    {
      id: "mentor",
      name: "Mentor", 
      avatar: "🤝",
      color: "ravyz-green",
      description: "Apoio próximo e pessoal para seu crescimento profissional"
    },
    {
      id: "sabio",
      name: "Sábio",
      avatar: "🧙‍♂️",
      color: "ravyz-purple", 
      description: "Sabedoria ancestral e visão ampla do mercado"
    },
    {
      id: "headhunter",
      name: "Headhunter",
      avatar: "🎯",
      color: "ravyz-orange",
      description: "Foco total em encontrar as melhores oportunidades para você"
    },
    {
      id: "guru",
      name: "Guru",
      avatar: "🧘‍♂️",
      color: "ravyz-purple",
      description: "Equilíbrio e autoconhecimento para decisões assertivas"
    },
    {
      id: "mestre",
      name: "Mestre",
      avatar: "⚡",
      color: "ravyz-orange",
      description: "Energia e liderança para transformar sua carreira"
    }
  ];

  const handleAvatarSelect = (avatar: any) => {
    setSelectedAvatar(avatar);
  };

  const handleNext = () => {
    if (selectedAvatar) {
      onComplete({
        selectedAvatar
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-ravyz-orange rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Escolha seu Mentor de Carreira
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecione o tipo de mentor que melhor se conecta com seu estilo e objetivos profissionais
          </p>
        </div>

        {/* Avatares Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
          {avatarOptions.map((avatar) => {
            const isSelected = selectedAvatar?.id === avatar.id;
            
            return (
              <motion.div
                key={avatar.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * avatarOptions.indexOf(avatar) }}
              >
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-300 h-full ${
                    isSelected 
                      ? `border-${avatar.color} bg-${avatar.color}/10 shadow-lg scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <CardContent className="p-4 text-center h-full flex flex-col">
                    <div className="text-4xl mb-3">{avatar.avatar}</div>
                    <h3 className={`font-medium mb-2 ${
                      isSelected ? `text-${avatar.color}` : 'text-gray-900'
                    }`}>
                      {avatar.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      {avatar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Avatar Selecionado - Preview */}
        {selectedAvatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border-2 border-${selectedAvatar.color}`}>
              <div className="text-2xl">{selectedAvatar.avatar}</div>
              <div className="text-left max-w-md">
                <div className={`font-medium text-${selectedAvatar.color} mb-1`}>
                  {selectedAvatar.name} será seu mentor
                </div>
                <div className="text-sm text-gray-600">
                  {selectedAvatar.description}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedAvatar}
            className={`flex items-center gap-2 px-8 ${
              selectedAvatar
                ? `bg-${selectedAvatar.color} hover:bg-${selectedAvatar.color}/90 text-white`
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Informação adicional */}
        {!selectedAvatar && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Escolha seu mentor para continuar sua jornada
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}