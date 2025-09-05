import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface SplashScreenNewProps {
  onComplete: () => void;
}

export function SplashScreenNew({ onComplete }: SplashScreenNewProps) {
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0" style={{ opacity: 0.05 }}>
        <div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl" 
          style={{ backgroundColor: '#FF7A00' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl" 
          style={{ backgroundColor: '#6C4DFF' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl" 
          style={{ backgroundColor: '#1477FF' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          {/* NOME DA PLATAFORMA - PROTAGONISTA ABSOLUTO */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-bold mb-6 tracking-tight"
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF7A00 0%, #6C4DFF 50%, #1477FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 0.9,
              letterSpacing: '-0.02em'
            }}
          >
            RAVYZ
          </motion.h1>
          
          {/* TAGLINE - SEGUNDO DESTAQUE */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-medium mb-4"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: '#444444',
              fontWeight: 500
            }}
          >
            be the{' '}
            <span className="font-bold" style={{ color: '#FF7A00' }}>
              GOAT
            </span>
            {' '}of{' '}
            <span className="font-bold" style={{ color: '#6C4DFF' }}>
              YOU
            </span>
          </motion.div>
          
          {/* SLOGAN - TERCEIRO DESTAQUE */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-medium mb-6"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
              color: '#1477FF',
              fontWeight: 500
            }}
          >
            Rise Above, Go Beyond
          </motion.p>
          
          {/* DESCRIÇÃO - MENOR */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#8A8A8A',
              fontWeight: 400
            }}
          >
            Conecte talentos, ache a pessoa com fit ideal, seja dono da sua carreira, encontre a vaga perfeita
          </motion.p>

          {/* MÉTRICAS DE EFETIVIDADE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div 
                className="font-bold mb-2" 
                style={{ fontSize: '2rem', color: '#FF7A00' }}
              >
                +10k
              </div>
              <div className="text-sm text-gray-600 font-medium">Vagas fechadas</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div 
                className="font-bold mb-2" 
                style={{ fontSize: '2rem', color: '#00A86B' }}
              >
                -30%
              </div>
              <div className="text-sm text-gray-600 font-medium">Turnover</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div 
                className="font-bold mb-2" 
                style={{ fontSize: '2rem', color: '#1477FF' }}
              >
                3x
              </div>
              <div className="text-sm text-gray-600 font-medium">Mais rápido</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div 
                className="font-bold mb-2" 
                style={{ fontSize: '2rem', color: '#6C4DFF' }}
              >
                +90%
              </div>
              <div className="text-sm text-gray-600 font-medium">Aderência de perfil</div>
            </div>
          </motion.div>
        </motion.div>

        {/* PROGRESS BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="space-y-4"
        >
          <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-3 font-medium">
              <span>Carregando</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #FF7A00 0%, #6C4DFF 100%)'
                }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="text-sm text-gray-500 font-medium"
          >
            {progress < 30 && "Inicializando sistema..."}
            {progress >= 30 && progress < 60 && "Carregando dados..."}
            {progress >= 60 && progress < 90 && "Preparando interface..."}
            {progress >= 90 && "Quase pronto!"}
          </motion.div>
        </motion.div>

        {/* FEATURES PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-6 text-sm text-gray-500 max-w-md mx-auto"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: '#6C4DFF' }}
            />
            <span className="font-medium">Match Inteligente</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: '#FF7A00' }}
            />
            <span className="font-medium">IA Avançada</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: '#1477FF' }}
            />
            <span className="font-medium">Processo Rápido</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: '#00A86B' }}
            />
            <span className="font-medium">Resultados Precisos</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}