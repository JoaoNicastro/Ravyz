import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff, Phone, User, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface CandidateContactInfoProps {
  onComplete: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
  onBack: () => void;
  basicInfo: {
    gender: string;
    ageRange: string;
  };
}

export function CandidateContactInfo({ onComplete, onBack, basicInfo }: CandidateContactInfoProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validações simples
  const isNameValid = formData.name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = formData.phone.replace(/\D/g, '').length >= 10;
  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid = formData.password === formData.confirmPassword && formData.password.length > 0;

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substr(0, 15);
    }
    return value.substr(0, 15);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhone(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isFormValid) {
      onComplete({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-ravyz-orange rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Informações de Contato
          </h1>
          <p className="text-gray-600">
            Agora precisamos de seus dados para criar sua conta
          </p>
          
          {/* Resumo das informações básicas */}
          <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-ravyz-orange/5 rounded-lg">
            <span className="text-sm text-ravyz-orange">
              <strong>Gênero:</strong> {
                basicInfo.gender === 'masculine' ? 'Masculino' :
                basicInfo.gender === 'feminine' ? 'Feminino' : 'Indiferente'
              }
            </span>
            <span className="text-ravyz-orange">•</span>
            <span className="text-sm text-ravyz-orange">
              <strong>Idade:</strong> {
                basicInfo.ageRange === 'indifferent' ? 'Indiferente' : basicInfo.ageRange + ' anos'
              }
            </span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-ravyz-orange">
              <User className="w-5 h-5" />
              Seus Dados
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: João Silva Santos"
                  className={`pr-10 ${
                    formData.name && !isNameValid 
                      ? 'border-red-500' 
                      : isNameValid 
                        ? 'border-ravyz-green/50' 
                        : ''
                  }`}
                />
                {isNameValid && (
                  <CheckCircle className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className={`pr-10 ${
                    formData.email && !isEmailValid 
                      ? 'border-red-500' 
                      : isEmailValid 
                        ? 'border-ravyz-green/50' 
                        : ''
                  }`}
                />
                {isEmailValid && (
                  <CheckCircle className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={`pr-10 ${
                    formData.phone && !isPhoneValid 
                      ? 'border-red-500' 
                      : isPhoneValid 
                        ? 'border-ravyz-green/50' 
                        : ''
                  }`}
                />
                {isPhoneValid && (
                  <CheckCircle className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={`pr-16 ${
                    formData.password && !isPasswordValid 
                      ? 'border-red-500' 
                      : isPasswordValid 
                        ? 'border-ravyz-green/50' 
                        : ''
                  }`}
                />
                {isPasswordValid && (
                  <CheckCircle className="w-4 h-4 text-ravyz-green absolute right-10 top-1/2 -translate-y-1/2" />
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Digite a senha novamente"
                  className={`pr-16 ${
                    formData.confirmPassword && !isConfirmPasswordValid 
                      ? 'border-red-500' 
                      : isConfirmPasswordValid 
                        ? 'border-ravyz-green/50' 
                        : ''
                  }`}
                />
                {isConfirmPasswordValid && (
                  <CheckCircle className="w-4 h-4 text-ravyz-green absolute right-10 top-1/2 -translate-y-1/2" />
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isFormValid}
                className={`flex items-center gap-2 px-8 ${
                  isFormValid
                    ? "bg-ravyz-orange hover:bg-ravyz-orange/90 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Criar Conta
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Indicador de Progresso */}
            {!isFormValid && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Complete todos os campos para finalizar
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-ravyz-orange h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${[isNameValid, isEmailValid, isPhoneValid, isPasswordValid, isConfirmPasswordValid].filter(Boolean).length * 20}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}