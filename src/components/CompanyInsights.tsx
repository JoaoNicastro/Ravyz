import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Star,
  Award,
  Zap,
  Eye,
  UserCheck,
  Building2,
  Play,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  MapPin,
  Briefcase,
  UserPlus,
  MessageSquare,
  Edit3,
  TrendingDown as TrendingDownIcon,
  Crown,
  Sparkles,
  Shield,
  Trophy
} from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { CompanyAttractivenessTab } from "./CompanyAttractivenessTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CompanyInsightsProps {
  onBack: () => void;
  companyData?: any;
}

// Mock data for charts
const monthlyData = [
  { month: 'Jan', vagas: 12, candidaturas: 245, contratacoes: 8, investimento: 15400 },
  { month: 'Fev', vagas: 18, candidaturas: 312, contratacoes: 11, investimento: 22100 },
  { month: 'Mar', vagas: 15, candidaturas: 289, contratacoes: 12, investimento: 18750 },
  { month: 'Abr', vagas: 22, candidaturas: 456, contratacoes: 15, investimento: 28900 },
  { month: 'Mai', vagas: 19, candidaturas: 378, contratacoes: 13, investimento: 24200 },
  { month: 'Jun', vagas: 25, candidaturas: 512, contratacoes: 18, investimento: 32500 }
];

// Mock data for open jobs tracking
const openJobsData = [
  {
    id: 1,
    title: "Desenvolvedor Full Stack Senior",
    department: "Tecnologia",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 8000, max: 12000 },
    daysOpen: 12,
    applications: 45,
    newApplications: 8,
    inReview: 12,
    interviewed: 5,
    priority: "high",
    recruiter: "Ana Silva",
    nextStep: "Agendar entrevistas técnicas",
    status: "screening"
  },
  {
    id: 2,
    title: "Designer UX/UI Pleno",
    department: "Design",
    location: "Rio de Janeiro, RJ", 
    workModel: "Remoto",
    salary: { min: 6000, max: 9000 },
    daysOpen: 8,
    applications: 32,
    newApplications: 5,
    inReview: 8,
    interviewed: 3,
    priority: "medium",
    recruiter: "Carlos Mendes",
    nextStep: "Review de portfólios",
    status: "open"
  },
  {
    id: 3,
    title: "Engenheiro de Dados",
    department: "Tecnologia",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 10000, max: 15000 },
    daysOpen: 7,
    applications: 23,
    newApplications: 12,
    inReview: 6,
    interviewed: 0,
    priority: "high",
    recruiter: "Marina Costa",
    nextStep: "Triagem inicial",
    status: "open"
  },
  {
    id: 4,
    title: "Analista de Marketing Digital",
    department: "Marketing",
    location: "Belo Horizonte, MG",
    workModel: "Presencial", 
    salary: { min: 4500, max: 7000 },
    daysOpen: 15,
    applications: 67,
    newApplications: 3,
    inReview: 15,
    interviewed: 8,
    priority: "medium",
    recruiter: "Rafael Santos",
    nextStep: "Feedback das entrevistas",
    status: "interviewing"
  },
  {
    id: 5,
    title: "Gerente de Vendas",
    department: "Vendas",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 12000, max: 18000 },
    daysOpen: 20,
    applications: 89,
    newApplications: 2,
    inReview: 20,
    interviewed: 12,
    priority: "low",
    recruiter: "Patricia Lima",
    nextStep: "Decisão final",
    status: "final_review"
  }
];

const departmentData = [
  { name: 'Tecnologia', vagas: 45, contratacoes: 32, taxa: 71, color: '#6C4DFF' },
  { name: 'Marketing', vagas: 28, contratacoes: 18, taxa: 64, color: '#FF7A00' },
  { name: 'Vendas', vagas: 35, contratacoes: 25, taxa: 71, color: '#00A86B' },
  { name: 'Design', vagas: 18, contratacoes: 14, taxa: 78, color: '#1477FF' },
  { name: 'RH', vagas: 12, contratacoes: 9, taxa: 75, color: '#444444' }
];

const performanceData = [
  { periodo: 'Semana 1', visualizacoes: 1200, candidaturas: 45, conversao: 3.8 },
  { periodo: 'Semana 2', visualizacoes: 1580, candidaturas: 67, conversao: 4.2 },
  { periodo: 'Semana 3', visualizacoes: 1340, candidaturas: 52, conversao: 3.9 },
  { periodo: 'Semana 4', visualizacoes: 1720, candidaturas: 78, conversao: 4.5 }
];

