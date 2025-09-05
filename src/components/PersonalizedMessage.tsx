import { motion } from 'motion/react';
import { MessageCircle, Sparkles, Target, Heart, Shield, Crown } from 'lucide-react';
import { Card } from './ui/card';

interface PersonalizedMessageProps {
  mentorData?: {
    name: string;
    category: string;
    avatar: string;
    color: string;
    personality: string;
  };
  messageType: 'welcome' | 'encouragement' | 'guidance' | 'progress' | 'completion' | 'motivation';
  context?: string; // Contexto específico da mensagem
  className?: string;
}

export function PersonalizedMessage({ 
  mentorData, 
  messageType, 
  context, 
  className = '' 
}: PersonalizedMessageProps) {
  
  const getPersonalizedMessage = (): string => {
    if (!mentorData) return getDefaultMessage();

    const { name, category } = mentorData;
    
    const messages = {
      'mestre': {
        welcome: `Bem-vindo, jovem aprendiz! Sou ${name}, seu Mestre. Com minha experiência ancestral, vamos traçar o caminho mais sábio para sua carreira. Cada decisão será tomada com profunda reflexão.`,
        encouragement: `${name} vê grande potencial em você. Como os grandes mestres do passado, sabemos que a paciência e persistência são as chaves do sucesso. Continue firme em sua jornada.`,
        guidance: `Permita-me compartilhar uma sabedoria: ${context}. Como seu Mestre, aconselho que você reflita profundamente sobre estas possibilidades antes de tomar sua decisão.`,
        progress: `Excelente progresso! ${name} observa com satisfação sua evolução. Cada etapa completada é um passo em direção à maestria profissional.`,
        completion: `Parabéns! Você demonstrou a sabedoria de um verdadeiro aprendiz. ${name} está orgulhoso de ter guiado você nesta jornada transformadora.`,
        motivation: `Lembre-se: grandes conquistas exigem grande sabedoria. ${name} está aqui para iluminar seu caminho com a experiência de eras passadas.`
      },
      'guru': {
        welcome: `Olá, alma inovadora! Sou ${name}, seu Guru da transformação. Juntos vamos despertar seu potencial criativo e revolucionar sua trajetória profissional com insights únicos!`,
        encouragement: `${name} sente a energia de transformação fluindo através de você! Confie em sua intuição criativa - ela é sua maior força para inovar e se destacar.`,
        guidance: `Aqui está um insight poderoso: ${context}. ${name} vê oportunidades infinitas de crescimento. Deixe sua criatividade guiar suas escolhas!`,
        progress: `Que evolução inspiradora! ${name} celebra cada breakthrough que você alcança. Sua mente criativa está se expandindo beautifully.`,
        completion: `Uau! Você acabou de passar por uma transformação incrível! ${name} está radiante vendo você abraçar seu potencial inovador completo.`,
        motivation: `Canalizar sua energia criativa é o segredo! ${name} está aqui para despertar insights que vão revolucionar sua carreira.`
      },
      'coach': {
        welcome: `E aí, campeão! Sou ${name}, seu Coach pessoal. Vamos treinar pesado para conquistar seus objetivos! Foco, disciplina e muita determinação - essa é nossa fórmula vencedora!`,
        encouragement: `Isso mesmo! ${name} está vendo você dar o seu melhor. Cada desafio é uma oportunidade de crescer mais forte. Vamos com tudo para o próximo nível!`,
        guidance: `Escuta aqui, guerreiro: ${context}. ${name} está aqui para te dar o push que você precisa. Foco no objetivo e vamos conquistar isso juntos!`,
        progress: `Arrasou! ${name} está super orgulhoso do seu desempenho. Você está provando que tem tudo para ser um vencedor!`,
        completion: `FANTÁSTICO! Você cruzou a linha de chegada com estilo! ${name} sabia que você tinha essa garra toda. Parabéns, campeão!`,
        motivation: `Vamos lá! ${name} sabe que você tem fogo dentro do peito. Hora de mostrar do que você é capaz e conquistar tudo que merece!`
      },
      'mentor': {
        welcome: `Oi! Que alegria te conhecer! Sou ${name}, seu Mentor de coração. Estou aqui para caminhar ao seu lado, te apoiando em cada passo da sua jornada profissional.`,
        encouragement: `${name} acredita muito em você! Sei que às vezes o caminho parece desafiador, mas lembre-se: você não está sozinho. Estamos juntos nessa!`,
        guidance: `Vou te contar algo importante: ${context}. Como seu mentor, ${name} está aqui para te orientar com carinho. Que tal conversarmos sobre suas opções?`,
        progress: `Que orgulho! ${name} está muito feliz vendo você crescer assim. Cada pequeno passo conta, e você está no caminho certo!`,
        completion: `Estou emocionado! Você conseguiu! ${name} está aqui aplaudindo cada conquista sua. Que jornada maravilhosa vivemos juntos!`,
        motivation: `Você é incrível! ${name} está sempre aqui para te lembrar do seu potencial. Vamos continuar construindo seu futuro dos sonhos!`
      },
      'anjo-da-guarda': {
        welcome: `Olá, querido! Sou ${name}, seu Anjo da Guarda profissional. Estou aqui para te proteger de armadilhas e garantir que você tome sempre as melhores decisões para sua carreira.`,
        encouragement: `${name} está zelando por você! Mesmo quando as coisas parecem incertas, saiba que estou aqui para te proteger e guiar pelos caminhos mais seguros.`,
        guidance: `Atenção especial para isso: ${context}. ${name} sente que é importante você considerar todos os aspectos antes de decidir. Sua segurança profissional é minha prioridade!`,
        progress: `Que cuidado exemplar você está tendo! ${name} está tranquilo vendo suas escolhas tão sensatas. Continue assim, protegido e determinado!`,
        completion: `Perfeito! Você tomou todas as decisões certas! ${name} está orgulhoso de ter te protegido durante toda essa jornada importante.`,
        motivation: `Lembre-se: ${name} está sempre te protegendo! Confie em sua intuição e nas orientações que te dou - juntos vamos manter você sempre no caminho certo.`
      }
    };

    const categoryKey = category.toLowerCase().replace(/[^a-z]/g, '').replace('anjo-da-guarda', 'anjo-da-guarda') as keyof typeof messages;
    return messages[categoryKey]?.[messageType] || getDefaultMessage();
  };

  const getDefaultMessage = (): string => {
    const defaultMessages = {
      welcome: "Bem-vindo ao RAVYZ! Vamos começar essa jornada incrível juntos!",
      encouragement: "Você está indo muito bem! Continue assim!",
      guidance: "Aqui estão algumas orientações para te ajudar em sua decisão.",
      progress: "Excelente progresso! Você está no caminho certo!",
      completion: "Parabéns! Você completou esta etapa com sucesso!",
      motivation: "Acredite em você! Grandes coisas estão por vir!"
    };
    return defaultMessages[messageType];
  };

  const getMessageIcon = () => {
    if (!mentorData) return MessageCircle;
    
    const iconMap = {
      'mestre': Crown,
      'guru': Sparkles,
      'coach': Target,
      'mentor': Heart,
      'anjo-da-guarda': Shield
    };
    
    const categoryKey = mentorData.category.toLowerCase().replace(/[^a-z]/g, '').replace('anjo-da-guarda', 'anjo-da-guarda') as keyof typeof iconMap;
    return iconMap[categoryKey] || MessageCircle;
  };

  const IconComponent = getMessageIcon();
  const mentorColor = mentorData?.color || 'ravyz-blue';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <Card className={`p-4 bg-gradient-to-r from-${mentorColor}/10 to-white border-${mentorColor}/20`}>
        <div className="flex gap-3">
          {/* Avatar do Mentor */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 bg-${mentorColor}/10 rounded-full flex items-center justify-center`}>
              {mentorData?.avatar ? (
                <span className="text-2xl">{mentorData.avatar}</span>
              ) : (
                <IconComponent className={`w-6 h-6 text-${mentorColor}`} />
              )}
            </div>
          </div>

          {/* Conteúdo da Mensagem */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium text-${mentorColor}`}>
                {mentorData?.name || 'Seu Mentor'}
              </span>
              {mentorData?.category && (
                <span className="text-xs text-gray-500">
                  • {mentorData.category}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {getPersonalizedMessage()}
            </p>

            {/* Indicador de que a mensagem é personalizada */}
            {mentorData && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>Mensagem personalizada por {mentorData.name}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}