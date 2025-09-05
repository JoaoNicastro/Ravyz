import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, UserPlus, TrendingUp, Users, Target, ChevronRight, Sparkles, BarChart3, Zap, Globe } from "lucide-react";

interface ProfileSelectionProps {
  onSelect: (types: ('candidate' | 'company')[]) => void;
  onBack: () => void;
}

export function ProfileSelection({ onSelect, onBack }: ProfileSelectionProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<('candidate' | 'company')[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Cleanup quando componente é desmontado
  useEffect(() => {
    console.log("🎬 ProfileSelection - Componente montado");
    
    return () => {
      console.log("🎬 ProfileSelection - Componente desmontado");
    };
  }, []);

  // Reset automático do estado de navegação após 3 segundos
  useEffect(() => {
    if (isNavigating) {
      console.log("⏱️ ProfileSelection - Reset automático ativado (3s)");
      const timeout = setTimeout(() => {
        console.log("⚠️ ProfileSelection - Reset automático executado");
        setIsNavigating(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

  const handleCardClick = (profile: 'candidate' | 'company') => {
    console.log("🎯 ProfileSelection - Clique no card:", profile);
    
    if (isNavigating) {
      console.log("❌ ProfileSelection - Já navegando...");
      return;
    }

    if (!onSelect || typeof onSelect !== 'function') {
      console.error("❌ ProfileSelection - onSelect não é uma função válida!");
      return;
    }

    console.log("🚀 ProfileSelection - Iniciando navegação para:", profile);
    setIsNavigating(true);
    
    // Navegar diretamente - reduzindo delay e adicionando mais logs
    setTimeout(() => {
      try {
        console.log("🔄 ProfileSelection - Chamando onSelect com:", [profile]);
        onSelect([profile]);
        console.log("✅ ProfileSelection - onSelect executado com sucesso");
      } catch (error) {
        console.error("💥 ProfileSelection - Erro na navegação:", error);
        setIsNavigating(false);
      }
    }, 300); // Reduzindo delay de 600ms para 300ms
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-ravyz-orange/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <span 
                  className="font-bold text-white"
                  style={{ 
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  RAVYZ
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-white/80 hover:text-white transition-colors font-medium">
                Sobre
              </button>
              <button className="text-white/80 hover:text-white transition-colors font-medium">
                Contato
              </button>
              <button 
                onClick={onBack}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all font-medium"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* NOME DA PLATAFORMA */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-bold mb-4 tracking-tight"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
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
            
            {/* TAGLINE */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-medium mb-5"
              style={{
                fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
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
            
            {/* SLOGAN */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-bold mb-6 leading-tight"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                color: '#111111',
                fontWeight: 700
              }}
            >
              Rise Above.
              <br />
              <span style={{ color: '#FF7A00' }}>Go Beyond.</span>
            </motion.h2>
            
            {/* DESCRIÇÃO */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="leading-relaxed max-w-2xl mx-auto mb-8"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: '#8A8A8A',
                fontWeight: 400
              }}
            >
              Conecte talentos e oportunidades com inteligência artificial. 
              Clique no perfil que descreve seus objetivos:
            </motion.p>

            {/* Indicador de Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl mb-8 border-2 transition-all duration-300 ${
                isNavigating
                  ? 'bg-ravyz-green/10 text-ravyz-green border-ravyz-green/30 shadow-lg'
                  : 'bg-ravyz-orange/10 text-ravyz-orange border-ravyz-orange/30'
              }`}
            >
              <motion.div
                animate={isNavigating ? { rotate: 360 } : {}}
                transition={{ duration: 0.5, repeat: isNavigating ? Infinity : 0 }}
              >
                {isNavigating ? (
                  <Target className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </motion.div>
              <span className="font-medium text-lg">
                {isNavigating 
                  ? 'Carregando...'
                  : 'Clique em um perfil para começar'}
              </span>
            </motion.div>

            {/* Métricas de Efetividade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="font-bold mb-2" 
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#FF7A00' }}
                >
                  +10k
                </div>
                <div className="text-sm text-gray-600">Vagas fechadas</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="font-bold mb-2" 
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#00A86B' }}
                >
                  -30%
                </div>
                <div className="text-sm text-gray-600">Turnover</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="font-bold mb-2" 
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1477FF' }}
                >
                  3x
                </div>
                <div className="text-sm text-gray-600">Mais rápido</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="font-bold mb-2" 
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#6C4DFF' }}
                >
                  +90%
                </div>
                <div className="text-sm text-gray-600">Aderência de perfil</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
          >
            {/* Candidato Button */}
            <motion.button
              onClick={() => handleCardClick('candidate')}
              disabled={isNavigating}
              whileHover={!isNavigating ? { scale: 1.02, y: -4 } : {}}
              whileTap={!isNavigating ? { scale: 0.98 } : {}}
              className={`group relative overflow-hidden rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 cursor-pointer ${
                isNavigating
                  ? 'border-ravyz-green/50 bg-gradient-to-br from-ravyz-purple/50 via-purple-600/50 to-purple-700/50 cursor-wait' 
                  : 'border-transparent hover:border-white/20 bg-gradient-to-br from-ravyz-purple via-purple-600 to-purple-700'
              }`}
              style={{ height: '680px' }}
            >

              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-ravyz-purple/95 via-purple-600/95 to-purple-700/95 group-hover:from-ravyz-purple group-hover:via-purple-600 group-hover:to-purple-700 transition-all duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute bottom-6 left-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Target className="w-6 h-6 text-white animate-bounce" style={{ animationDelay: '1s' }} />
              </div>

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-12">
                {/* Top Section */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Icon */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                    <Search className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  
                  {/* Main CTA */}
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300 text-center">
                    BUSCO VAGA
                  </h2>
                  
                  <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed text-center max-w-sm">
                    Encontre oportunidades perfeitas para seu perfil e fit cultural
                  </p>
                  
                  {/* Benefits */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">1</span>
                      </div>
                      <span className="text-left leading-relaxed">Match baseado em perfil comportamental</span>
                    </div>
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">2</span>
                      </div>
                      <span className="text-left leading-relaxed">Análise inteligente de currículo</span>
                    </div>
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">3</span>
                      </div>
                      <span className="text-left leading-relaxed">Oportunidades personalizadas para você</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section */}
                <div className="flex flex-col items-center">
                  {/* Action Button */}
                  <div 
                    className={`rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 font-bold ${
                      isNavigating
                        ? 'bg-ravyz-green text-white'
                        : 'bg-white text-ravyz-purple group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:text-white group-hover:scale-105'
                    }`}
                    style={{ width: '280px', height: '60px', fontSize: '18px' }}
                  >
                    <span>
                      {isNavigating ? 'CARREGANDO...' : 'CLIQUE PARA COMEÇAR'}
                    </span>
                    {isNavigating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 pt-4 border-t border-white/20 w-full text-center" style={{ height: '60px' }}>
                    <div className="text-sm opacity-80">
                      <span className="font-semibold">5.000+</span> candidatos ativos • 
                      <span className="font-semibold"> 89%</span> taxa de sucesso
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Empresa Button */}
            <motion.button
              onClick={() => handleCardClick('company')}
              disabled={isNavigating}
              whileHover={!isNavigating ? { scale: 1.02, y: -4 } : {}}
              whileTap={!isNavigating ? { scale: 0.98 } : {}}
              className={`group relative overflow-hidden rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 cursor-pointer ${
                isNavigating
                  ? 'border-ravyz-green/50 bg-gradient-to-br from-blue-700/50 via-blue-800/50 to-blue-900/50 cursor-wait' 
                  : 'border-transparent hover:border-white/20 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900'
              }`}
              style={{ height: '680px' }}
            >

              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700/95 via-blue-800/95 to-blue-900/95 group-hover:from-blue-700 group-hover:via-blue-800 group-hover:to-blue-900 transition-all duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <TrendingUp className="w-8 h-8 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute bottom-6 left-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Users className="w-6 h-6 text-white animate-bounce" style={{ animationDelay: '1.5s' }} />
              </div>

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-12">
                {/* Top Section */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Icon */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                    <UserPlus className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  
                  {/* Main CTA */}
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300 text-center">
                    BUSCO TALENTOS
                  </h2>
                  
                  <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed text-center max-w-sm">
                    Encontre candidatos ideais com match inteligente e rápido. Elimine o turnover
                  </p>
                  
                  {/* Benefits */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">1</span>
                      </div>
                      <span className="text-left leading-relaxed">Banco de talentos pré-qualificados</span>
                    </div>
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">2</span>
                      </div>
                      <span className="text-left leading-relaxed">Pipeline inteligente de candidatos</span>
                    </div>
                    <div className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-white">3</span>
                      </div>
                      <span className="text-left leading-relaxed">Redução drástica no tempo de contratação</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section */}
                <div className="flex flex-col items-center">
                  {/* Action Button */}
                  <div 
                    className={`rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 font-bold ${
                      isNavigating
                        ? 'bg-ravyz-green text-white'
                        : 'bg-white text-blue-800 group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-ravyz-green group-hover:text-white group-hover:scale-105'
                    }`}
                    style={{ width: '280px', height: '60px', fontSize: '18px' }}
                  >
                    <span>
                      {isNavigating ? 'CARREGANDO...' : 'CLIQUE PARA COMEÇAR'}
                    </span>
                    {isNavigating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 pt-4 border-t border-white/20 w-full text-center" style={{ height: '60px' }}>
                    <div className="text-sm opacity-80">
                      <span className="font-semibold">500+</span> empresas ativas • 
                      <span className="font-semibold"> 65%</span> redução no tempo
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>





          {/* Instruções de Navegação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 max-w-md mx-auto">
              <span className="inline-flex items-center gap-2 bg-ravyz-orange/10 text-ravyz-orange px-3 py-1 rounded-full text-sm font-medium">
                <Target className="w-4 h-4" />
                Navegação Rápida
              </span>
            </p>
            <p className="text-gray-600 max-w-md mx-auto mt-2">
              Clique diretamente no perfil para começar sua jornada no RAVYZ
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mb-12"
          >
            <p className="text-gray-500 mb-6">
              Mais de 10.000 conexões realizadas com sucesso
            </p>
            <div className="flex justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ravyz-green rounded-full animate-pulse"></div>
                <span className="text-sm">95% Match Accuracy</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ravyz-orange rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-sm">IA Avançada</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ravyz-purple rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm">Resultados em 72h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="border-t border-gray-100 bg-gray-50/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tecnologia que funciona
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma combina inteligência artificial, análise comportamental 
              e dados para criar conexões perfeitas.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ravyz-purple/20 transition-colors duration-300">
                <BarChart3 className="w-8 h-8 text-ravyz-purple" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Análise Inteligente</h3>
              <p className="text-gray-600">IA avançada para análise de perfis e compatibilidade</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ravyz-orange/20 transition-colors duration-300">
                <Target className="w-8 h-8 text-ravyz-orange" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Match Preciso</h3>
              <p className="text-gray-600">Algoritmos que encontram conexões perfeitas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ravyz-blue/20 transition-colors duration-300">
                <Zap className="w-8 h-8 text-ravyz-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processo Rápido</h3>
              <p className="text-gray-600">Redução significativa no tempo de contratação</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-ravyz-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ravyz-green/20 transition-colors duration-300">
                <Globe className="w-8 h-8 text-ravyz-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Escala Global</h3>
              <p className="text-gray-600">Conectando talentos em todo o Brasil</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ao continuar, você concorda com nossos{" "}
              <button className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium">
                Termos de Uso
              </button>{" "}
              e{" "}
              <button className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium">
                Política de Privacidade
              </button>
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 RAVYZ. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}