const funnelData = [
  { stage: 'Visualizações', value: 5840, color: '#E8E8E8' },
  { stage: 'Candidaturas', value: 242, color: '#FF7A00' },
  { stage: 'Triagem', value: 156, color: '#00A86B' },
  { stage: 'Entrevistas', value: 89, color: '#6C4DFF' },
  { stage: 'Contratações', value: 67, color: '#1477FF' }
];

const timeToHireData = [
  { cargo: 'Dev Senior', tempo: 25, meta: 30 },
  { cargo: 'Designer', tempo: 18, meta: 20 },
  { cargo: 'Analista', tempo: 22, meta: 25 },
  { cargo: 'Gerente', tempo: 35, meta: 40 },
  { cargo: 'Estagiário', tempo: 12, meta: 15 }
];

// Mock data for Company Attractiveness
const salaryComparisonData = [
  { cargo: 'Desenvolvedor Senior', nossaSalario: 12000, mercado: 10500, percentil: 75, diferenca: 14.3 },
  { cargo: 'Designer UX/UI', nossaSalario: 8500, mercado: 9200, percentil: 42, diferenca: -7.6 },
  { cargo: 'Gerente de Produto', nossaSalario: 15000, mercado: 14000, percentil: 68, diferenca: 7.1 },
  { cargo: 'Analista de Marketing', nossaSalario: 6000, mercado: 6500, percentil: 35, diferenca: -7.7 },
  { cargo: 'Engenheiro de Dados', nossaSalario: 14000, mercado: 12800, percentil: 72, diferenca: 9.4 }
];

const turnoverPredictionData = [
  { 
    departamento: 'Tecnologia', 
    turnoverAtual: 8.2, 
    turnoverPredito: 12.5, 
    risco: 'médio',
    fatoresRisco: ['Mercado aquecido', 'Salários abaixo da média'],
    funcionarios: 45,
    emRisco: 5
  },
  { 
    departamento: 'Marketing', 
    turnoverAtual: 15.3, 
    turnoverPredito: 18.7, 
    risco: 'alto',
    fatoresRisco: ['Alta pressão por resultados', 'Falta de progressão'],
    funcionarios: 28,
    emRisco: 8
  },
  { 
    departamento: 'Vendas', 
    turnoverAtual: 22.1, 
    turnoverPredito: 19.4, 
    risco: 'médio',
    fatoresRisco: ['Metas agressivas', 'Comissões competitivas'],
    funcionarios: 35,
    emRisco: 6
  },
  { 
    departamento: 'Design', 
    turnoverAtual: 6.8, 
    turnoverPredito: 8.9, 
    risco: 'baixo',
    fatoresRisco: ['Ambiente criativo', 'Bom work-life balance'],
    funcionarios: 18,
    emRisco: 2
  },
  { 
    departamento: 'RH', 
    turnoverAtual: 4.2, 
    turnoverPredito: 5.1, 
    risco: 'baixo',
    fatoresRisco: ['Estabilidade', 'Bons benefícios'],
    funcionarios: 12,
    emRisco: 1
  }
];

