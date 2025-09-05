import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Building2, 
  Users, 
  Clock,
  Star,
  ArrowRight,
  Filter,
  Search,
  Eye,
  Heart,
  ChevronDown,
  CheckCircle
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface JobOpening {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  industry: string;
  location: string;
  workModel: 'Presencial' | 'Remoto' | 'Híbrido';
  salaryMin: number;
  salaryMax: number;
  level: 'Júnior' | 'Pleno' | 'Sênior' | 'Lead';
  matchScore: number;
  benefits: string[];
  requirements: string[];
  postedDays: number;
  applicants: number;
  isHot: boolean;
  companySize: string;
  growthTrend: 'up' | 'stable' | 'down';
  growthPercent: number;
}

interface JobSalaryReferenceProps {
  position?: string;
  level?: string;
  industry?: string[];
  location?: string[];
  workModel?: string[];
  onSalarySelect?: (min: number, max: number) => void;
  selectedMin?: number;
  selectedMax?: number;
  showOnlyRelevant?: boolean;
}

export function JobSalaryReference({
  position = '',
  level = '',
  industry = [],
  location = [],
  workModel = [],
  onSalarySelect,
  selectedMin,
  selectedMax,
  showOnlyRelevant = true
}: JobSalaryReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'salary' | 'match' | 'recent'>('match');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  // Base de dados de vagas com salários reais
  const jobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'Product Manager Sênior',
      company: 'Nubank',
      companyLogo: '💜',
      industry: 'Fintech',
      location: 'São Paulo',
      workModel: 'Híbrido',
      salaryMin: 18000,
      salaryMax: 28000,
      level: 'Sênior',
      matchScore: 95,
      benefits: ['Stock Options', 'Plano Saúde Premium', 'Vale Alimentação R$ 1.500'],
      requirements: ['5+ anos experiência', 'Fintech', 'Growth'],
      postedDays: 3,
      applicants: 47,
      isHot: true,
      companySize: '5.000+ funcionários',
      growthTrend: 'up',
      growthPercent: 22
    },
    {
      id: '2',
      title: 'Head of Product',
      company: 'iFood',
      companyLogo: '🍔',
      industry: 'Tecnologia',
      location: 'São Paulo',
      workModel: 'Híbrido',
      salaryMin: 25000,
      salaryMax: 40000,
      level: 'Sênior',
      matchScore: 92,
      benefits: ['Equity', 'Seguro Saúde', 'Vale Refeição R$ 2.000'],
      requirements: ['7+ anos liderança', 'Marketplace', 'Scale-up'],
      postedDays: 1,
      applicants: 23,
      isHot: true,
      companySize: '3.000+ funcionários',
      growthTrend: 'up',
      growthPercent: 18
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'Stone',
      companyLogo: '💎',
      industry: 'Fintech',
      location: 'São Paulo',
      workModel: 'Presencial',
      salaryMin: 15000,
      salaryMax: 22000,
      level: 'Pleno',
      matchScore: 88,
      benefits: ['PLR', 'Auxílio Educação', 'Vale Refeição R$ 1.200'],
      requirements: ['4+ anos', 'Pagamentos', 'B2B'],
      postedDays: 5,
      applicants: 68,
      isHot: false,
      companySize: '3.000+ funcionários',
      growthTrend: 'stable',
      growthPercent: 15
    },
    {
      id: '4',
      title: 'Senior Product Manager',
      company: 'Mercado Livre',
      companyLogo: '💛',
      industry: 'E-commerce',
      location: 'São Paulo',
      workModel: 'Remoto',
      salaryMin: 16000,
      salaryMax: 25000,
      level: 'Sênior',
      matchScore: 85,
      benefits: ['Stock Options', 'Plano Saúde', 'Home Office Allowance'],
      requirements: ['5+ anos', 'E-commerce', 'Marketplace'],
      postedDays: 7,
      applicants: 112,
      isHot: false,
      companySize: '10.000+ funcionários',
      growthTrend: 'up',
      growthPercent: 20
    },
    {
      id: '5',
      title: 'Product Lead',
      company: 'Loft',
      companyLogo: '🏠',
      industry: 'PropTech',
      location: 'São Paulo',
      workModel: 'Híbrido',
      salaryMin: 14000,
      salaryMax: 20000,
      level: 'Pleno',
      matchScore: 82,
      benefits: ['Equity significativo', 'Flexibilidade', 'Crescimento rápido'],
      requirements: ['3+ anos', 'PropTech/Real Estate', 'Startup'],
      postedDays: 4,
      applicants: 34,
      isHot: true,
      companySize: '500-1000 funcionários',
      growthTrend: 'up',
      growthPercent: 30
    },
    {
      id: '6',
      title: 'Product Manager',
      company: 'Magazine Luiza',
      companyLogo: '🛒',
      industry: 'Varejo',
      location: 'São Paulo',
      workModel: 'Híbrido',
      salaryMin: 12000,
      salaryMax: 18000,
      level: 'Pleno',
      matchScore: 80,
      benefits: ['Plano Saúde', 'Participação Lucros', 'Vale Alimentação'],
      requirements: ['4+ anos', 'Varejo', 'Digital Transformation'],
      postedDays: 10,
      applicants: 89,
      isHot: false,
      companySize: '50.000+ funcionários',
      growthTrend: 'stable',
      growthPercent: 12
    },
    {
      id: '7',
      title: 'Product Manager Júnior',
      company: 'Conta Azul',
      companyLogo: '💙',
      industry: 'SaaS',
      location: 'Remoto',
      workModel: 'Remoto',
      salaryMin: 8000,
      salaryMax: 12000,
      level: 'Júnior',
      matchScore: 75,
      benefits: ['Plano Saúde', 'Vale Alimentação', 'Flexibilidade'],
      requirements: ['2+ anos', 'SaaS', 'B2B'],
      postedDays: 6,
      applicants: 156,
      isHot: false,
      companySize: '1.000+ funcionários',
      growthTrend: 'stable',
      growthPercent: 10
    },
    {
      id: '8',
      title: 'Senior Product Manager',
      company: 'Gympass',
      companyLogo: '🏃',
      industry: 'Wellness',
      location: 'Rio de Janeiro',
      workModel: 'Híbrido',
      salaryMin: 17000,
      salaryMax: 26000,
      level: 'Sênior',
      matchScore: 87,
      benefits: ['Stock Options', 'Plano Saúde Premium', 'Wellness Budget'],
      requirements: ['5+ anos', 'B2B2C', 'Global Product'],
      postedDays: 8,
      applicants: 67,
      isHot: false,
      companySize: '2.000+ funcionários',
      growthTrend: 'up',
      growthPercent: 25
    }
  ];

  // Filtragem e ordenação das vagas
  const filteredJobs = useMemo(() => {
    let filtered = jobOpenings;

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por nível
    if (filterLevel !== 'all') {
      filtered = filtered.filter(job => job.level === filterLevel);
    }

    // Se showOnlyRelevant, filtra por relevância
    if (showOnlyRelevant) {
      if (industry.length > 0) {
        filtered = filtered.filter(job => industry.includes(job.industry));
      }
      if (location.length > 0) {
        filtered = filtered.filter(job => location.includes(job.location));
      }
      if (workModel.length > 0) {
        filtered = filtered.filter(job => workModel.includes(job.workModel));
      }
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return b.salaryMax - a.salaryMax;
        case 'recent':
          return a.postedDays - b.postedDays;
        case 'match':
        default:
          return b.matchScore - a.matchScore;
      }
    });

    return filtered;
  }, [searchQuery, filterLevel, sortBy, industry, location, workModel, showOnlyRelevant]);

  // Estatísticas das vagas
  const salaryStats = useMemo(() => {
    if (filteredJobs.length === 0) return null;

    const salaries = filteredJobs.map(job => (job.salaryMin + job.salaryMax) / 2);
    const min = Math.min(...filteredJobs.map(job => job.salaryMin));
    const max = Math.max(...filteredJobs.map(job => job.salaryMax));
    const avg = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
    
    const sortedSalaries = salaries.sort((a, b) => a - b);
    const median = sortedSalaries[Math.floor(sortedSalaries.length / 2)];

    return { min, max, avg: Math.round(avg), median: Math.round(median) };
  }, [filteredJobs]);

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const applySalaryRange = (min: number, max: number) => {
    onSalarySelect?.(min, max);
  };

  return (
    <div className="space-y-6">
      {/* Header e Stats */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Briefcase className="w-6 h-6 text-ravyz-blue" />
            Referências Salariais de Vagas
          </h3>
          <p className="text-gray-600">
            Baseado em {filteredJobs.length} vagas ativas similares ao seu perfil
          </p>
        </div>

        {salaryStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-bold text-ravyz-green">
                R$ {salaryStats.min.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Mínimo</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-bold text-ravyz-blue">
                R$ {salaryStats.median.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Mediana</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-bold text-ravyz-purple">
                R$ {salaryStats.avg.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Média</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-bold text-ravyz-orange">
                R$ {salaryStats.max.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Máximo</p>
            </div>
          </div>
        )}
      </div>

      {/* Sugestões Rápidas */}
      {salaryStats && onSalarySelect && (
        <Card className="p-4 bg-ravyz-blue/5 border border-ravyz-blue/20">
          <h4 className="font-semibold text-ravyz-blue mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Sugestões Baseadas no Mercado
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applySalaryRange(
                Math.round(salaryStats.min), 
                Math.round(salaryStats.median)
              )}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <span className="font-medium">Conservador</span>
              <span className="text-xs text-gray-500">
                R$ {salaryStats.min.toLocaleString()} - R$ {salaryStats.median.toLocaleString()}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applySalaryRange(
                Math.round(salaryStats.median * 0.9), 
                Math.round(salaryStats.avg * 1.1)
              )}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <span className="font-medium">Equilibrado</span>
              <span className="text-xs text-gray-500">
                R$ {Math.round(salaryStats.median * 0.9).toLocaleString()} - R$ {Math.round(salaryStats.avg * 1.1).toLocaleString()}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applySalaryRange(
                Math.round(salaryStats.avg), 
                Math.round(salaryStats.max)
              )}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <span className="font-medium">Ambicioso</span>
              <span className="text-xs text-gray-500">
                R$ {salaryStats.avg.toLocaleString()} - R$ {salaryStats.max.toLocaleString()}
              </span>
            </Button>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cargo ou empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-3">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Júnior">Júnior</SelectItem>
                <SelectItem value="Pleno">Pleno</SelectItem>
                <SelectItem value="Sênior">Sênior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy as any}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Relevância</SelectItem>
                <SelectItem value="salary">Salário</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Lista de Vagas */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => {
          const isExpanded = expandedJobs.has(job.id);
          const midSalary = (job.salaryMin + job.salaryMax) / 2;
          
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Header da Vaga */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{job.companyLogo}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {job.title}
                            {job.isHot && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                🔥 HOT
                              </Badge>
                            )}
                          </h4>
                          <p className="text-gray-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location} • {job.workModel}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`
                          ${job.level === 'Sênior' ? 'border-purple-500 text-purple-500' :
                            job.level === 'Pleno' ? 'border-blue-500 text-blue-500' :
                            job.level === 'Júnior' ? 'border-green-500 text-green-500' :
                            'border-orange-500 text-orange-500'}
                        `}>
                          {job.level}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="bg-ravyz-blue/10 text-ravyz-blue border-ravyz-blue/20"
                        >
                          {job.matchScore}% match
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-ravyz-green">
                        R$ {job.salaryMin.toLocaleString()} - R$ {job.salaryMax.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Média: R$ {Math.round(midSalary).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.postedDays} dias atrás
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.applicants} candidatos
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className={`w-3 h-3 ${
                          job.growthTrend === 'up' ? 'text-green-500' : 
                          job.growthTrend === 'stable' ? 'text-blue-500' : 'text-red-500'
                        }`} />
                        +{job.growthPercent}% crescimento
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySalaryRange(job.salaryMin, job.salaryMax)}
                        className="text-xs px-3 py-1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Usar Faixa
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleJobExpansion(job.id)}
                        className="text-xs px-2 py-1"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t pt-4 space-y-3"
                    >
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Requisitos:</p>
                          <ul className="space-y-1">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-ravyz-blue rounded-full"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Benefícios:</p>
                          <ul className="space-y-1">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-ravyz-green rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <p className="text-sm text-gray-500">
                          <Building2 className="w-4 h-4 inline mr-1" />
                          {job.companySize} • {job.industry}
                        </p>
                        <Button size="sm" className="bg-ravyz-blue hover:bg-ravyz-blue/90">
                          Ver Vaga Completa
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Nenhuma vaga encontrada</h4>
          <p className="text-gray-500">
            Tente ajustar os filtros ou expandir os critérios de busca
          </p>
        </Card>
      )}
    </div>
  );
}