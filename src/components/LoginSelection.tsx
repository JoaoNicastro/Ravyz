import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, LogIn, UserPlus, Mail, Lock, User, Building2 } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LoginSelectionProps {
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  onBack: () => void;
}

export function LoginSelection({ onSelectLogin, onSelectRegister, onBack }: LoginSelectionProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ravyz-orange/5 via-white to-ravyz-purple/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <RavyzLogo size="sm" variant="compact" />
          </div>
          
          <div className="text-sm text-gray-600">
            Bem-vindo ao RAVYZ
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-8">
            <div className="text-4xl">👋</div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo de volta!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha como deseja continuar sua jornada no RAVYZ
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Já tenho conta */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onHoverStart={() => setHoveredOption('login')}
            onHoverEnd={() => setHoveredOption(null)}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all duration-300 border-2 h-full ${
                hoveredOption === 'login' 
                  ? 'border-ravyz-orange/30 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-ravyz-orange/20 hover:shadow-md'
              }`}
              onClick={onSelectLogin}
            >
              <div className="text-center space-y-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  hoveredOption === 'login' 
                    ? 'bg-ravyz-orange text-white' 
                    : 'bg-ravyz-orange/10 text-ravyz-orange'
                }`}>
                  <LogIn className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Já tenho conta
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Acesse sua conta existente e continue de onde parou
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-ravyz-orange" />
                    <span>Login com email</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Lock className="w-4 h-4 text-ravyz-orange" />
                    <span>Acesso seguro</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <User className="w-4 h-4 text-ravyz-orange" />
                    <span>Dados salvos</span>
                  </div>
                </div>

                <Button 
                  className={`w-full transition-all duration-300 ${
                    hoveredOption === 'login'
                      ? 'bg-ravyz-orange hover:bg-ravyz-orange/90'
                      : 'bg-ravyz-orange/10 text-ravyz-orange hover:bg-ravyz-orange hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Fazer Login
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Criar conta */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onHoverStart={() => setHoveredOption('register')}
            onHoverEnd={() => setHoveredOption(null)}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all duration-300 border-2 h-full ${
                hoveredOption === 'register' 
                  ? 'border-ravyz-purple/30 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-ravyz-purple/20 hover:shadow-md'
              }`}
              onClick={onSelectRegister}
            >
              <div className="text-center space-y-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  hoveredOption === 'register' 
                    ? 'bg-ravyz-purple text-white' 
                    : 'bg-ravyz-purple/10 text-ravyz-purple'
                }`}>
                  <UserPlus className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Criar conta
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Primeira vez aqui? Crie sua conta e descubra seu trabalho ideal
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <User className="w-4 h-4 text-ravyz-purple" />
                    <span>Perfil personalizado</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Building2 className="w-4 h-4 text-ravyz-purple" />
                    <span>Matching inteligente</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-ravyz-purple" />
                    <span>Cadastro rápido</span>
                  </div>
                </div>

                <Button 
                  className={`w-full transition-all duration-300 ${
                    hoveredOption === 'register'
                      ? 'bg-ravyz-purple hover:bg-ravyz-purple/90'
                      : 'bg-ravyz-purple/10 text-ravyz-purple hover:bg-ravyz-purple hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Ao continuar, você concorda com nossos{" "}
            <button className="text-ravyz-orange hover:underline">
              Termos de Uso
            </button>{" "}
            e{" "}
            <button className="text-ravyz-orange hover:underline">
              Política de Privacidade
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}