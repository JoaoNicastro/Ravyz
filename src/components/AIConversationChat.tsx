import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mic, MicOff, CheckCircle, Volume2, VolumeX, Play, Pause, Bot, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { CustomAudioPlayer } from "./CustomAudioPlayer";
import { processAIConversationInsights, processUserAudioResponse } from "../lib/n8n";
import { 
  generateMockAudioData, 
  createMediaRecorder, 
  checkAudioSupport 
} from "../lib/audio-utils";

interface AIConversationChatProps {
  onComplete: (assessmentData: any) => void;
  onBack: () => void;
  mentorData?: {
    name: string;
    avatar: string;
    color: string;
    description?: string;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioUrl?: string;
  timestamp: Date;
  isPlaying?: boolean;
}

type ConversationState = 'waiting' | 'listening' | 'processing' | 'speaking' | 'completed';

export function AIConversationChat({ onComplete, onBack, mentorData }: AIConversationChatProps) {
  const [state, setState] = useState<ConversationState>('waiting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioSupport, setAudioSupport] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mentorName = mentorData?.name || 'AI Mentor';
  const mentorAvatar = mentorData?.avatar || '🤖';

  const questions = [
    "Olá! Vamos descobrir seu perfil profissional. Qual é sua área de atuação atual?",
    "Interessante! Como você prefere trabalhar em equipe?", 
    "E quando você tem um problema complexo, qual seu primeiro instinto?",
    "Muito bom! Me conte sobre uma conquista profissional que te deixou orgulhoso.",
    "Para finalizar, onde você se vê profissionalmente nos próximos anos?"
  ];

  useEffect(() => {
    // Verificar suporte de áudio na inicialização
    const support = checkAudioSupport();
    setAudioSupport(support);
    
    if (!support.supported) {
      setAudioError(support.message || 'Funcionalidades de áudio não suportadas');
    }
    
    // Iniciar com mensagem de boas-vindas
    setTimeout(() => {
      sendAIMessage(questions[0]);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const safeText = (v: any, fb: string) =>
  (typeof v === 'string' && v.trim() !== '' && v.trim().toLowerCase() !== 'undefined')
    ? v
    : fb;


  const sendAIMessage = async (text: string) => {
  setState('speaking');
  setAudioError(null);

  const aiMessage: ChatMessage = {
    id: `ai-${Date.now()}`,
    type: 'ai',
    text: safeText(text, ''),     // <- aqui
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, aiMessage]);
  setTimeout(() => setState('waiting'), 500);
};

  const playAudio = async (audioUrl: string, messageId: string) => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    setPlayingMessageId(messageId);

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);

    audio.onended = () => {
      setPlayingMessageId(null);
      setCurrentAudio(null);
      setState('waiting');
    };

    audio.onerror = () => {
      setPlayingMessageId(null);
      setCurrentAudio(null);
      setState('waiting');
      setAudioError('Erro na reprodução do áudio');
    };

    await audio.play(); // toca só uma vez
  } catch (e) {
    setPlayingMessageId(null);
    setCurrentAudio(null);
    setState('waiting');
    setAudioError('Falha na reprodução do áudio');
  }
};


  const startRecording = async () => {
    setAudioError(null);
    
    try {
      const result = await createMediaRecorder((audioBlob) => {
        processUserAudio(audioBlob);
      });

      if (result.error) {
        setAudioError(result.error);
        return;
      }

      if (result.recorder) {
        mediaRecorderRef.current = result.recorder;
        result.recorder.start();
        setIsRecording(true);
        setState('listening');
      }
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setAudioError('Erro ao inicializar gravação de áudio');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setState('processing');
    }
  };

  const processUserAudio = async (audioBlob: Blob) => {
    try {
      // Usar integração real com n8n
      const result = await processUserAudioResponse({
        candidateId: 'user-123', // Em produção, usar ID real do usuário
        audioBlob,
        questionIndex: currentQuestionIndex,
        mentorData: {
          name: mentorName,
          avatar: mentorAvatar,
          personality: mentorData?.description || 'Mentor experiente'
        }
      });

      if (!result.success) {
        console.error('Erro ao processar áudio:', result.error);
        setState('waiting');
        return;
      }

      // Adicionar mensagem do usuário com transcrição
      const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: safeText(result.transcription, 'Resposta recebida do candidato'), // <- aqui
      timestamp: new Date(),
      };



      setMessages(prev => [...prev, userMessage]);

      // Se a conversa está completa
      if (result.isComplete) {
        setConversationComplete(true);
        setState('completed');
        
        const finalMessage: ChatMessage = {
          id: `ai-final-${Date.now()}`,
          type: 'ai',
          text: "Perfeito! Tenho todas as informações necessárias. Vou processar seu perfil profissional agora.",
          audioUrl: generateMockAudioData(2000), // 2 KB de áudio falso
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, finalMessage]);
      } else {
        // Continuar conversa com próxima pergunta ou resposta da IA
        const nextQuestionIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextQuestionIndex);
        
        if (result.aiResponse && nextQuestionIndex < questions.length) {
          const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          text: safeText(result.aiResponse?.text, 'Tudo certo, vamos continuar.'), // <- aqui

          audioUrl: result.aiResponse?.audioUrl,
          timestamp: new Date(),
        };

          
          setMessages(prev => [...prev, aiMessage]);
          
          // Reproduzir resposta automaticamente
          setTimeout(() => {
            playAudio(result.aiResponse!.audioUrl, aiMessage.id);
          }, 500);
        } else if (nextQuestionIndex < questions.length) {
          // Fazer próxima pergunta
          sendAIMessage(questions[nextQuestionIndex]);
        }
      }

    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      setState('waiting');
    }
  };

  const handlePlayAudio = (audioUrl: string, messageId: string) => {
    if (playingMessageId === messageId) {
      // Pausar se já estiver tocando
      if (currentAudio) {
        currentAudio.pause();
        setPlayingMessageId(null);
        setCurrentAudio(null);
      }
    } else {
      // Reproduzir áudio
      playAudio(audioUrl, messageId);
    }
  };

  const handleComplete = async () => {
    try {
      // Processar insights da conversa via n8n
      const conversationData = {
        method: 'ai-conversation' as const,
        responses: messages.filter(m => m.type === 'user').map(m => m.text),
        duration: Math.floor((Date.now() - messages[0].timestamp.getTime()) / 1000),
        mentorUsed: mentorName
      };

      // Em produção, chamar n8n
      // await processAIConversationInsights({
      //   candidateId: 'user-123',
      //   conversationData,
      //   extractedInsights: {
      //     skills: [],
      //     interests: [],
      //     careerGoals: [],
      //     personalityTraits: []
      //   }
      // });

      const mockResult = {
        primaryProfile: "Comunicador Estratégico",
        secondaryProfile: "Analista Criativo",
        profileType: "communication",
        assessmentScore: 87,
        percentile: 83,
        scores: {
          leadership: 3.9,
          communication: 4.4,
          analytical: 4.1,
          creative: 3.8,
          execution: 4.0
        },
        strengths: ["Comunicação", "Trabalho em Equipe", "Análise"],
        developmentAreas: ["Liderança", "Inovação"],
        conversationInsights: conversationData
      };

      onComplete(mockResult);
    } catch (error) {
      console.error('Erro ao finalizar conversa:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Conversa com AI Mentor
                </h1>
                <p className="text-white/70 text-sm">
                  {mentorName} • {state === 'completed' ? 'Conversa finalizada' : `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6 min-h-[calc(100vh-200px)]">
        {/* Audio Error Alert */}
        {audioError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-300 mb-1">Problema com Áudio</h4>
                <p className="text-sm text-red-200">{audioError}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAudioError(null)}
                  className="mt-2 border-red-500/30 text-red-300 hover:bg-red-500/20"
                >
                  Entendi
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Audio Support Warning */}
        {audioSupport && !audioSupport.supported && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-300 mb-1">Funcionalidades Limitadas</h4>
                <p className="text-sm text-yellow-200">
                  {audioSupport.message}. Você ainda pode continuar a conversa usando texto.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-6 mb-6">
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-purple-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-white text-sm font-bold">U</span>
                    ) : (
                      <span className="text-white text-lg">{mentorAvatar}</span>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-6 py-4 ${
                    message.type === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}>
                    <div className="leading-relaxed">
                      {message.text}
                    </div>
                    
                    {/* Custom Audio Player for AI messages */}
                    {message.type === 'ai' && message.audioUrl && (
                      <div className="mt-4">
                        <CustomAudioPlayer
                          audioUrl={message.audioUrl}
                          isPlaying={playingMessageId === message.id}
                          onPlayPause={() => handlePlayAudio(message.audioUrl!, message.id)}
                          onEnded={() => {
                            setPlayingMessageId(null);
                            setCurrentAudio(null);
                          }}
                          className="bg-purple-600/20 backdrop-blur-sm"
                          showWaveform={true}
                        />
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-purple-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Typing/Processing Indicator */}
          {(state === 'processing' || state === 'speaking') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg">{mentorAvatar}</span>
                </div>
                <div className="bg-gray-800 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-sm text-gray-300">
                      {state === 'processing' ? 'Processando sua resposta...' : 'Falando...'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {state === 'completed' ? (
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Ver Meu Perfil Completo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Recording Button */}
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={state === 'processing' || state === 'speaking' || !audioSupport?.features.mediaRecorder}
                  className={`w-20 h-20 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : audioSupport?.features.mediaRecorder
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-500'
                  } text-white disabled:opacity-50 shadow-lg`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
                
                <p className="text-white/70 text-sm text-center max-w-xs">
                  {state === 'listening' 
                    ? 'Gravando... Toque para parar' 
                    : state === 'processing' 
                    ? 'Processando sua resposta...'
                    : state === 'speaking'
                    ? 'Aguarde o áudio terminar'
                    : !audioSupport?.features.mediaRecorder
                    ? 'Gravação não disponível neste navegador'
                    : 'Clique para falar sua resposta'
                  }
                </p>

                {/* Alternative text input for unsupported browsers */}
                {!audioSupport?.features.mediaRecorder && (
                  <Button
                    onClick={() => {
                      // Simular processamento de resposta de texto
                      const mockTranscription = [
                        "Trabalho na área de tecnologia",
                        "Prefiro trabalhar em equipe",
                        "Analiso bem antes de decidir",
                        "Me orgulho dos projetos que liderei",
                        "Quero crescer na carreira"
                      ][currentQuestionIndex] || "Resposta do usuário";

                      const userMessage: ChatMessage = {
                        id: `user-${Date.now()}`,
                        type: 'user',
                        text: safeText(mockTranscription, 'Resposta do candidato'),
                        timestamp: new Date()
                      };

                      setMessages(prev => [...prev, userMessage]);

                      // Continuar conversa
                      const nextQuestionIndex = currentQuestionIndex + 1;
                      setCurrentQuestionIndex(nextQuestionIndex);

                      if (nextQuestionIndex < questions.length) {
                        setTimeout(() => {
                          sendAIMessage(questions[nextQuestionIndex]);
                        }, 1000);
                      } else {
                        setConversationComplete(true);
                        setState('completed');
                      }
                    }}
                    disabled={state === 'processing' || state === 'speaking'}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Continuar sem áudio
                  </Button>
                )}
              </div>

              {/* Global Audio Player for active playback */}
              {playingMessageId && currentAudio && (
                <CustomAudioPlayer
                  audioUrl={messages.find(m => m.id === playingMessageId)?.audioUrl || ''}
                  isPlaying={true}
                  onPlayPause={() => {
                    if (currentAudio) {
                      currentAudio.pause();
                      setPlayingMessageId(null);
                      setCurrentAudio(null);
                    }
                  }}
                  onEnded={() => {
                    setPlayingMessageId(null);
                    setCurrentAudio(null);
                  }}
                  variant="floating"
                  showWaveform={true}
                />
              )}
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentQuestionIndex ? 'bg-purple-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}