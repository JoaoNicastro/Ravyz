import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Send, User, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface AIWritingChatProps {
  onComplete: (assessmentData: any) => void;
  onBack: () => void;
  mentorData?: {
    name: string;
    avatar: string;
    color: string;
    description?: string;
  };
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIWritingChat({ onComplete, onBack, mentorData }: AIWritingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mentorColor = mentorData?.color || 'ravyz-green';
  const bgColorClass = mentorColor.includes('-') ? `bg-${mentorColor}` : 'bg-ravyz-green';

  useEffect(() => {
    // Mensagem de boas-vindas
    const welcomeMessage: Message = {
      id: 1,
      type: 'ai',
      content: `Olá! Sou ${mentorData?.name || 'seu mentor'} ${mentorData?.avatar || '🤖'}. Vou te ajudar a descobrir seu perfil profissional. Escreva livremente sobre você e sua carreira - quanto mais detalhes, melhor será sua análise!`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [mentorData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!currentInput.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    // Simular resposta da IA (apenas visual)
    setTimeout(() => {
      const responses = [
        `Interessante! Posso ver que você tem experiência valiosa. ${mentorData?.avatar || '🤖'} Continue me contando mais detalhes.`,
        `Muito bom! Suas habilidades são impressionantes. ${mentorData?.avatar || '🤖'} Me fale mais sobre seus objetivos.`,
        `Excelente! Estou entendendo melhor seu perfil. ${mentorData?.avatar || '🤖'} Que tipo de ambiente você prefere?`,
        `Perfeito! Tenho informações suficientes para criar sua análise. ${mentorData?.avatar || '🤖'} Processando seus dados...`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Variar o tempo de resposta
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleComplete = () => {
    // Mock result completo simulando análise da conversa
    const mockResult = {
      primaryProfile: "Comunicador Estratégico",
      secondaryProfile: "Líder Criativo", 
      profileType: "communication",
      assessmentScore: 85,
      percentile: 82,
      scores: {
        leadership: 4.1,
        communication: 4.6,
        analytical: 3.9,
        creative: 4.2,
        execution: 4.0
      },
      strengths: ["Comunicação", "Liderança", "Criatividade"],
      developmentAreas: ["Análise Técnica", "Gestão de Projetos"],
      personalityProfile: {
        traits: ["Comunicativo", "Empático", "Inovador"],
        workStyle: "Colaborativo e inspirador"
      },
      // Dados extraídos da conversa sobre preferências
      preferredRole: "Gerente de Comunicação",
      preferredIndustry: "Marketing Digital",
      workPreference: "Híbrido",
      preferredLocation: "São Paulo",
      salaryExpectation: { min: 9000, max: 16000 },
      desiredBenefits: ["Vale Refeição", "Plano de Saúde", "Flexibilidade de horário", "Desenvolvimento profissional"],
      companySizePreference: "Média a Grande",
      culturePreference: "Colaborativa e inovadora, com foco em crescimento"
    };
    
    onComplete(mockResult);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
                <span className="text-white text-lg">{mentorData?.avatar || '🤖'}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Escrevendo com IA
                </h1>
                <p className="text-gray-600 text-sm">
                  {mentorData ? `${mentorData.name} está analisando` : 'IA analisando'} suas respostas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[70vh] flex flex-col bg-white">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-ravyz-purple text-white' 
                        : `${bgColorClass} text-white`
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <span className="text-sm">{mentorData?.avatar || '🤖'}</span>
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-ravyz-purple text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${bgColorClass} flex items-center justify-center`}>
                    <span className="text-white text-sm">{mentorData?.avatar || '🤖'}</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                      <span className="text-sm text-gray-600">{mentorData?.name || 'IA'} está digitando...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreva sobre sua experiência profissional, habilidades, objetivos... (Shift + Enter para nova linha)"
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
                className={`${bgColorClass} hover:opacity-90 text-white px-4`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Conte sua história profissional</span>
              <span>{currentInput.length} caracteres</span>
            </div>
          </div>

          {/* Complete Button */}
          <div className="border-t border-gray-200 p-2">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleComplete}
                disabled={messages.length < 4} // Precisa de pelo menos algumas mensagens
                className={`flex-1 ${bgColorClass} hover:opacity-90 text-white disabled:opacity-50`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Análise
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-ravyz-orange rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}