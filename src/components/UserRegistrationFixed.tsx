import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Linkedin, User, Mail, Phone, Lock, CreditCard, ArrowRight, Upload, FileText } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { UserAvatar } from "./UserAvatar";

interface UserRegistrationData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  linkedinConnected: boolean;
  linkedinData?: any;
  resumeUploaded: boolean;
  resumeData?: any;
}

interface UserRegistrationProps {
  onComplete: (userData: UserRegistrationData) => void;
  onBack: () => void;
}

export function UserRegistrationFixed({ onComplete, onBack }: UserRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  
  const [userData, setUserData] = useState<UserRegistrationData>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    linkedinConnected: false,
    resumeUploaded: false
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});

  // Validações
  const validateCPF = useCallback((cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 8;
  }, []);

  // Formatação
  const formatCPF = useCallback((value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  }, []);

  const formatPhone = useCallback((value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }, []);

  const updateUserData = useCallback((field: keyof UserRegistrationData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando o usuário começa a digitar
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Validação do Step 1
  const isStep1Valid = useMemo(() => {
    const isValid = !!(
      userData.name.trim() &&
      userData.cpf && validateCPF(userData.cpf) &&
      userData.phone && validatePhone(userData.phone) &&
      userData.email && validateEmail(userData.email) &&
      userData.password && validatePassword(userData.password) &&
      userData.password === userData.confirmPassword &&
      userData.acceptTerms
    );
    
    return isValid;
  }, [
    userData.name,
    userData.cpf,
    userData.phone,
    userData.email,
    userData.password,
    userData.confirmPassword,
    userData.acceptTerms,
    validateCPF,
    validatePhone,
    validateEmail,
    validatePassword
  ]);

  const validateStep1 = useCallback((): boolean => {
    const newErrors: Partial<UserRegistrationData> = {};

    if (!userData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!userData.cpf || !validateCPF(userData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!userData.phone || !validatePhone(userData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!userData.email || !validateEmail(userData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!userData.password || !validatePassword(userData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!userData.acceptTerms) {
      newErrors.acceptTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    userData.name,
    userData.cpf,
    userData.phone,
    userData.email,
    userData.password,
    userData.confirmPassword,
    userData.acceptTerms,
    validateCPF,
    validatePhone,
    validateEmail,
    validatePassword
  ]);

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      onComplete(userData);
    }
  }, [currentStep, validateStep1, userData, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, onBack]);

  const handleLinkedInConnect = useCallback(async () => {
    const linkedinData = {
      profileUrl: 'https://linkedin.com/in/brenoCalazans',
      headline: 'Product Manager & Growth Specialist',
      profilePhoto: 'https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwfHwxNzU2NTk3MTc1fDA&ixlib=rb-4.1.0&q=80&w=400',
      name: 'Breno Calazans',
    };

    if (!userData.name.trim()) {
      updateUserData('name', linkedinData.name);
    }

    updateUserData('linkedinConnected', true);
    updateUserData('linkedinData', linkedinData);
  }, [updateUserData, userData.name]);

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-ravyz-purple" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar sua conta</h2>
        <p className="text-gray-600">
          Preencha suas informações para começar sua jornada no RAVYZ
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Nome */}
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Nome completo *
          </Label>
          <div className="relative">
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => updateUserData('name', e.target.value)}
              placeholder="Ex: João Silva Santos"
              className={`mt-2 pr-10 ${
                errors.name 
                  ? 'border-red-500' 
                  : userData.name.trim() 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.name.trim() && !errors.name && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2 mt-1" />
            )}
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <Label htmlFor="cpf" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            CPF *
          </Label>
          <div className="relative">
            <Input
              id="cpf"
              value={userData.cpf}
              onChange={(e) => updateUserData('cpf', formatCPF(e.target.value))}
              placeholder="123.456.789-10"
              className={`mt-2 pr-10 ${
                errors.cpf 
                  ? 'border-red-500' 
                  : userData.cpf && validateCPF(userData.cpf) 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.cpf && validateCPF(userData.cpf) && !errors.cpf && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2 mt-1" />
            )}
          </div>
          {errors.cpf && (
            <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Telefone *
          </Label>
          <div className="relative">
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => updateUserData('phone', formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className={`mt-2 pr-10 ${
                errors.phone 
                  ? 'border-red-500' 
                  : userData.phone && validatePhone(userData.phone) 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.phone && validatePhone(userData.phone) && !errors.phone && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2 mt-1" />
            )}
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            E-mail *
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => updateUserData('email', e.target.value)}
              placeholder="seuemail@exemplo.com"
              className={`mt-2 pr-10 ${
                errors.email 
                  ? 'border-red-500' 
                  : userData.email && validateEmail(userData.email) 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.email && validateEmail(userData.email) && !errors.email && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-3 top-1/2 -translate-y-1/2 mt-1" />
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Senha */}
        <div>
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Senha *
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={userData.password}
              onChange={(e) => updateUserData('password', e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className={`pr-16 ${
                errors.password 
                  ? 'border-red-500' 
                  : userData.password && validatePassword(userData.password) 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.password && validatePassword(userData.password) && !errors.password && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-10 top-1/2 -translate-y-1/2" />
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmar Senha */}
        <div>
          <Label htmlFor="confirmPassword">Confirmar senha *</Label>
          <div className="relative mt-2">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={userData.confirmPassword}
              onChange={(e) => updateUserData('confirmPassword', e.target.value)}
              placeholder="Digite a senha novamente"
              className={`pr-16 ${
                errors.confirmPassword 
                  ? 'border-red-500' 
                  : userData.confirmPassword && userData.password === userData.confirmPassword && userData.password 
                    ? 'border-ravyz-green/50' 
                    : ''
              }`}
            />
            {userData.confirmPassword && userData.password === userData.confirmPassword && userData.password && !errors.confirmPassword && (
              <Check className="w-4 h-4 text-ravyz-green absolute right-10 top-1/2 -translate-y-1/2" />
            )}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* LinkedIn Connection */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900">Conectar LinkedIn</p>
                <p className="text-sm text-gray-600">Importe seus dados automaticamente</p>
              </div>
            </div>
            {userData.linkedinConnected ? (
              <div className="flex items-center gap-2 text-ravyz-green">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLinkedInConnect}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                Conectar
              </Button>
            )}
          </div>
        </div>

        {/* Termos */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={userData.acceptTerms}
              onCheckedChange={(checked) => updateUserData('acceptTerms', checked)}
              className={`mt-0.5 ${errors.acceptTerms ? 'border-red-500' : ''}`}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Aceito os{" "}
              <button 
                type="button" 
                className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium"
                onClick={() => alert('Termos de Uso - Em breve implementaremos a visualização completa')}
              >
                Termos de Uso
              </button>{" "}
              e a{" "}
              <button 
                type="button" 
                className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium"
                onClick={() => alert('Política de Privacidade - Em breve implementaremos a visualização completa')}
              >
                Política de Privacidade
              </button>
            </Label>
          </div>
          {errors.acceptTerms && (
            <div className="flex items-start gap-2 ml-7">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-500 text-sm">Você deve aceitar os termos para continuar</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-ravyz-orange" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta criada com sucesso!</h2>
        <p className="text-gray-600">
          Bem-vindo ao RAVYZ, {userData.name.split(' ')[0]}! Sua conta foi criada e está pronta para uso.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <UserAvatar
              name={userData.name}
              linkedinConnected={userData.linkedinConnected}
              profilePhoto={userData.linkedinData?.profilePhoto}
              className="w-12 h-12"
            />
            <div>
              <h3 className="font-medium text-gray-900">{userData.name}</h3>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">CPF:</span>
              <p className="font-medium">{userData.cpf}</p>
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span>
              <p className="font-medium">{userData.phone}</p>
            </div>
            {userData.linkedinConnected && (
              <div>
                <span className="text-gray-500">LinkedIn:</span>
                <p className="text-blue-600 font-medium">Conectado</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Parabéns! Sua conta foi criada com sucesso.
          </p>
          <p className="text-sm text-gray-500">
            Você será redirecionado para criar seu mentor personalizado.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            
            <RavyzLogo className="h-8" />
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-ravyz-orange' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {currentStep}/2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Status do botão com progresso */}
            {currentStep === 1 && !isStep1Valid && (
              <div className="text-xs text-gray-500 text-right space-y-1">
                <p>Complete todos os campos obrigatórios</p>
                <p>para habilitar o botão "Próximo"</p>
                <div className="w-32 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-ravyz-orange h-1.5 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.round(
                        (
                          (userData.name.trim() ? 1 : 0) +
                          (userData.cpf && validateCPF(userData.cpf) ? 1 : 0) +
                          (userData.phone && validatePhone(userData.phone) ? 1 : 0) +
                          (userData.email && validateEmail(userData.email) ? 1 : 0) +
                          (userData.password && validatePassword(userData.password) ? 1 : 0) +
                          (userData.password === userData.confirmPassword && userData.password ? 1 : 0) +
                          (userData.acceptTerms ? 1 : 0)
                        ) / 7 * 100
                      )}%` 
                    }}
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !isStep1Valid}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                (currentStep === 2 || isStep1Valid)
                  ? 'bg-ravyz-orange text-white hover:bg-ravyz-orange/90 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === 1 ? 'Próximo' : 'Finalizar'}</span>
              {currentStep === 1 ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}