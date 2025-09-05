import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "./ui/utils";
import { motion } from "motion/react";

interface PersonalityTrait {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface PersonalityProfileProps {
  selectedTraits: string[];
  onTraitsChange: (traits: string[]) => void;
  maxSelection?: number;
}

export function PersonalityProfile({ 
  selectedTraits, 
  onTraitsChange, 
  maxSelection = 5 
}: PersonalityProfileProps) {
  const personalityTraits: PersonalityTrait[] = [
    {
      id: 'leadership',
      title: 'Liderança',
      description: 'Gosto de guiar equipes e tomar iniciativa',
      color: 'ravyz-orange',
      icon: '👑'
    },
    {
      id: 'creativity',
      title: 'Criatividade',
      description: 'Penso fora da caixa e trago ideias inovadoras',
      color: 'ravyz-purple',
      icon: '🎨'
    },
    {
      id: 'analytical',
      title: 'Analítico',
      description: 'Gosto de analisar dados e resolver problemas',
      color: 'ravyz-blue',
      icon: '📊'
    },
    {
      id: 'collaborative',
      title: 'Colaborativo',
      description: 'Trabalho bem em equipe e valorizo parcerias',
      color: 'ravyz-green',
      icon: '🤝'
    },
    {
      id: 'adaptable',
      title: 'Adaptável',
      description: 'Me ajusto facilmente a mudanças e novos desafios',
      color: 'ravyz-orange',
      icon: '🔄'
    },
    {
      id: 'detail_oriented',
      title: 'Detalhista',
      description: 'Presto atenção aos detalhes e busco perfeição',
      color: 'ravyz-blue',
      icon: '🔍'
    },
    {
      id: 'communicative',
      title: 'Comunicativo',
      description: 'Me expresso bem e gosto de interagir com pessoas',
      color: 'ravyz-purple',
      icon: '💬'
    },
    {
      id: 'proactive',
      title: 'Proativo',
      description: 'Antecipo problemas e tomo ação antes que seja necessário',
      color: 'ravyz-green',
      icon: '⚡'
    },
    {
      id: 'strategic',
      title: 'Estratégico',
      description: 'Penso no longo prazo e planejo cuidadosamente',
      color: 'ravyz-orange',
      icon: '🎯'
    },
    {
      id: 'empathetic',
      title: 'Empático',
      description: 'Entendo e me preocupo com os sentimentos dos outros',
      color: 'ravyz-green',
      icon: '❤️'
    },
    {
      id: 'resilient',
      title: 'Resiliente',
      description: 'Me recupero rapidamente de setbacks e dificuldades',
      color: 'ravyz-blue',
      icon: '💪'
    },
    {
      id: 'innovative',
      title: 'Inovador',
      description: 'Busco constantemente maneiras novas de fazer as coisas',
      color: 'ravyz-purple',
      icon: '💡'
    }
  ];

  const handleTraitToggle = (traitId: string) => {
    const isSelected = selectedTraits.includes(traitId);
    
    if (isSelected) {
      // Remove trait
      onTraitsChange(selectedTraits.filter(id => id !== traitId));
    } else {
      // Add trait if under limit
      if (selectedTraits.length < maxSelection) {
        onTraitsChange([...selectedTraits, traitId]);
      }
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = "transition-all duration-200";
    
    if (isSelected) {
      switch (color) {
        case 'ravyz-orange':
          return `${baseClasses} bg-ravyz-orange text-white border-ravyz-orange`;
        case 'ravyz-green':
          return `${baseClasses} bg-ravyz-green text-white border-ravyz-green`;
        case 'ravyz-purple':
          return `${baseClasses} bg-ravyz-purple text-white border-ravyz-purple`;
        case 'ravyz-blue':
          return `${baseClasses} bg-ravyz-blue text-white border-ravyz-blue`;
        default:
          return `${baseClasses} bg-ravyz-orange text-white border-ravyz-orange`;
      }
    } else {
      return `${baseClasses} bg-white border-ravyz-gray-200 hover:border-${color} text-ravyz-gray-700 hover:text-${color}`;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-ravyz-black mb-1">
            Perfil de Personalidade
          </h3>
          <p className="text-sm text-ravyz-gray-500">
            Escolha até {maxSelection} características que melhor te descrevem
          </p>
        </div>
        <div className="text-sm text-ravyz-gray-500">
          {selectedTraits.length}/{maxSelection}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {personalityTraits.map((trait, index) => {
          const isSelected = selectedTraits.includes(trait.id);
          const isDisabled = !isSelected && selectedTraits.length >= maxSelection;

          return (
            <motion.button
              key={trait.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => !isDisabled && handleTraitToggle(trait.id)}
              disabled={isDisabled}
              className={cn(
                "p-4 rounded-xl border-2 text-left relative overflow-hidden",
                getColorClasses(trait.color, isSelected),
                {
                  "opacity-50 cursor-not-allowed": isDisabled,
                  "cursor-pointer hover:shadow-md": !isDisabled,
                }
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{trait.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium mb-1">{trait.title}</h4>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm opacity-80",
                    { "text-white": isSelected, "text-ravyz-gray-600": !isSelected }
                  )}>
                    {trait.description}
                  </p>
                </div>
              </div>

              {/* Subtle background pattern */}
              {isSelected && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
                  }} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedTraits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-ravyz-green/10 rounded-xl border border-ravyz-green/20"
        >
          <h4 className="font-medium text-ravyz-green mb-2">Seu Perfil Selecionado:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTraits.map(traitId => {
              const trait = personalityTraits.find(t => t.id === traitId);
              return trait ? (
                <span
                  key={traitId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-ravyz-green border border-ravyz-green/20"
                >
                  <span>{trait.icon}</span>
                  {trait.title}
                </span>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}