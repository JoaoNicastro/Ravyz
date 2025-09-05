import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Home, ArrowLeft, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface DevNavigationProps {
  currentState: string;
  onNavigate: (state: string) => void;
  onGoHome: () => void;
}

const screens = [
  { id: "login-selection", name: "🏠 Tela Principal", color: "ravyz-orange" },
  { id: "login", name: "🔐 Login", color: "ravyz-blue" },
  { id: "purpose-selection", name: "🎯 Seleção de Propósito", color: "ravyz-purple" },
  { id: "basic-registration", name: "📝 Registro Básico", color: "ravyz-orange" },
  { id: "candidate-registration", name: "🧙‍♂️ Seleção de Avatar", color: "ravyz-purple" },
  { id: "questionnaire-method-selection", name: "🤖 Método Questionário", color: "ravyz-green" },
  { id: "professional-assessment", name: "📋 Avaliação Manual", color: "ravyz-purple" },
  { id: "ai-writing-chat", name: "✍️ IA Escrevendo", color: "ravyz-green" },
  { id: "ai-conversation-chat", name: "💬 Conversa IA", color: "ravyz-purple" },
  { id: "dream-job-builder", name: "💭 Construtor Job dos Sonhos", color: "ravyz-purple" },
  { id: "candidate-page", name: "👤 Página do Candidato", color: "ravyz-purple" },
  { id: "job-builder", name: "🏢 Construtor de Vagas", color: "ravyz-blue" },
  { id: "candidate-recommendations", name: "🔍 Recomendações", color: "ravyz-blue" },
  { id: "matching-page", name: "💕 Página de Matches", color: "ravyz-green" },
  { id: "company-dashboard", name: "📊 Dashboard Empresa", color: "ravyz-blue" },
  { id: "candidate-feedback", name: "⭐ Feedback Candidato", color: "ravyz-green" },
  { id: "salary-benchmarking", name: "💰 Benchmarking Salarial", color: "ravyz-green" }
];

export function DevNavigation({ currentState, onNavigate, onGoHome }: DevNavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + D para abrir/fechar
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      // ESC para fechar
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-ravyz-orange hover:bg-orange-600 text-white shadow-lg"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Dev Menu
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl"
        >
          <Card className="p-6 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ravyz-orange rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-ravyz-black font-semibold">Developer Navigation</h2>
                  <p className="text-sm text-ravyz-gray-500">
                    Estado atual: <span className="font-medium text-ravyz-orange">{currentState}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ir para Home
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {screens.map((screen) => {
                const isCurrent = currentState === screen.id;
                
                return (
                  <motion.div
                    key={screen.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        onNavigate(screen.id);
                        setIsVisible(false);
                      }}
                      variant={isCurrent ? "default" : "outline"}
                      className={`w-full justify-start h-auto p-3 text-left ${
                        isCurrent 
                          ? "bg-ravyz-orange hover:bg-orange-600 text-white border-ravyz-orange" 
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">
                          {screen.name}
                        </span>
                        {isCurrent && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-ravyz-gray-500">
                <span>💡 Pressione Ctrl + Shift + D para abrir este menu</span>
                <span>ESC para fechar</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}