import { motion } from "motion/react";
import { User, Building2, ArrowRight, TrendingUp, Users, Target, Zap, BarChart3, Globe, ChevronRight, Sparkles } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";

interface ProfileSelectionProps {
  onSelectProfile: (type: 'candidate' | 'company') => void;
}

export function ProfileSelection({ onSelectProfile }: ProfileSelectionProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-ravyz-orange/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <RavyzLogo size="sm" variant="compact" className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-white/80 hover:text-white transition-colors font-medium">
                Sobre
              </button>
              <button className="text-white/80 hover:text-white transition-colors font-medium">
                Contato
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all font-medium">
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
            {/* Logo Principal Personalizado - MUITO MAIOR */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <RavyzLogo size="xl" variant="full" animated={true} className="mx-auto" />
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rise Above.
              <br />
              <span className="text-ravyz-orange">Go Beyond.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
              Conecte talentos e oportunidades com inteligência artificial. 
              Escolha como você gostaria de começar:
            </p>

            {/* Métricas de Efetividade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl lg:text-3xl font-bold text-ravyz-orange mb-2">+10k</div>
                <div className="text-sm text-gray-600">Vagas fechadas</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl lg:text-3xl font-bold text-ravyz-green mb-2">-30%</div>
                <div className="text-sm text-gray-600">Turnover</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl lg:text-3xl font-bold text-ravyz-blue mb-2">3x</div>
                <div className="text-sm text-gray-600">Mais rápido</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl lg:text-3xl font-bold text-ravyz-purple mb-2">+90%</div>
                <div className="text-sm text-gray-600">Aderência de perfil</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main CTA Buttons - PERFEITAMENTE ALINHADOS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
          >
            {/* Candidato Button - Estrutura Completamente Alinhada */}
            <motion.button
              onClick={() => onSelectProfile('candidate')}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-gradient-to-br from-ravyz-purple via-purple-600 to-purple-700 rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-transparent hover:border-white/20"
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

              {/* Content Container com Estrutura Fixa */}
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-12">
                {/* Top Section - Flex-grow para ocupar espaço disponível */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Icon */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                    <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  
                  {/* Main CTA */}
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300 text-center">
                    SOU CANDIDATO
                  </h2>
                  
                  <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed text-center max-w-sm">
                    Vagas dos sonhos, com meu perfil e fit cultural
                  </p>
                  
                  {/* Benefits - Lista Numerada */}
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
                
                {/* Bottom Section - Posição Fixa na Base */}
                <div className="flex flex-col items-center">
                  {/* Action Button - Dimensões Exatas */}
                  <div 
                    className="bg-white text-ravyz-purple rounded-2xl group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 font-bold"
                    style={{ width: '280px', height: '60px', fontSize: '18px' }}
                  >
                    <span>COMEÇAR AGORA</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Stats - Altura Fixa */}
                  <div className="mt-6 pt-4 border-t border-white/20 w-full text-center" style={{ height: '60px' }}>
                    <div className="text-sm opacity-80">
                      <span className="font-semibold">5.000+</span> candidatos ativos • 
                      <span className="font-semibold"> 89%</span> taxa de sucesso
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Empresa Button - Estrutura Idêntica */}
            <motion.button
              onClick={() => onSelectProfile('company')}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-transparent hover:border-white/20"
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

              {/* Content Container com Estrutura Idêntica */}
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-12">
                {/* Top Section - Flex-grow para ocupar espaço disponível */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Icon */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                    <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  
                  {/* Main CTA */}
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300 text-center">
                    SOU EMPRESA
                  </h2>
                  
                  <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed text-center max-w-sm">
                    Encontre os melhores candidatos com match fluído e rápido. Chega de turnover
                  </p>
                  
                  {/* Benefits - Lista Numerada */}
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
                
                {/* Bottom Section - Posição Fixa na Base */}
                <div className="flex flex-col items-center">
                  {/* Action Button - Dimensões Exatas */}
                  <div 
                    className="bg-white text-blue-800 rounded-2xl group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-ravyz-green group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 font-bold"
                    style={{ width: '280px', height: '60px', fontSize: '18px' }}
                  >
                    <span>EXPLORAR SOLUÇÕES</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Stats - Altura Fixa */}
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

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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