const starProfessionalsData = [
  {
    id: 1,
    nome: 'Ana Silva',
    cargo: 'Desenvolvedora Senior',
    departamento: 'Tecnologia',
    pontuacao: 94,
    potencial: 'CEO/CTO',
    fatores: ['Liderança técnica', 'Visão estratégica', 'Mentorias'],
    performance: 'Excepcional',
    engajamento: 92,
    foto: '👩‍💻',
    proximoNivel: 'Tech Lead'
  },
  {
    id: 2,
    nome: 'Carlos Mendes',
    cargo: 'Gerente de Produto',
    departamento: 'Produto',
    pontuacao: 89,
    potencial: 'VP/Diretor',
    fatores: ['Visão de mercado', 'Gestão de stakeholders', 'Inovação'],
    performance: 'Excepcional',
    engajamento: 88,
    foto: '👨‍💼',
    proximoNivel: 'Senior PM'
  },
  {
    id: 3,
    nome: 'Marina Costa',
    cargo: 'Designer UX',
    departamento: 'Design',
    pontuacao: 87,
    potencial: 'Head of Design',
    fatores: ['Criatividade', 'User research', 'Colaboração'],
    performance: 'Excepcional',
    engajamento: 90,
    foto: '👩‍🎨',
    proximoNivel: 'UX Manager'
  },
  {
    id: 4,
    nome: 'Rafael Santos',
    cargo: 'Analista de Marketing',
    departamento: 'Marketing',
    pontuacao: 82,
    potencial: 'Marketing Manager',
    fatores: ['Análise de dados', 'Campanhas criativas', 'ROI'],
    performance: 'Alta',
    engajamento: 85,
    foto: '👨‍📊',
    proximoNivel: 'Marketing Specialist'
  }
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'alto': return 'text-red-600 bg-red-50 border-red-200';
    case 'médio': return 'text-ravyz-orange bg-orange-50 border-orange-200';
    case 'baixo': return 'text-ravyz-green bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getRiskText = (risk: string) => {
  switch (risk) {
    case 'alto': return 'Alto';
    case 'médio': return 'Médio';
    case 'baixo': return 'Baixo';
    default: return 'Normal';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-ravyz-orange bg-orange-50 border-orange-200';
    case 'low': return 'text-ravyz-green bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'Alta';
    case 'medium': return 'Média';
    case 'low': return 'Baixa';
    default: return 'Normal';
  }
};

const getJobStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'text-ravyz-blue bg-blue-50 border-blue-200';
    case 'screening': return 'text-ravyz-orange bg-orange-50 border-orange-200';
    case 'interviewing': return 'text-ravyz-purple bg-purple-50 border-purple-200';
    case 'final_review': return 'text-ravyz-green bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getJobStatusText = (status: string) => {
  switch (status) {
    case 'open': return 'Recebendo';
    case 'screening': return 'Triagem';
    case 'interviewing': return 'Entrevistas';
    case 'final_review': return 'Revisão Final';
    default: return 'Aberta';
  }
};

