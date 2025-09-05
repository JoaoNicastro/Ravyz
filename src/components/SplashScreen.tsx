import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
          setTimeout(onComplete, 1500);
          return 100;
        }
        return prev + 1.2;
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
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: '#FF7A00' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: '#6C4DFF' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: '#1477FF' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Nome da Plataforma - PRINCIPAL */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-bold mb-4 tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              background: 'linear-gradient(to right, #FF7A00, #6C4DFF, #1477FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            RAVYZ
          </motion.h1>
          
          {/* Tagline - Logo abaixo do nome */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-medium mb-6"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              color: '#444444'
            }}
          >
            be the <span className="font-bold" style={{ color: '#FF7A00' }}>GOAT</span> of <span className="font-bold" style={{ color: '#6C4DFF' }}>YOU</span>
          </motion.div>
          
          {/* Slogan - Menor que o nome principal */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-medium mb-3"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#1477FF'
            }}
          >
            Rise Above, Go Beyond
          </motion.p>
          
          {/* Descrição */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 max-w-lg mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: '#8A8A8A'
            }}
          >
            Conecte talentos, ache a pessoa com fit ideal, seja dono da sua carreira, encontre a vaga perfeita
          </motion.p>

          {/* Métricas de Efetividade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="font-bold mb-1" style={{ fontSize: '1.5rem', color: '#FF7A00' }}>+10k</div>
              <div className="text-xs text-gray-600">Vagas fechadas</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="font-bold mb-1" style={{ fontSize: '1.5rem', color: '#00A86B' }}>-30%</div>
              <div className="text-xs text-gray-600">Turnover</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="font-bold mb-1" style={{ fontSize: '1.5rem', color: '#1477FF' }}>3x</div>
              <div className="text-xs text-gray-600">Mais rápido</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <div className="font-bold mb-1" style={{ fontSize: '1.5rem', color: '#6C4DFF' }}>+90%</div>
              <div className="text-xs text-gray-600">Aderência de perfil</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
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
                className="h-1 rounded-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#FF7A00'
                }}
              />
            </div>
          </div>

          {/* Loading states */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
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
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-4 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C4DFF' }}></div>
            <span>Match Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF7A00' }}></div>
            <span>IA Avançada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1477FF' }}></div>
            <span>Processo Rápido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00A86B' }}></div>
            <span>Resultados Precisos</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}