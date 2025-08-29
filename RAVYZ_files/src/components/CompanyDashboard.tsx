import { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Briefcase, 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  Plus, 
  Eye, 
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Play
} from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CompanyDashboardProps {
  onCreateJob: () => void;
  onViewInsights: () => void;
  onBack: () => void;
  companyData?: any;
}

// Mock data for demonstration
const mockJobs = [
  {
    id: 1,
    title: "Desenvolvedor Full Stack Senior",
    department: "Tecnologia",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 8000, max: 12000 },
    status: "open",
    applications: 45,
    views: 234,
    createdAt: "2024-01-15",
    daysOpen: 12
  },
  {
    id: 2,
    title: "Designer UX/UI Pleno",
    department: "Design",
    location: "Rio de Janeiro, RJ",
    workModel: "Remoto",
    salary: { min: 6000, max: 9000 },
    status: "in_progress",
    applications: 67,
    views: 189,
    createdAt: "2024-01-10",
    daysOpen: 17
  },
  {
    id: 3,
    title: "Analista de Marketing Digital",
    department: "Marketing",
    location: "Belo Horizonte, MG",
    workModel: "Presencial",
    salary: { min: 4500, max: 7000 },
    status: "closed",
    applications: 89,
    views: 312,
    createdAt: "2023-12-20",
    closedAt: "2024-01-20",
    daysToClose: 31
  },
  {
    id: 4,
    title: "Engenheiro de Dados",
    department: "Tecnologia",
    location: "São Paulo, SP",
    workModel: "Híbrido",
    salary: { min: 10000, max: 15000 },
    status: "open",
    applications: 23,
    views: 156,
    createdAt: "2024-01-20",
    daysOpen: 7
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'text-ravyz-green bg-green-50 border-green-200';
    case 'in_progress': return 'text-ravyz-orange bg-orange-50 border-orange-200';
    case 'closed': return 'text-ravyz-blue bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'open': return 'Aberta';
    case 'in_progress': return 'Em Andamento';
    case 'closed': return 'Fechada';
    default: return 'Desconhecido';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open': return <Play className="w-3 h-3" />;
    case 'in_progress': return <AlertCircle className="w-3 h-3" />;
    case 'closed': return <CheckCircle className="w-3 h-3" />;
    default: return null;
  }
};

