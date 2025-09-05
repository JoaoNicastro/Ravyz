import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Lightbulb, Heart, Target, Zap } from "lucide-react";
import { Card } from "./ui/card";

interface MentorMessageProps {
  mentor: {
    name: string;
    avatar: string;
    color: string;
    category: string;
  };
  message: string;
  type?: 'tip' | 'encouragement' | 'warning' | 'celebration';
  onClose?: () => void;
  autoClose?: boolean;
  position?: 'top-right' | 'bottom-right' | 'center';
  className?: string;
}

export function MentorMessage({ 
  mentor, 
  message, 
  type = 'tip',
  onClose,
  autoClose = false,
  position = 'top-right',
  className = ''
}: MentorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  const getTypeIcon = () => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'encouragement':
        return <Heart className="w-4 h-4" />;
      case 'warning':
        return <Target className="w-4 h-4" />;
      case 'celebration':
        return <Zap className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'tip':
        return 'text-ravyz-blue';
      case 'encouragement':
        return 'text-ravyz-green';
      case 'warning':
        return 'text-ravyz-orange';
      case 'celebration':
        return 'text-ravyz-purple';
      default:
        return `text-${mentor.color}`;
    }
  };

  const getTypeBg = () => {
    switch (type) {
      case 'tip':
        return 'bg-ravyz-blue/10 border-ravyz-blue/20';
      case 'encouragement':
        return 'bg-ravyz-green/10 border-ravyz-green/20';
      case 'warning':
        return 'bg-ravyz-orange/10 border-ravyz-orange/20';
      case 'celebration':
        return 'bg-ravyz-purple/10 border-ravyz-purple/20';
      default:
        return `bg-${mentor.color}/10 border-${mentor.color}/20`;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'center':
        return 'mx-auto';
      default:
        return '';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (autoClose) {
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: position.includes('top') ? -20 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: position.includes('top') ? -20 : 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`${getPositionClasses()} max-w-sm w-full ${className}`}
        >
          <Card className={`p-4 border-2 shadow-lg ${getTypeBg()}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="text-2xl">{mentor.avatar}</div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {mentor.name}
                    </span>
                    <div className={`${getTypeColor()}`}>
                      {getTypeIcon()}
                    </div>
                  </div>
                  
                  {onClose && (
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente para mensagens contextuais do mentor
interface ContextualMentorMessageProps {
  mentor: {
    name: string;
    avatar: string;
    color: string;
    category: string;
  };
  context: 'welcome' | 'progress' | 'completion' | 'stuck' | 'achievement';
  data?: any;
  onClose?: () => void;
}

export function ContextualMentorMessage({ 
  mentor, 
  context, 
  data,
  onClose 
}: ContextualMentorMessageProps) {
  const getMessage = () => {
    const mentorName = mentor.name;
    
    switch (context) {
      case 'welcome':
        return {
          message: `Olá! Sou ${mentorName}, seu ${mentor.category.toLowerCase()} pessoal. Estou aqui para te guiar em cada etapa. Vamos começar essa jornada incrível! ✨`,
          type: 'encouragement' as const
        };
      
      case 'progress':
        return {
          message: `Ótimo progresso! Você está no caminho certo. Continue assim que logo alcançaremos seus objetivos! 🚀`,
          type: 'encouragement' as const
        };
      
      case 'completion':
        return {
          message: `Parabéns! Você completou mais uma etapa importante. Sua dedicação está dando frutos! 🎉`,
          type: 'celebration' as const
        };
      
      case 'stuck':
        return {
          message: `Percebo que você pode estar com alguma dúvida. Lembre-se: cada passo, por menor que seja, te aproxima do seu objetivo. Que tal dar uma pausa e voltar com energia renovada? 💪`,
          type: 'tip' as const
        };
      
      case 'achievement':
        return {
          message: `Incrível! Você alcançou um marco importante. Sua determinação é inspiradora. Vamos celebrar este momento! 🏆`,
          type: 'celebration' as const
        };
      
      default:
        return {
          message: `${mentorName} está aqui para ajudar você! 😊`,
          type: 'tip' as const
        };
    }
  };

  const { message, type } = getMessage();

  return (
    <MentorMessage
      mentor={mentor}
      message={message}
      type={type}
      onClose={onClose}
      autoClose={context === 'progress' || context === 'completion'}
    />
  );
}