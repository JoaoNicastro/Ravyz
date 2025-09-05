import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Linkedin, User, Mail, Phone, Lock, CreditCard, ArrowRight, Upload, FileText } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
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
  linkedinData?: {
    profileUrl: string;
    headline: string;
    profilePhoto: string;
    name: string;
    experience: any[];
    education: any[];
    skills: string[];
  };
  resumeUploaded: boolean;
  resumeData?: {
    fileName: string;
    fileSize: string;
    extractedData: {
      name: string;
      email: string;
      phone: string;
      headline: string;
      experience: any[];
      education: any[];
      skills: string[];
    };
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
    linkedinConnected: false,
    resumeUploaded: false
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
    console.log("🔍 UserRegistration - Validando Step 1:");
    console.log("- name:", userData.name.trim() ? "✅" : "❌", userData.name);
    console.log("- cpf:", userData.cpf && validateCPF(userData.cpf) ? "✅" : "❌", userData.cpf);
    console.log("- phone:", userData.phone && validatePhone(userData.phone) ? "✅" : "❌", userData.phone);
    console.log("- email:", userData.email && validateEmail(userData.email) ? "✅" : "❌", userData.email);
    console.log("- password:", userData.password && validatePassword(userData.password) ? "✅" : "❌", userData.password.length > 0);
    console.log("- confirmPassword match:", userData.password === userData.confirmPassword ? "✅" : "❌");
    console.log("- acceptTerms:", userData.acceptTerms ? "✅" : "❌", userData.acceptTerms);
    
    const isValid = !!(
      userData.name.trim() &&
      userData.cpf && validateCPF(userData.cpf) &&
      userData.phone && validatePhone(userData.phone) &&
      userData.email && validateEmail(userData.email) &&
      userData.password && validatePassword(userData.password) &&
      userData.password === userData.confirmPassword &&
      userData.acceptTerms
    );
    
    console.log("🎯 UserRegistration - Step 1 válido:", isValid ? "✅" : "❌");
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
    console.log("🚀 UserRegistration - handleNext chamado, step:", currentStep);
    console.log("🔍 UserRegistration - isStep1Valid:", isStep1Valid);
    
    if (currentStep === 1) {
      console.log("📝 UserRegistration - Validando Step 1...");
      if (validateStep1()) {
        console.log("✅ UserRegistration - Step 1 válido, indo para Step 2");
        setCurrentStep(2);
      } else {
        console.log("❌ UserRegistration - Step 1 inválido, permanecendo");
      }
    } else if (currentStep === 2) {
      if (!verificationSent) {
        console.log("📧 UserRegistration - Enviando verificação...");
        await sendVerification();
      } else if (verificationCode.length === 6) {
        console.log("✅ UserRegistration - Código verificado, indo para Step 3");
        setCurrentStep(3);
      } else {
        console.log("❌ UserRegistration - Código incompleto");
      }
    } else if (currentStep === 3) {
      console.log("🎉 UserRegistration - Finalizando cadastro...");
      onComplete(userData);
    }
  }, [currentStep, validateStep1, verificationSent, verificationCode, userData, onComplete, sendVerification, isStep1Valid]);

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

  const handleLinkedInConnect = useCallback(async () => {
    // Simular conexão com LinkedIn
    const linkedinData = {
      profileUrl: 'https://linkedin.com/in/brenoCalazans',
      headline: 'Product Manager & Growth Specialist',
      profilePhoto: 'https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwfHwxNzU2NTk3MTc1fDA&ixlib=rb-4.1.0&q=80&w=400',
      name: 'Breno Calazans',
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

    // Auto-preencher nome se estiver vazio ou for o padrão
    if (!userData.name.trim() || userData.name === 'Breno Calazans') {
      updateUserData('name', linkedinData.name);
    }

    updateUserData('linkedinConnected', true);
    updateUserData('linkedinData', linkedinData);
  }, [updateUserData, userData.name]);

  const handleResumeUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular processamento do currículo
      const resumeData = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        extractedData: {
          name: 'Breno Calazans',
          email: 'breno.calazans@email.com',
          phone: '(11) 98765-4321',
          headline: 'Product Manager & Growth Specialist',
          experience: [
            {
              company: 'TechCorp',
              position: 'Senior Product Manager',
              duration: '2022 - Presente',
              description: 'Liderança de produtos digitais e estratégia de crescimento'
            },
            {
              company: 'StartupXYZ',
              position: 'Product Owner',
              duration: '2020 - 2022',
              description: 'Desenvolvimento de produtos e metodologias ágeis'
            }
          ],
          education: [
            {
              school: 'Universidade de São Paulo',
              degree: 'Bacharelado em Administração',
              year: '2020'
            }
          ],
          skills: ['Product Management', 'Growth Hacking', 'Data Analysis', 'Agile', 'UX Design', 'SQL', 'Python']
        }
      };

      // Auto preencher campos básicos se estiverem vazios
      if (!userData.name.trim() || userData.name === 'Breno Calazans') {
        updateUserData('name', resumeData.extractedData.name);
      }
      if (!userData.email.trim() || userData.email === 'breno@example.com') {
        updateUserData('email', resumeData.extractedData.email);
      }
      if (!userData.phone.trim()) {
        updateUserData('phone', resumeData.extractedData.phone);
      }

      updateUserData('resumeUploaded', true);
      updateUserData('resumeData', resumeData);
    }
  }, [updateUserData, userData.name, userData.email, userData.phone]);

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

        {/* Import Options */}
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-4">Acelere seu cadastro importando seus dados</p>
          </div>

          {/* LinkedIn Connection */}
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

          {/* Resume Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-ravyz-orange flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900">Upload de Currículo</p>
                <p className="text-sm text-gray-600">Extraia dados do seu CV (PDF, DOC, DOCX)</p>
              </div>
            </div>
            {userData.resumeUploaded ? (
              <div className="flex items-center gap-2 text-ravyz-green">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Processado</span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="resume-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-ravyz-orange text-ravyz-orange hover:bg-ravyz-orange/5 w-full sm:w-auto pointer-events-none"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar
                </Button>
              </div>
            )}
          </div>

          {/* Import Status */}
          {(userData.linkedinConnected || userData.resumeUploaded) && (
            <div className="text-center">
              <p className="text-sm text-ravyz-green">
                ✓ Dados importados! Alguns campos foram preenchidos automaticamente.
              </p>
            </div>
          )}
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
                className="inline-flex items-center gap-1 text-ravyz-orange hover:text-ravyz-orange/80 font-medium 
                         hover:bg-ravyz-orange/5 rounded-md px-2 py-0.5 -mx-1 transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-ravyz-orange/30 focus:bg-ravyz-orange/10"
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
                className="inline-flex items-center gap-1 text-ravyz-orange hover:text-ravyz-orange/80 font-medium 
                         hover:bg-ravyz-orange/5 rounded-md px-2 py-0.5 -mx-1 transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-ravyz-orange/30 focus:bg-ravyz-orange/10"
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

          {/* Summary Info */}
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
            {userData.resumeUploaded && (
              <div>
                <span className="text-gray-500">Currículo:</span>
                <p className="text-ravyz-green font-medium">Processado</p>
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

  // Função para obter o texto do botão baseado no step atual
  const getNextButtonText = () => {
    if (currentStep === 1) {
      return 'Próximo';
    } else if (currentStep === 2) {
      if (!verificationSent) {
        return isVerifying ? 'Enviando...' : 'Enviar Código';
      } else {
        return 'Verificar';
      }
    } else {
      return 'Finalizar';
    }
  };

  // Função para obter o estado de loading baseado no step atual
  const getIsLoading = () => {
    if (currentStep === 2 && !verificationSent) {
      return isVerifying;
    }
    return false;
  };

  // Função para verificar se o botão deve estar habilitado
  const getIsButtonEnabled = () => {
    if (currentStep === 1) {
      return isStep1Valid;
    } else if (currentStep === 2) {
      return isStep2Valid;
    } else {
      return true;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header com logo e progresso */}
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
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-ravyz-orange' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {currentStep}/3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Steps */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

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
            {/* Debug info para o botão */}
            {currentStep === 1 && !isStep1Valid && (
              <div className="text-xs text-gray-500 text-right">
                <p>Complete todos os campos obrigatórios</p>
                <p>para habilitar o botão "Próximo"</p>
              </div>
            )}
            
            <button
              onClick={handleNext}
              disabled={!getIsButtonEnabled() || getIsLoading()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                getIsButtonEnabled() && !getIsLoading()
                  ? 'bg-ravyz-orange text-white hover:bg-ravyz-orange/90 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{getNextButtonText()}</span>
              {getIsLoading() ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : currentStep < 3 ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div> mb-4">
            <UserAvatar userData={userData} size="lg" />
            <div>
              <h3 className="font-semibold text-gray-900">Suas informações</h3>
              {userData.linkedinConnected && (
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <Linkedin className="w-3 h-3" />
                  Conectado via LinkedIn
                </p>
              )}
            </div>
          </div>
          
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
            {userData.resumeUploaded && (
              <div className="flex justify-between">
                <span className="text-gray-600">Currículo:</span>
                <span className="font-medium text-ravyz-green">✓ Processado</span>
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

        {/* Resume Data Preview */}
        {userData.resumeUploaded && userData.resumeData && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-ravyz-orange" />
              <h4 className="font-semibold text-orange-900">Dados extraídos do currículo</h4>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-orange-700 font-medium">Arquivo:</span>
                <span className="text-orange-800">{userData.resumeData.fileName} ({userData.resumeData.fileSize})</span>
              </div>
              
              <div>
                <span className="text-orange-700 font-medium">Cargo atual:</span>
                <p className="text-orange-800">{userData.resumeData.extractedData.headline}</p>
              </div>
              
              <div>
                <span className="text-orange-700 font-medium">Experiência:</span>
                <p className="text-orange-800">{userData.resumeData.extractedData.experience.length} cargo(s) encontrado(s)</p>
              </div>
              
              <div>
                <span className="text-orange-700 font-medium">Habilidades:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userData.resumeData.extractedData.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-md">
                      {skill}
                    </span>
                  ))}
                  {userData.resumeData.extractedData.skills.length > 4 && (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-md">
                      +{userData.resumeData.extractedData.skills.length - 4} mais
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