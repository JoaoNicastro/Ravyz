import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Linkedin, User, Mail, Phone, Lock, CreditCard, ArrowRight } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";

interface UserRegistrationData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  linkedinConnected: boolean;
  linkedinData?: {
    profileUrl: string;
    headline: string;
    experience: any[];
    education: any[];
    skills: string[];
  };
}

interface UserRegistrationProps {
  onComplete: (userData: UserRegistrationData) => void;
  onBack: () => void;
}

export function UserRegistration({ onComplete, onBack }: UserRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  
  const [userData, setUserData] = useState<UserRegistrationData>({
    name: 'Breno Calazans', // Exemplo baseado no usuário
    cpf: '',
    phone: '',
    email: 'breno@example.com', // Exemplo
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    linkedinConnected: false
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});

  // Validações usando useCallback para evitar re-renders
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

  // Usar useMemo para calcular se o step 1 é válido
  const isStep1Valid = useMemo(() => {
    return !!(
      userData.name.trim() &&
      userData.cpf && validateCPF(userData.cpf) &&
      userData.phone && validatePhone(userData.phone) &&
      userData.email && validateEmail(userData.email) &&
      userData.password && validatePassword(userData.password) &&
      userData.password === userData.confirmPassword &&
      userData.acceptTerms
    );
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

  // Calcular se step 2 é válido
  const isStep2Valid = useMemo(() => {
    if (!verificationSent) {
      return true; // Sempre pode enviar verificação
    }
    return verificationCode.length === 6;
  }, [verificationSent, verificationCode]);

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

  const sendVerification = useCallback(async () => {
    setIsVerifying(true);
    
    try {
      // Simular envio de verificação
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationSent(true);
      setVerificationCode(''); // Limpar código anterior
    } catch (error) {
      console.error('Erro ao enviar verificação:', error);
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!verificationSent) {
        // Enviar verificação
        await sendVerification();
      } else if (verificationCode.length === 6) {
        // Verificar código (simulação)
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      onComplete(userData);
    }
  }, [currentStep, validateStep1, verificationSent, verificationCode, userData, onComplete, sendVerification]);

  const handlePrevious = useCallback(() => {
    if (currentStep === 1) {
      onBack();
    } else if (currentStep === 2) {
      if (verificationSent) {
        // Se já enviou verificação, voltar para escolher método
        setVerificationSent(false);
        setVerificationCode('');
      } else {
        // Voltar para step 1
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, verificationSent, onBack]);

  const handleLinkedInConnect = useCallback(() => {
    // Simular conexão com LinkedIn
    const linkedinData = {
      profileUrl: 'https://linkedin.com/in/brenoCalazans',
      headline: 'Product Manager & Growth Specialist',
      experience: [
        {
          company: 'TechCorp',
          position: 'Senior Product Manager',
          duration: '2022 - Presente'
        }
      ],
      education: [
        {
          school: 'Universidade de São Paulo',
          degree: 'Bacharelado em Administração',
          year: '2020'
        }
      ],
      skills: ['Product Management', 'Growth Hacking', 'Data Analysis', 'Agile', 'UX Design']
    };

    updateUserData('linkedinConnected', true);
    updateUserData('linkedinData', linkedinData);
  }, [updateUserData]);

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
          <Input
            id="name"
            value={userData.name}
            onChange={(e) => updateUserData('name', e.target.value)}
            placeholder="Ex: João Silva Santos"
            className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
          />
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
          <Input
            id="cpf"
            value={userData.cpf}
            onChange={(e) => updateUserData('cpf', formatCPF(e.target.value))}
            placeholder="123.456.789-10"
            className={`mt-2 ${errors.cpf ? 'border-red-500' : ''}`}
          />
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
          <Input
            id="phone"
            value={userData.phone}
            onChange={(e) => updateUserData('phone', formatPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
          />
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
          <Input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) => updateUserData('email', e.target.value)}
            placeholder="seuemail@exemplo.com"
            className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
          />
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
              className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
            />
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
              className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                className="text-ravyz-orange hover:underline focus:outline-none focus:ring-2 focus:ring-ravyz-orange/20 rounded px-1"
                onClick={() => {
                  // Abrir modal ou página dos Termos de Uso
                  alert('Termos de Uso - Em breve implementaremos a visualização completa');
                }}
              >
                Termos de Uso
              </button>{" "}
              e a{" "}
              <button 
                type="button" 
                className="text-ravyz-orange hover:underline focus:outline-none focus:ring-2 focus:ring-ravyz-orange/20 rounded px-1"
                onClick={() => {
                  // Abrir modal ou página da Política de Privacidade
                  alert('Política de Privacidade - Em breve implementaremos a visualização completa');
                }}
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
        <div className="w-16 h-16 mx-auto bg-ravyz-green/10 rounded-2xl flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-ravyz-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificar sua conta</h2>
        <p className="text-gray-600">
          {verificationSent 
            ? `Enviamos um código de 6 dígitos para ${verificationMethod === 'email' ? userData.email : userData.phone}`
            : 'Escolha como você gostaria de verificar sua conta'}
        </p>
      </div>

      {!verificationSent ? (
        <div className="max-w-md mx-auto space-y-6">
          {/* Método de verificação */}
          <div className="space-y-4">
            <Label>Como você gostaria de receber o código?</Label>
            
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                verificationMethod === 'email' 
                  ? 'border-ravyz-orange bg-ravyz-orange/5' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="verification"
                  value="email"
                  checked={verificationMethod === 'email'}
                  onChange={(e) => setVerificationMethod(e.target.value as 'email')}
                  className="text-ravyz-orange"
                />
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                verificationMethod === 'sms' 
                  ? 'border-ravyz-orange bg-ravyz-orange/5' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="verification"
                  value="sms"
                  checked={verificationMethod === 'sms'}
                  onChange={(e) => setVerificationMethod(e.target.value as 'sms')}
                  className="text-ravyz-orange"
                />
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-gray-600">{userData.phone}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          {/* Success message */}
          <div className="bg-ravyz-green/10 border border-ravyz-green/20 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-ravyz-green rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-ravyz-green font-medium">Código enviado com sucesso!</p>
            <p className="text-sm text-gray-600 mt-1">
              Verifique sua {verificationMethod === 'email' ? 'caixa de entrada' : 'mensagem de texto'}
            </p>
          </div>

          {/* Campo de código */}
          <div>
            <Label htmlFor="verification-code">Código de verificação</Label>
            <Input
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="mt-2 text-center text-xl tracking-widest font-mono"
              maxLength={6}
            />
            <p className="text-sm text-gray-500 mt-1 text-center">
              Digite o código de 6 dígitos que você recebeu
            </p>
          </div>

          <div className="text-center space-y-2">
            <button 
              type="button"
              onClick={() => {
                setVerificationSent(false);
                setVerificationCode('');
              }}
              className="text-ravyz-orange hover:underline text-sm"
            >
              Não recebeu o código? Tentar novamente
            </button>
            <p className="text-xs text-gray-500">
              Ou escolher outro método de verificação
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
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
          Bem-vindo ao RAVYZ, {userData.name.split(' ')[0]}! Sua conta foi verificada e está pronta para uso.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Dados do usuário */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Suas informações</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{userData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">E-mail:</span>
              <span className="font-medium">{userData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">{userData.phone}</span>
            </div>
            {userData.linkedinConnected && (
              <div className="flex justify-between">
                <span className="text-gray-600">LinkedIn:</span>
                <span className="font-medium text-ravyz-green">✓ Conectado</span>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn Data Preview */}
        {userData.linkedinConnected && userData.linkedinData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Dados importados do LinkedIn</h4>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Cargo atual:</span>
                <p className="text-blue-800">{userData.linkedinData.headline}</p>
              </div>
              
              <div>
                <span className="text-blue-700 font-medium">Habilidades:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userData.linkedinData.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                      {skill}
                    </span>
                  ))}
                  {userData.linkedinData.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                      +{userData.linkedinData.skills.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Próximos passos */}
        <div className="border border-ravyz-orange/20 bg-ravyz-orange/5 rounded-xl p-6">
          <h4 className="font-semibold text-ravyz-orange mb-3">Próximos passos</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-ravyz-orange rounded-full"></div>
              Complete seu perfil profissional
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-ravyz-orange rounded-full"></div>
              Defina suas preferências de vaga
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-ravyz-orange rounded-full"></div>
              Comece a receber matches inteligentes
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <RavyzLogo size="sm" variant="compact" />
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Etapa {currentStep} de 3
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-ravyz-orange h-1 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-12">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="w-full sm:w-auto sm:min-w-[120px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? 'Voltar' : verificationSent ? 'Alterar método' : 'Anterior'}
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  isVerifying
                }
                className="w-full sm:flex-1 bg-ravyz-orange hover:bg-ravyz-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : currentStep === 2 && !verificationSent ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Enviar {verificationMethod === 'email' ? 'e-mail' : 'SMS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : currentStep === 2 && verificationSent ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Verificar código</span>
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Próximo</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Final Step Button */}
          {currentStep === 3 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button
                onClick={() => onComplete(userData)}
                className="w-full bg-ravyz-orange hover:bg-ravyz-orange/90"
              >
                Continuar para o perfil profissional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
          {/* Botão de finalização */}
          {currentStep === 3 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button
                onClick={handleNext}
                className="w-full bg-ravyz-orange hover:bg-ravyz-orange/90 h-12"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Começar minha jornada no RAVYZ</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Ao continuar, você será direcionado para completar seu perfil profissional
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}