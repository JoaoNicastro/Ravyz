import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles, Crown, Target, Heart, Shield, User, Edit3, Wand2, Stars, Zap } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MentorAvatarCreationProps {
  onComplete: (mentorData: any) => void;
  onBack: () => void;
  profileType: 'candidate' | 'company';
}

type MentorCategory = 'mestre' | 'guru' | 'coach' | 'mentor' | 'anjo-da-guarda';

interface MentorData {
  category: MentorCategory;
  name: string;
  avatar: string;
  description: string;
  specialties: string[];
  color: string;
}

export function MentorAvatarCreation({ onComplete, onBack, profileType }: MentorAvatarCreationProps) {
  const [selectedCategory, setSelectedCategory] = useState<MentorCategory | null>(null);
  const [mentorName, setMentorName] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: categoria, 1: nome, 2: preview

  const mentorCategories: Record<MentorCategory, {
    name: string;
    emoji: string;
    icon: any;
    description: string;
    specialties: string[];
    color: string;
    personality: string;
  }> = {
    'mestre': {
      name: 'Mestre',
      emoji: '🧙‍♂️',
      icon: Crown,
      description: 'Sabedoria ancestral e experiência profunda para guiá-lo com conhecimento milenar',
      specialties: ['Estratégia de longo prazo', 'Tomada de decisões complexas', 'Visão de mercado', 'Liderança executiva'],
      color: 'ravyz-purple',
      personality: 'Sábio, experiente e visionário'
    },
    'guru': {
      name: 'Guru',
      emoji: '🧘‍♀️',
      icon: Sparkles,
      description: 'Conhecimento especializado e insights únicos para transformar sua carreira',
      specialties: ['Inovação e criatividade', 'Transformação digital', 'Metodologias ágeis', 'Crescimento exponencial'],
      color: 'ravyz-orange',
      personality: 'Inovador, inspirador e transformador'
    },
    'coach': {
      name: 'Coach',
      emoji: '💪',
      icon: Target,
      description: 'Motivação constante e técnicas práticas para alcançar seus objetivos',
      specialties: ['Desenvolvimento pessoal', 'Metas e objetivos', 'Performance', 'Superação de obstáculos'],
      color: 'ravyz-green',
      personality: 'Motivador, prático e focado em resultados'
    },
    'mentor': {
      name: 'Mentor',
      emoji: '🤝',
      icon: Heart,
      description: 'Apoio personalizado e orientação próxima em cada etapa da sua jornada',
      specialties: ['Orientação de carreira', 'Networking', 'Desenvolvimento de skills', 'Feedback construtivo'],
      color: 'ravyz-blue',
      personality: 'Próximo, empático e orientador'
    },
    'anjo-da-guarda': {
      name: 'Anjo da Guarda',
      emoji: '😇',
      icon: Shield,
      description: 'Proteção e cuidado especial para garantir que você tome as melhores decisões',
      specialties: ['Prevenção de erros', 'Análise de riscos', 'Proteção de carreira', 'Alertas estratégicos'],
      color: 'ravyz-purple',
      personality: 'Protetor, cuidadoso e preventivo'
    }
  };

  const handleCategorySelect = (category: MentorCategory) => {
    setSelectedCategory(category);
    setCurrentStep(1);
  };

  const handleNameSubmit = () => {
    if (mentorName.trim()) {
      setCurrentStep(2);
    }
  };

  const handleComplete = () => {
    if (selectedCategory && mentorName) {
      const mentorData: MentorData = {
        category: selectedCategory,
        name: mentorName,
        avatar: mentorCategories[selectedCategory].emoji,
        description: mentorCategories[selectedCategory].description,
        specialties: mentorCategories[selectedCategory].specialties,
        color: mentorCategories[selectedCategory].color
      };
      onComplete(mentorData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderCategorySelection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-ravyz-purple" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Mentor Ideal</h2>
        <p className="text-gray-600">
          Selecione o tipo de mentor que melhor se alinha com sua personalidade e objetivos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(mentorCategories).map(([key, mentor]) => {
          const Icon = mentor.icon;
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-ravyz-purple/30"
                onClick={() => handleCategorySelect(key as MentorCategory)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{mentor.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 text-${mentor.color}`} />
                      <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {mentor.description}
                    </p>
                    <div className="space-y-2">
                      <p className={`text-xs font-medium text-${mentor.color}`}>
                        🎯 {mentor.personality}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.specialties.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 bg-${mentor.color}/10 text-${mentor.color} rounded-full`}
                          >
                            {specialty}
                          </span>
                        ))}
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          +{mentor.specialties.length - 2} mais
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderNameInput = () => {
    if (!selectedCategory) return null;
    
    const selectedMentor = mentorCategories[selectedCategory];
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto bg-${selectedMentor.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
            <div className="text-2xl">{selectedMentor.emoji}</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dê um nome ao seu {selectedMentor.name}</h2>
          <p className="text-gray-600">
            Escolha um nome especial que represente sua conexão com este mentor
          </p>
        </div>

        <Card className={`p-8 border-2 border-${selectedMentor.color}/20`}>
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{selectedMentor.emoji}</div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="mentorName" className="text-lg">Nome do {selectedMentor.name}</Label>
                <Input
                  id="mentorName"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder={`Ex: ${selectedMentor.name === 'Mestre' ? 'Arquimedes' : selectedMentor.name === 'Guru' ? 'Shakti' : selectedMentor.name === 'Coach' ? 'Max' : selectedMentor.name === 'Mentor' ? 'Sofia' : 'Gabriel'}`}
                  className="mt-2 text-center text-lg"
                  autoFocus
                />
              </div>
              
              {mentorName && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 bg-${selectedMentor.color}/5 rounded-lg border border-${selectedMentor.color}/20`}
                >
                  <p className={`text-${selectedMentor.color} font-medium`}>
                    ✨ Perfeito! <strong>{mentorName}</strong> será seu {selectedMentor.name.toLowerCase()} pessoal
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMentor.personality}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderPreview = () => {
    if (!selectedCategory || !mentorName) return null;
    
    const selectedMentor = mentorCategories[selectedCategory];
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto bg-${selectedMentor.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
            <Stars className={`w-8 h-8 text-${selectedMentor.color}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conheça seu Mentor!</h2>
          <p className="text-gray-600">
            {mentorName} está pronto para guiá-lo em sua jornada profissional
          </p>
        </div>

        <Card className={`p-8 border-2 border-${selectedMentor.color}/30 bg-gradient-to-br from-${selectedMentor.color}/5 to-white`}>
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="text-8xl mb-4">{selectedMentor.emoji}</div>
              <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${selectedMentor.color} rounded-full flex items-center justify-center`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{mentorName}</h3>
              <p className={`text-lg font-medium text-${selectedMentor.color} mb-2`}>
                Seu {selectedMentor.name} Pessoal
              </p>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedMentor.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 bg-${selectedMentor.color}/10 rounded-lg`}>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className={`w-4 h-4 text-${selectedMentor.color}`} />
                  Especialidades
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  {selectedMentor.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 bg-${selectedMentor.color} rounded-full`}></div>
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 bg-${selectedMentor.color}/10 rounded-lg`}>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Heart className={`w-4 h-4 text-${selectedMentor.color}`} />
                  Personalidade
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedMentor.personality}
                </p>
                <div className={`mt-3 p-2 bg-white/50 rounded text-xs text-${selectedMentor.color} font-medium`}>
                  💬 "Vamos construir sua carreira dos sonhos juntos!"
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-gradient-to-r from-${selectedMentor.color}/10 to-gray-50/50 border-${selectedMentor.color}/20`}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">{selectedMentor.emoji}</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Primeira mensagem de {mentorName}:
              </h4>
              <p className="text-gray-700 italic">
                "Olá! Sou {mentorName}, seu {selectedMentor.name.toLowerCase()} pessoal. Estou aqui para te ajudar a alcançar {profileType === 'candidate' ? 'o cargo dos seus sonhos' : 'encontrar os melhores talentos'}. Vamos começar essa jornada incrível juntos! ✨"
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedCategory;
    if (currentStep === 1) return mentorName.trim();
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Etapa {currentStep + 1} de 3
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-ravyz-purple h-1 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {currentStep === 0 && renderCategorySelection()}
        {currentStep === 1 && renderNameInput()}
        {currentStep === 2 && renderPreview()}

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
            onClick={currentStep === 2 ? handleComplete : (currentStep === 1 ? handleNameSubmit : () => {})}
            disabled={!canProceed()}
            className="w-full sm:flex-1 bg-ravyz-purple hover:bg-ravyz-purple/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === 2 ? 'Começar jornada com ' + mentorName : 'Próximo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}