export function CompanyInsights({ onBack, companyData }: CompanyInsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Calculate key metrics
  const totalHires = monthlyData.reduce((sum, month) => sum + month.contratacoes, 0);
  const totalInvestment = monthlyData.reduce((sum, month) => sum + month.investimento, 0);
  const costPerHire = Math.round(totalInvestment / totalHires);
  const avgTimeToHire = Math.round(timeToHireData.reduce((sum, item) => sum + item.tempo, 0) / timeToHireData.length);
  const conversionRate = ((totalHires / monthlyData.reduce((sum, month) => sum + month.candidaturas, 0)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-ravyz-orange/10 backdrop-blur-sm rounded-lg p-2">
                <RavyzLogo size="sm" variant="compact" className="text-ravyz-orange" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">Relatórios & Insights</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Mês</SelectItem>
                  <SelectItem value="3m">3 Meses</SelectItem>
                  <SelectItem value="6m">6 Meses</SelectItem>
                  <SelectItem value="1y">1 Ano</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="text-gray-600 flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Exportar</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Button variant="outline" className="text-gray-600 flex-1 sm:flex-none">
                  <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Atualizar</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Relatórios & Insights 📊
              </h1>
              <p className="text-gray-600">
                Análises detalhadas do seu processo de recrutamento e seleção
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-ravyz-green" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance Geral</p>
                      <p className="font-semibold text-ravyz-green">+23.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-blue/5 to-ravyz-blue/10 border-l-4 border-l-ravyz-blue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Custo por Contratação</p>
                  <p className="text-2xl font-bold text-ravyz-blue">R$ {costPerHire.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-ravyz-blue" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingDown className="w-4 h-4 text-ravyz-green mr-1" />
                <span className="text-ravyz-green font-medium">-8.2%</span>
                <span className="text-gray-600 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-orange/5 to-ravyz-orange/10 border-l-4 border-l-ravyz-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tempo Médio Contratação</p>
                  <p className="text-2xl font-bold text-ravyz-orange">{avgTimeToHire} dias</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-ravyz-orange" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingDown className="w-4 h-4 text-ravyz-green mr-1" />
                <span className="text-ravyz-green font-medium">-12%</span>
                <span className="text-gray-600 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-green/5 to-ravyz-green/10 border-l-4 border-l-ravyz-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-ravyz-green">{conversionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-ravyz-green" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-ravyz-green mr-1" />
                <span className="text-ravyz-green font-medium">+5.8%</span>
                <span className="text-gray-600 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-purple/5 to-ravyz-purple/10 border-l-4 border-l-ravyz-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ROI de Recrutamento</p>
                  <p className="text-2xl font-bold text-ravyz-purple">284%</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-ravyz-purple" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-ravyz-green mr-1" />
                <span className="text-ravyz-green font-medium">+15.3%</span>
                <span className="text-gray-600 ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-white border border-gray-200 p-1 gap-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Visão Geral</span>
                <span className="md:hidden">Geral</span>
              </TabsTrigger>
              <TabsTrigger 
                value="open-jobs" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Vagas Abertas</span>
                <span className="md:hidden">Vagas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Performance</span>
                <span className="md:hidden">Perf.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="departments" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Departamentos</span>
                <span className="md:hidden">Deps.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="funnel" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Funil de Conversão</span>
                <span className="md:hidden">Funil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="attractiveness" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white text-xs md:text-sm"
              >
                <span className="hidden md:inline">Atratividade</span>
                <span className="md:hidden">Atrat.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Tendências Mensais</CardTitle>
                    <CardDescription>Vagas publicadas vs. Contratações realizadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis dataKey="month" stroke="#8A8A8A" />
                        <YAxis stroke="#8A8A8A" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="vagas" 
                          stroke="#FF7A00" 
                          strokeWidth={3}
                          dot={{ fill: '#FF7A00', strokeWidth: 2, r: 4 }}
                          name="Vagas Publicadas"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="contratacoes" 
                          stroke="#00A86B" 
                          strokeWidth={3}
                          dot={{ fill: '#00A86B', strokeWidth: 2, r: 4 }}
                          name="Contratações"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Investment Analysis */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Análise de Investimento</CardTitle>
                    <CardDescription>Investimento em recrutamento ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis dataKey="month" stroke="#8A8A8A" />
                        <YAxis stroke="#8A8A8A" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Investimento']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="investimento" 
                          stroke="#6C4DFF" 
                          fill="url(#purpleGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6C4DFF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6C4DFF" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Time to Hire Comparison */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Tempo de Contratação por Cargo</CardTitle>
                  <CardDescription>Comparação entre tempo real vs. meta estabelecida</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeToHireData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                      <XAxis dataKey="cargo" stroke="#8A8A8A" />
                      <YAxis stroke="#8A8A8A" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E8E8E8', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`${value} dias`, '']}
                      />
                      <Legend />
                      <Bar dataKey="tempo" fill="#1477FF" name="Tempo Real" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="meta" fill="#E8E8E8" name="Meta" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attractiveness" className="space-y-6">
              <CompanyAttractivenessTab />
            </TabsContent>

            <TabsContent value="open-jobs" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-blue/5 to-ravyz-blue/10 border-l-4 border-l-ravyz-blue">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Abertas</p>
                        <p className="text-2xl font-bold text-ravyz-blue">{openJobsData.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-ravyz-blue" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {openJobsData.filter(job => job.priority === 'high').length} alta prioridade
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-orange/5 to-ravyz-orange/10 border-l-4 border-l-ravyz-orange">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Novas Candidaturas</p>
                        <p className="text-2xl font-bold text-ravyz-orange">
                          {openJobsData.reduce((sum, job) => sum + job.newApplications, 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-ravyz-orange" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Últimas 24h
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-purple/5 to-ravyz-purple/10 border-l-4 border-l-ravyz-purple">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Em Entrevistas</p>
                        <p className="text-2xl font-bold text-ravyz-purple">
                          {openJobsData.reduce((sum, job) => sum + job.interviewed, 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-ravyz-purple" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Candidatos ativos
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-green/5 to-ravyz-green/10 border-l-4 border-l-ravyz-green">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Tempo Médio</p>
                        <p className="text-2xl font-bold text-ravyz-green">
                          {Math.round(openJobsData.reduce((sum, job) => sum + job.daysOpen, 0) / openJobsData.length)} dias
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-ravyz-green" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Vagas abertas
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Open Jobs List */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-gray-900">Vagas em Acompanhamento</CardTitle>
                      <CardDescription>Monitore o progresso de cada processo seletivo</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Filter className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Filtrar</span>
                        <span className="sm:hidden">Filtro</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Download className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Exportar</span>
                        <span className="sm:hidden">Export</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {openJobsData.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                          {/* Header with title and badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{job.title}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`border text-xs ${getPriorityColor(job.priority)}`}
                                >
                                  {getPriorityText(job.priority)}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`border text-xs ${getJobStatusColor(job.status)}`}
                                >
                                  {getJobStatusText(job.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Actions - Always visible on mobile */}
                            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                              <Button size="sm" className="bg-ravyz-orange hover:bg-ravyz-orange/90 flex-1 sm:flex-none">
                                <Eye className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Ver Candidatos</span>
                                <span className="sm:hidden">Ver</span>
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                <Edit3 className="w-4 h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Editar</span>
                                <span className="sm:hidden">Edit</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Job details */}
                          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{job.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{job.location} • {job.workModel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 flex-shrink-0" />
                              <span>R$ {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Recruiter and time info */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Recrutador: <span className="font-medium">{job.recruiter}</span></span>
                            </div>
                            <span className="hidden sm:inline text-gray-400">•</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{job.daysOpen} dias aberta</span>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              <div className="text-center">
                                <div className="text-lg md:text-2xl font-bold text-ravyz-blue">{job.applications}</div>
                                <div className="text-xs md:text-sm text-gray-600">Total</div>
                                <div className="text-xs text-ravyz-blue font-medium">
                                  +{job.newApplications} novos
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg md:text-2xl font-bold text-ravyz-orange">{job.inReview}</div>
                                <div className="text-xs md:text-sm text-gray-600">Em análise</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg md:text-2xl font-bold text-ravyz-purple">{job.interviewed}</div>
                                <div className="text-xs md:text-sm text-gray-600">Entrevistados</div>
                              </div>
                              <div className="text-center">
                                <div className="text-base md:text-lg font-bold text-ravyz-green">
                                  {job.applications > 0 ? Math.round((job.interviewed / job.applications) * 100) : 0}%
                                </div>
                                <div className="text-xs md:text-sm text-gray-600">Taxa conversão</div>
                              </div>
                            </div>
                          </div>

                          {/* Next step */}
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-ravyz-blue mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 mb-1 text-sm">Próximo Passo:</p>
                                <p className="text-xs md:text-sm text-gray-700">{job.nextStep}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions for HR */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Ações Recomendadas</CardTitle>
                  <CardDescription>Baseado na análise dos processos em andamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-red-900 text-sm md:text-base">Vagas com Atraso</p>
                            <p className="text-xs md:text-sm text-red-700">2 vagas acima de 15 dias</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 w-full sm:w-auto">
                          <span className="text-xs md:text-sm">Revisar Processos</span>
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-4 h-4 text-ravyz-orange" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-orange-900 text-sm md:text-base">Novas Candidaturas</p>
                            <p className="text-xs md:text-sm text-orange-700">30 aguardando triagem</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full sm:w-auto">
                          <span className="text-xs md:text-sm">Fazer Triagem</span>
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-ravyz-green" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-green-900 text-sm md:text-base">Prontos para Decisão</p>
                            <p className="text-xs md:text-sm text-green-700">8 candidatos finalizados</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 w-full sm:w-auto">
                          <span className="text-xs md:text-sm">Tomar Decisões</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Performance */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance Semanal</CardTitle>
                    <CardDescription>Visualizações e candidaturas por semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis dataKey="periodo" stroke="#8A8A8A" />
                        <YAxis stroke="#8A8A8A" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="visualizacoes" fill="#FF7A00" name="Visualizações" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="candidaturas" fill="#00A86B" name="Candidaturas" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Conversion Rate */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Taxa de Conversão</CardTitle>
                    <CardDescription>Evolução da taxa de conversão semanal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis dataKey="periodo" stroke="#8A8A8A" />
                        <YAxis stroke="#8A8A8A" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value) => [`${value}%`, 'Taxa de Conversão']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="conversao" 
                          stroke="#6C4DFF" 
                          strokeWidth={4}
                          dot={{ fill: '#6C4DFF', strokeWidth: 3, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-ravyz-green" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Taxa de Visualização</p>
                        <p className="text-2xl font-bold text-gray-900">87.3%</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-4 h-4 text-ravyz-green mr-1" />
                          <span className="text-sm text-ravyz-green font-medium">+4.2%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-ravyz-orange" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qualidade do Match</p>
                        <p className="text-2xl font-bold text-gray-900">92.1%</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-4 h-4 text-ravyz-green mr-1" />
                          <span className="text-sm text-ravyz-green font-medium">+1.8%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-ravyz-blue" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Velocidade Resposta</p>
                        <p className="text-2xl font-bold text-gray-900">2.4h</p>
                        <div className="flex items-center mt-1">
                          <TrendingDown className="w-4 h-4 text-ravyz-green mr-1" />
                          <span className="text-sm text-ravyz-green font-medium">-23%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Performance */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance por Departamento</CardTitle>
                    <CardDescription>Vagas vs. Contratações por área</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis dataKey="name" stroke="#8A8A8A" />
                        <YAxis stroke="#8A8A8A" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="vagas" fill="#FF7A00" name="Vagas" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="contratacoes" fill="#00A86B" name="Contratações" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Success Rate by Department */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Taxa de Sucesso</CardTitle>
                    <CardDescription>Porcentagem de contratações por departamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentData.map((dept, index) => (
                        <div key={dept.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{dept.name}</span>
                            <span className="font-semibold" style={{ color: dept.color }}>{dept.taxa}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${dept.taxa}%`, 
                                backgroundColor: dept.color 
                              }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{dept.contratacoes} contratações</span>
                            <span>{dept.vagas} vagas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Department Comparison */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Comparativo Departamental</CardTitle>
                  <CardDescription>Análise detalhada por área da empresa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="text-center">
                        <div 
                          className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${dept.color}15` }}
                        >
                          <Building2 className="w-6 h-6 md:w-8 md:h-8" style={{ color: dept.color }} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{dept.name}</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vagas:</span>
                            <span className="font-medium">{dept.vagas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contratações:</span>
                            <span className="font-medium">{dept.contratacoes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Taxa:</span>
                            <span className="font-semibold" style={{ color: dept.color }}>{dept.taxa}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Funil de Conversão</CardTitle>
                    <CardDescription>Jornada completa do candidato</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {funnelData.map((stage, index) => {
                        const percentage = index === 0 ? 100 : Math.round((stage.value / funnelData[0].value) * 100);
                        const dropRate = index > 0 ? Math.round(((funnelData[index-1].value - stage.value) / funnelData[index-1].value) * 100) : 0;
                        
                        return (
                          <div key={stage.stage} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{stage.stage}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{stage.value.toLocaleString()}</span>
                                <Badge 
                                  variant="outline" 
                                  style={{ 
                                    color: stage.color, 
                                    borderColor: stage.color 
                                  }}
                                >
                                  {percentage}%
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${percentage}%`, 
                                  backgroundColor: stage.color 
                                }}
                              ></div>
                            </div>
                            {index > 0 && (
                              <div className="text-sm text-gray-600">
                                <span className="text-red-600 font-medium">-{dropRate}%</span> drop rate da etapa anterior
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Funnel Chart */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Distribuição do Funil</CardTitle>
                    <CardDescription>Proporção visual de cada etapa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={funnelData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ stage, value }) => `${stage}: ${value}`}
                        >
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E8E8E8', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion Insights */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Insights de Conversão</CardTitle>
                  <CardDescription>Análise detalhada das etapas críticas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-ravyz-orange/5 rounded-xl border border-ravyz-orange/20">
                      <div className="w-16 h-16 bg-ravyz-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-ravyz-orange" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Visualização → Candidatura</h3>
                      <p className="text-2xl font-bold text-ravyz-orange mb-2">4.1%</p>
                      <p className="text-sm text-gray-600">Taxa de conversão inicial</p>
                    </div>

                    <div className="text-center p-6 bg-ravyz-green/5 rounded-xl border border-ravyz-green/20">
                      <div className="w-16 h-16 bg-ravyz-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-ravyz-green" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Candidatura → Entrevista</h3>
                      <p className="text-2xl font-bold text-ravyz-green mb-2">36.8%</p>
                      <p className="text-sm text-gray-600">Qualificação de candidatos</p>
                    </div>

                    <div className="text-center p-6 bg-ravyz-blue/5 rounded-xl border border-ravyz-blue/20">
                      <div className="w-16 h-16 bg-ravyz-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-8 h-8 text-ravyz-blue" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Entrevista → Contratação</h3>
                      <p className="text-2xl font-bold text-ravyz-blue mb-2">75.3%</p>
                      <p className="text-sm text-gray-600">Taxa de aprovação final</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}