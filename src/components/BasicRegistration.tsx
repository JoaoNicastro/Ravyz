import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RavyzLogo } from "./RavyzLogo";

interface BasicRegistrationProps {
  userType: 'candidate' | 'company';
  onComplete: (data: BasicRegistrationData) => void;
  onBack: () => void;
}

interface BasicRegistrationData {
  email: string;
  password: string;
  document: string; // CPF ou CNPJ
  userType: 'candidate' | 'company';
}

interface ValidationState {
  email: { isValid: boolean; message: string };
  password: { isValid: boolean; message: string };
  document: { isValid: boolean; message: string };
}

export function BasicRegistration({ userType, onComplete, onBack }: BasicRegistrationProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    document: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    document: { isValid: false, message: '' }
  });

  // Cores baseadas no tipo de usuário
  const colors = {
    candidate: {
      primary: 'text-ravyz-purple',
      bg: 'bg-ravyz-purple',
      border: 'border-ravyz-purple',
      focus: 'focus:border-ravyz-purple focus:ring-ravyz-purple'
    },
    company: {
      primary: 'text-ravyz-blue',
      bg: 'bg-ravyz-blue',
      border: 'border-ravyz-blue',
      focus: 'focus:border-ravyz-blue focus:ring-ravyz-blue'
    }
  };

  const currentColors = colors[userType];

  // Validações
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, message: 'Email é obrigatório' };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Email inválido' };
    }
    return { isValid: true, message: 'Email válido' };
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return { isValid: false, message: 'Senha é obrigatória' };
    }
    if (password.length < 6) {
      return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Senha deve conter maiúscula, minúscula e número' };
    }
    return { isValid: true, message: 'Senha forte' };
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      return { isValid: false, message: 'CPF deve ter 11 dígitos' };
    }
    
    // Verificação básica de CPF (algoritmo simplificado)
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return { isValid: false, message: 'CPF inválido' };
    }
    
    return { isValid: true, message: 'CPF válido' };
  };

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) {
      return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
    }
    
    // Verificação básica de CNPJ
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
      return { isValid: false, message: 'CNPJ inválido' };
    }
    
    return { isValid: true, message: 'CNPJ válido' };
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let processedValue = value;
    
    // Formatação para documento
    if (field === 'document') {
      processedValue = userType === 'candidate' ? formatCPF(value) : formatCNPJ(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Validação em tempo real
    let validationResult;
    switch (field) {
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'document':
        validationResult = userType === 'candidate' 
          ? validateCPF(value) 
          : validateCNPJ(value);
        break;
      default:
        return;
    }

    setValidation(prev => ({
      ...prev,
      [field]: validationResult
    }));
  };

  const isFormValid = () => {
    return validation.email.isValid && 
           validation.password.isValid && 
           validation.document.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid()) {
      const registrationData: BasicRegistrationData = {
        ...formData,
        document: formData.document.replace(/\D/g, ''), // Remove formatação
        userType
      };
      
      onComplete(registrationData);
    }
  };

  const getDocumentLabel = () => {
    return userType === 'candidate' ? 'CPF' : 'CNPJ';
  };

  const getDocumentPlaceholder = () => {
    return userType === 'candidate' ? '000.000.000-00' : '00.000.000/0001-00';
  };

  const getUserTypeLabel = () => {
    return userType === 'candidate' ? 'Candidato' : 'Empresa';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <RavyzLogo className="mx-auto mb-6" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${currentColors.bg}`} />
            <h1 className={`${currentColors.primary}`}>
              Cadastro {getUserTypeLabel()}
            </h1>
          </div>
          <p className="text-gray-600">
            Preencha seus dados básicos para continuar
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-gray-800">
              Informações Básicas
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pr-10 ${
                      formData.email 
                        ? validation.email.isValid 
                          ? 'border-green-500 focus:border-green-500' 
                          : 'border-red-500 focus:border-red-500'
                        : currentColors.focus
                    }`}
                  />
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validation.email.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {formData.email && (
                  <p className={`text-sm ${
                    validation.email.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validation.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pr-20 ${
                      formData.password 
                        ? validation.password.isValid 
                          ? 'border-green-500 focus:border-green-500' 
                          : 'border-red-500 focus:border-red-500'
                        : currentColors.focus
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {formData.password && (
                      <>
                        {validation.password.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {formData.password && (
                  <p className={`text-sm ${
                    validation.password.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validation.password.message}
                  </p>
                )}
              </div>

              {/* CPF/CNPJ */}
              <div className="space-y-2">
                <Label htmlFor="document" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {getDocumentLabel()}
                </Label>
                <div className="relative">
                  <Input
                    id="document"
                    placeholder={getDocumentPlaceholder()}
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    className={`pr-10 ${
                      formData.document 
                        ? validation.document.isValid 
                          ? 'border-green-500 focus:border-green-500' 
                          : 'border-red-500 focus:border-red-500'
                        : currentColors.focus
                    }`}
                  />
                  {formData.document && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validation.document.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {formData.document && (
                  <p className={`text-sm ${
                    validation.document.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validation.document.message}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <Button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`flex-1 ${currentColors.bg} hover:opacity-90 disabled:opacity-50`}
                >
                  Continuar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informação de segurança */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Seus dados estão seguros e protegidos
          </p>
        </div>
      </motion.div>
    </div>
  );
}