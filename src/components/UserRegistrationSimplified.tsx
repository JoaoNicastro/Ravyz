import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Linkedin, User, Mail, Phone, Lock, CreditCard, ArrowRight, Upload, FileText } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
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
  linkedinData?: any;
  resumeUploaded: boolean;
  resumeData?: any;
}

interface UserRegistrationProps {
  onComplete: (userData: UserRegistrationData) => void;
  onBack: () => void;
}

export function UserRegistrationSimplified({ onComplete, onBack }: UserRegistrationProps) {
  console.log("🏗️ UserRegistrationSimplified - Componente renderizado");
  console.log("📦 Props recebidas:", { onComplete: typeof onComplete, onBack: typeof onBack });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userData, setUserData] = useState<UserRegistrationData>({
    name: 'João Silva Santos',
    cpf: '123.456.789-10',
    phone: '(11) 99999-9999',
    email: 'joao@example.com',
    password: '12345678',
    confirmPassword: '12345678',
    acceptTerms: true,
    linkedinConnected: false,
    resumeUploaded: false
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Partial<UserRegistrationData> = {};

    if (!userData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    }

    if (!userData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!userData.acceptTerms) {
      newErrors.acceptTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log("🚀 UserRegistrationSimplified - handleSubmit chamado!");
    console.log("📋 Dados do usuário:", userData);
    console.log("🔍 Função onComplete:", onComplete);
    
    setIsSubmitting(true);
    
    try {
      console.log("✅ Chamando onComplete diretamente (sem validação para teste)");
      onComplete(userData);
      console.log("✅ onComplete executado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao chamar onComplete:", error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  const handleLinkedInConnect = useCallback(async () => {
    const linkedinData = {
      profileUrl: 'https://linkedin.com/in/joaosilva',
      headline: 'Professional Developer',
      profilePhoto: 'https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwfHwxNzU2NTk3MTc1fDA&ixlib=rb-4.1.0&q=80&w=400',
      name: 'João Silva Santos',
      experience: [
        {
          company: 'Tech Company',
          position: 'Senior Developer',
          duration: '2022 - Presente'
        }
      ],
      education: [
        {
          school: 'Universidade Federal',
          degree: 'Ciência da Computação',
          year: '2020'
        }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python']
    };

    updateUserData('linkedinConnected', true);
    updateUserData('linkedinData', linkedinData);
  }, [updateUserData]);

  const handleResumeUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const resumeData = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        extractedData: {
          name: 'João Silva Santos',
          email: 'joao.silva@email.com',
          phone: '(11) 98765-4321',
          headline: 'Senior Developer',
          experience: [
            {
              company: 'Tech Company',
              position: 'Senior Developer',
              duration: '2022 - Presente',
              description: 'Desenvolvimento de aplicações web modernas'
            }
          ],
          education: [
            {
              school: 'Universidade Federal',
              degree: 'Ciência da Computação',
              year: '2020'
            }
          ],
          skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python']
        }
      };

      updateUserData('resumeUploaded', true);
      updateUserData('resumeData', resumeData);
    }
  }, [updateUserData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-ravyz-orange/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-ravyz-purple" />
            </div>
            <h1 className="font-bold text-gray-900 mb-2">Criar sua conta</h1>
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
                CPF
              </Label>
              <Input
                id="cpf"
                value={userData.cpf}
                onChange={(e) => updateUserData('cpf', formatCPF(e.target.value))}
                placeholder="123.456.789-10"
                className="mt-2"
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => updateUserData('phone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="mt-2"
              />
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
                    className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium hover:underline"
                    onClick={() => alert('Termos de Uso - Em breve implementaremos a visualização completa')}
                  >
                    Termos de Uso
                  </button>{" "}
                  e a{" "}
                  <button 
                    type="button" 
                    className="text-ravyz-orange hover:text-ravyz-orange/80 font-medium hover:underline"
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-ravyz-purple hover:bg-ravyz-purple/90 text-white py-3 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Criando conta...' : 'Criar Conta'}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            {/* Debug Info */}
            {isSubmitting && (
              <div className="text-center text-sm text-gray-600">
                Processando... Verifique o console para logs.
              </div>
            )}
            
            {/* Botão de Teste Debug */}
            <Button
              onClick={() => {
                console.log("🧪 TESTE - Botão debug clicado!");
                onComplete(userData);
              }}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
            >
              🧪 TESTE - Pular para próxima etapa
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}