export function CompanyDashboard({ onCreateJob, onViewInsights, onBack, companyData }: CompanyDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate metrics
  const openJobs = mockJobs.filter(job => job.status === 'open').length;
  const inProgressJobs = mockJobs.filter(job => job.status === 'in_progress').length;
  const closedJobs = mockJobs.filter(job => job.status === 'closed').length;
  const totalApplications = mockJobs.reduce((sum, job) => sum + job.applications, 0);
  const avgTimeToClose = Math.round(mockJobs.filter(job => job.status === 'closed').reduce((sum, job) => sum + (job.daysToClose || 0), 0) / closedJobs);
  const companyRating = 4.7;

  // Filter jobs
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-ravyz-orange/10 backdrop-blur-sm rounded-lg p-2">
                <RavyzLogo size="sm" variant="compact" className="text-ravyz-orange" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">Dashboard Empresas</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={onCreateJob}
                className="bg-ravyz-orange hover:bg-ravyz-orange/90 text-white font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Vaga
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-700"
              >
                Sair
              </Button>
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
                Olá, Tech Solutions! 👋
              </h1>
              <p className="text-gray-600">
                Gerencie suas vagas e acompanhe métricas em tempo real
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900">{companyRating}</span>
              </div>
              <div className="text-sm text-gray-600">Rating da Empresa</div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-green/5 to-ravyz-green/10 border-l-4 border-l-ravyz-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Vagas Abertas</p>
                  <p className="text-3xl font-bold text-ravyz-green">{openJobs}</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-ravyz-green" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-ravyz-green mr-1" />
                <span className="text-ravyz-green font-medium">+12%</span>
                <span className="text-gray-600 ml-1">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-orange/5 to-ravyz-orange/10 border-l-4 border-l-ravyz-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Em Andamento</p>
                  <p className="text-3xl font-bold text-ravyz-orange">{inProgressJobs}</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-ravyz-orange" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Users className="w-4 h-4 text-ravyz-orange mr-1" />
                <span className="text-gray-600">Em processo seletivo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-blue/5 to-ravyz-blue/10 border-l-4 border-l-ravyz-blue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Vagas Fechadas</p>
                  <p className="text-3xl font-bold text-ravyz-blue">{closedJobs}</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-ravyz-blue" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Clock className="w-4 h-4 text-ravyz-blue mr-1" />
                <span className="text-ravyz-blue font-medium">{avgTimeToClose} dias</span>
                <span className="text-gray-600 ml-1">tempo médio</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-purple/5 to-ravyz-purple/10 border-l-4 border-l-ravyz-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Candidaturas</p>
                  <p className="text-3xl font-bold text-ravyz-purple">{totalApplications}</p>
                </div>
                <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-ravyz-purple" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-ravyz-purple mr-1" />
                <span className="text-ravyz-purple font-medium">+28%</span>
                <span className="text-gray-600 ml-1">vs. mês anterior</span>
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
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="jobs" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white"
              >
                Gerenciar Vagas
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-ravyz-orange data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Ações Rápidas</CardTitle>
                  <CardDescription>
                    Gerencie suas vagas e processo seletivo de forma eficiente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={onCreateJob}
                      className="h-auto p-6 bg-gradient-to-br from-ravyz-orange to-ravyz-orange/80 hover:from-ravyz-orange/90 hover:to-ravyz-orange/70 text-white border-0 flex flex-col items-center gap-3"
                    >
                      <Plus className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-semibold">Criar Nova Vaga</div>
                        <div className="text-sm opacity-90">Configure requisitos e benefícios</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto p-6 border-ravyz-green text-ravyz-green hover:bg-ravyz-green/5 flex flex-col items-center gap-3"
                    >
                      <Eye className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-semibold">Ver Candidatos</div>
                        <div className="text-sm">Banco de talentos qualificados</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={onViewInsights}
                      variant="outline"
                      className="h-auto p-6 border-ravyz-purple text-ravyz-purple hover:bg-ravyz-purple/5 flex flex-col items-center gap-3"
                    >
                      <TrendingUp className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-semibold">Relatórios</div>
                        <div className="text-sm">Métricas e insights detalhados</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-ravyz-green/10 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-ravyz-green" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">5 novas candidaturas</p>
                        <p className="text-sm text-gray-600">Para a vaga de Desenvolvedor Full Stack Senior</p>
                      </div>
                      <span className="text-sm text-gray-500">2h atrás</span>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-ravyz-orange" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Novo review da empresa</p>
                        <p className="text-sm text-gray-600">Avaliação 5 estrelas de ex-candidato</p>
                      </div>
                      <span className="text-sm text-gray-500">1 dia atrás</span>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-ravyz-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Vaga preenchida com sucesso</p>
                        <p className="text-sm text-gray-600">Analista de Marketing Digital - 31 dias</p>
                      </div>
                      <span className="text-sm text-gray-500">3 dias atrás</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              {/* Filters */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Buscar vagas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                        className={statusFilter === 'all' ? 'bg-ravyz-orange hover:bg-ravyz-orange/90' : ''}
                      >
                        Todas
                      </Button>
                      <Button
                        variant={statusFilter === 'open' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('open')}
                        className={statusFilter === 'open' ? 'bg-ravyz-green hover:bg-ravyz-green/90' : ''}
                      >
                        Abertas
                      </Button>
                      <Button
                        variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('in_progress')}
                        className={statusFilter === 'in_progress' ? 'bg-ravyz-orange hover:bg-ravyz-orange/90' : ''}
                      >
                        Em Andamento
                      </Button>
                      <Button
                        variant={statusFilter === 'closed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('closed')}
                        className={statusFilter === 'closed' ? 'bg-ravyz-blue hover:bg-ravyz-blue/90' : ''}
                      >
                        Fechadas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs List */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={`border ${getStatusColor(job.status)} flex items-center gap-1`}
                            >
                              {getStatusIcon(job.status)}
                              {getStatusText(job.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {job.department}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              R$ {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {job.status === 'closed' ? `Fechada em ${job.daysToClose} dias` : `${job.daysOpen} dias aberta`}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2 text-ravyz-purple">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{job.applications}</span>
                              <span className="text-gray-600">candidaturas</span>
                            </div>
                            <div className="flex items-center gap-2 text-ravyz-blue">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{job.views}</span>
                              <span className="text-gray-600">visualizações</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance das Vagas</CardTitle>
                    <CardDescription>Métricas dos últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Taxa de Conversão</span>
                        <span className="font-semibold text-ravyz-green">12.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tempo Médio de Preenchimento</span>
                        <span className="font-semibold text-ravyz-orange">{avgTimeToClose} dias</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Custo por Contratação</span>
                        <span className="font-semibold text-ravyz-purple">R$ 2.340</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Qualidade do Match</span>
                        <span className="font-semibold text-ravyz-blue">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Rating */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Rating da Empresa</CardTitle>
                    <CardDescription>Avaliação dos candidatos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-ravyz-orange mb-2">{companyRating}</div>
                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-6 h-6 ${star <= Math.floor(companyRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-6">Baseado em 127 avaliações</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-20">Processo</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-ravyz-green h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.2</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-20">Cultura</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-ravyz-blue h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.6</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-20">Benefícios</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-ravyz-purple h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">3.9</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}