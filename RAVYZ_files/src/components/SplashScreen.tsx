import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RavyzLogo } from "./RavyzLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Animate progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 1000); // Aumentar o tempo para mostrar os cards
          return 100;
        }
        return prev + 1.5; // Diminuir a velocidade para dar mais tempo
      });
    }, 40);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-ravyz-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-ravyz-purple rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-ravyz-blue rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="mb-8">
            <RavyzLogo size="lg" variant="full" animated={showContent} />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-ravyz-orange via-ravyz-green to-ravyz-purple bg-clip-text text-transparent mb-4"
          >
            Conectando Talentos
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Plataforma inteligente para matching de candidatos e empresas
          </motion.p>

          {/* Métricas de Efetividade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-ravyz-orange mb-1">+10k</div>
              <div className="text-xs text-gray-600">Vagas fechadas</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-ravyz-green mb-1">-30%</div>
              <div className="text-xs text-gray-600">Turnover</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-ravyz-blue mb-1">3x</div>
              <div className="text-xs text-gray-600">Mais rápido</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-ravyz-purple mb-1">+90%</div>
              <div className="text-xs text-gray-600">Aderência de perfil</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="space-y-4"
        >
          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Carregando</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className="bg-ravyz-orange h-1 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Loading states */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-sm text-gray-500"
          >
            {progress < 30 && "Inicializando sistema..."}
            {progress >= 30 && progress < 60 && "Carregando dados..."}
            {progress >= 60 && progress < 90 && "Preparando interface..."}
            {progress >= 90 && "Quase pronto!"}
          </motion.div>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-4 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-purple rounded-full"></div>
            <span>Match Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-orange rounded-full"></div>
            <span>IA Avançada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-blue rounded-full"></div>
            <span>Processo Rápido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ravyz-green rounded-full"></div>
            <span>Resultados Precisos</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}