import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Building2, AlertCircle } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
  onBack: () => void;
}

// Simulação de usuários cadastrados para demonstração
const mockUsers = [
  {
    id: 0,
    email: "demo",
    password: "demo",
    profileType: "candidate",
    name: "Usuário Demo",
    profilePhoto: null,
    mentor: {
      name: "Alex",
      category: "Mentor",
      avatar: "🎯",
      color: "ravyz-orange",
      personality: "Inteligente, estratégico e focado"
    },
    dreamJob: {
      position: "Product Manager",
      positionLevel: "Sênior",
      industry: ["Tecnologia"],
      salaryRange: { min: 15000, max: 20000 }
    },
    matching: {
      currentJob: {
        currentPosition: "Product Manager",
        currentLevel: "Pleno",
        currentIndustry: "Fintech",
        currentCompany: "TechCorp",
        currentSalary: 12000
      }
    }
  },
  {
    id: 1,
    email: "ana.silva@email.com",
    password: "123456",
    profileType: "candidate",
    name: "Ana Silva",
    profilePhoto: null,
    mentor: {
      name: "Sofia",
      category: "Mentor",
      avatar: "🤝",
      color: "ravyz-blue",
      personality: "Próximo, empático e orientador"
    },
    dreamJob: {
      position: "Product Manager",
      positionLevel: "Sênior",
      industry: ["Tecnologia"],
      salaryRange: { min: 12000, max: 18000 }
    },
    matching: {
      currentJob: {
        currentPosition: "Product Manager",
        currentLevel: "Pleno",
        currentIndustry: "Fintech",
        currentCompany: "Stone",
        currentSalary: 10000
      }
    }
  },
  {
    id: 2,
    email: "demo.empresa",
    password: "demo",
    profileType: "company",
    name: "Empresa Demo",
    companyName: "TechCorp Demo",
    profilePhoto: null,
    mentor: {
      name: "Alexandre",
      category: "Mestre",
      avatar: "🧙‍♂️",
      color: "ravyz-blue",
      personality: "Sábio, experiente e visionário"
    }
  },
  {
    id: 3,
    email: "carlos.tech@empresa.com",
    password: "123456",
    profileType: "company",
    name: "Carlos Santos",
    companyName: "TechCorp",
    profilePhoto: null,
    mentor: {
      name: "Alexandre",
      category: "Mestre",
      avatar: "🧙‍♂️",
      color: "ravyz-purple",
      personality: "Sábio, experiente e visionário"
    }
  },
  {
    id: 4,
    email: "maria.dev@gmail.com",
    password: "123456",
    profileType: "candidate",
    name: "Maria Oliveira",
    profilePhoto: null,
    mentor: {
      name: "Luna",
      category: "Guru",
      avatar: "🧘‍♀️",
      color: "ravyz-orange",
      personality: "Inovador, inspirador e transformador"
    },
    dreamJob: {
      position: "Software Engineer",
      positionLevel: "Sênior",
      industry: ["Tecnologia"],
      salaryRange: { min: 15000, max: 22000 }
    }
  }
];

export function Login({ onLoginSuccess, onBack }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemo, setSelectedDemo] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se existe usuário com email e senha
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      console.log("Login realizado com sucesso:", user);
      onLoginSuccess(user);
    } else {
      setError("Email ou senha incorretos");
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (user: any) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedDemo(user);
  };

  const handleQuickLogin = (user: any) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 500);
  };

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
            Fazer Login
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-ravyz-orange" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Entrar na sua conta
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta! Entre com seus dados
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-ravyz-orange hover:bg-ravyz-orange/90"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button className="text-sm text-ravyz-orange hover:underline">
                Esqueci minha senha
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Demo Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4 text-center">
              🚀 Testar com usuários demo
            </h3>
            
            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer relative ${
                    selectedDemo?.id === user.id
                      ? 'border-ravyz-orange bg-ravyz-orange/5'
                      : user.email === 'demo' || user.email === 'demo.empresa'
                      ? 'border-ravyz-green bg-ravyz-green/5 hover:border-ravyz-green/70'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {(user.email === 'demo' || user.email === 'demo.empresa') && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-ravyz-green text-white text-xs px-2 py-1 rounded-full">
                        ⭐ Recomendado
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.profileType === 'candidate' 
                          ? 'bg-ravyz-purple/10 text-ravyz-purple' 
                          : 'bg-ravyz-blue/10 text-ravyz-blue'
                      }`}>
                        {user.profileType === 'candidate' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemoLogin(user)}
                      >
                        Preencher
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleQuickLogin(user)}
                        className={`${
                          user.profileType === 'candidate' 
                            ? 'bg-ravyz-purple hover:bg-ravyz-purple/90' 
                            : 'bg-ravyz-blue hover:bg-ravyz-blue/90'
                        }`}
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  💡 Use os usuários demo para testar diferentes perfis e funcionalidades
                </p>
              </div>
              <div className="p-3 bg-ravyz-green/10 border border-ravyz-green/20 rounded-lg">
                <p className="text-xs text-ravyz-green text-center font-medium">
                  ⚡ Credenciais rápidas: <span className="font-mono bg-white px-1 rounded">demo / demo</span> (candidato) | <span className="font-mono bg-white px-1 rounded">demo.empresa / demo</span> (empresa)
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <button 
              onClick={onBack}
              className="text-ravyz-orange hover:underline font-medium"
            >
              Criar conta gratuita
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}