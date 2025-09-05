import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  Building2, 
  Users, 
  Award, 
  Target, 
  Lightbulb, 
  DollarSign,
  Info,
  Briefcase,
  Calendar,
  Trophy,
  Star,
  ChevronRight,
  Filter
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SalaryBenchmarkingProps {
  currentPosition?: string;
  currentLevel?: string;
  currentIndustry?: string;
  currentLocation?: string;
  currentSalary?: number;
  selectedMin?: number;
  selectedMax?: number;
  onSuggestionApply?: (min: number, max: number) => void;
}

interface BenchmarkData {
  position: string;
  level: string;
  industry: string;
  location: string;
  min: number;
  max: number;
  median: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  growth: number;
  sample: number;
  marketTrend: 'crescendo' | 'estável' | 'declining';
  demandLevel: 'alta' | 'média' | 'baixa';
  lastUpdate: string;
}

interface CompanyBenchmark {
  name: string;
  type: 'startup' | 'scale-up' | 'corporate' | 'multinational';
  size: string;
  salaryRange: { min: number; max: number };
  benefits: string[];
  culture: string;
  growth: number;
}

interface RegionalData {
  city: string;
  state: string;
  costOfLiving: number;
  salaryMultiplier: number;
  demandLevel: 'alta' | 'média' | 'baixa';
  marketSize: number;
  avgSalary: number;
  topIndustries: string[];
}

export function SalaryBenchmarking({
  currentPosition,
  currentLevel,
  currentIndustry,
  currentLocation,
  currentSalary,
  selectedMin,
  selectedMax,
  onSuggestionApply
}: SalaryBenchmarkingProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);

  // Base de dados expandida de benchmarking salarial
  const benchmarkDatabase: BenchmarkData[] = [
    // Tecnologia
    { position: "Product Manager", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 6000, max: 9000, median: 7500, percentile25: 6500, percentile75: 8500, percentile90: 9500, growth: 12, sample: 1250, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    { position: "Product Manager", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 9000, max: 15000, median: 12000, percentile25: 10000, percentile75: 14000, percentile90: 16000, growth: 15, sample: 2100, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    { position: "Product Manager", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 15000, max: 25000, median: 20000, percentile25: 17000, percentile75: 23000, percentile90: 28000, growth: 18, sample: 850, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    
    { position: "Desenvolvedor", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 4000, max: 7000, median: 5500, percentile25: 4500, percentile75: 6500, percentile90: 7500, growth: 10, sample: 3200, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    { position: "Desenvolvedor", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 7000, max: 12000, median: 9500, percentile25: 8000, percentile75: 11000, percentile90: 13000, growth: 13, sample: 2800, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    { position: "Desenvolvedor", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 12000, max: 20000, median: 16000, percentile25: 14000, percentile75: 18000, percentile90: 22000, growth: 16, sample: 1100, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    
    // Fintech
    { position: "Product Manager", level: "Pleno", industry: "Fintech", location: "São Paulo", min: 10000, max: 16000, median: 13000, percentile25: 11000, percentile75: 15000, percentile90: 18000, growth: 20, sample: 450, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    { position: "Product Manager", level: "Sênior", industry: "Fintech", location: "São Paulo", min: 16000, max: 28000, median: 22000, percentile25: 18000, percentile75: 25000, percentile90: 30000, growth: 22, sample: 280, marketTrend: 'crescendo', demandLevel: 'alta', lastUpdate: '2024-12' },
    
    { position: "Analista", level: "Júnior", industry: "Fintech", location: "São Paulo", min: 4500, max: 7500, median: 6000, percentile25: 5000, percentile75: 7000, percentile90: 8000, growth: 14, sample: 890, marketTrend: 'crescendo', demandLevel: 'média', lastUpdate: '2024-12' },
    { position: "Analista", level: "Pleno", industry: "Fintech", location: "São Paulo", min: 7500, max: 12000, median: 9750, percentile25: 8500, percentile75: 11000, percentile90: 12500, growth: 17, sample: 650, marketTrend: 'crescendo', demandLevel: 'média', lastUpdate: '2024-12' },
    
    // Consultoria
    { position: "Consultor", level: "Júnior", industry: "Consultoria", location: "São Paulo", min: 5000, max: 8000, median: 6500, percentile25: 5500, percentile75: 7500, percentile90: 8500, growth: 8, sample: 1500, marketTrend: 'estável', demandLevel: 'média', lastUpdate: '2024-12' },
    { position: "Consultor", level: "Pleno", industry: "Consultoria", location: "São Paulo", min: 8000, max: 14000, median: 11000, percentile25: 9000, percentile75: 13000, percentile90: 15000, growth: 11, sample: 980, marketTrend: 'estável', demandLevel: 'média', lastUpdate: '2024-12' },
    { position: "Consultor", level: "Sênior", industry: "Consultoria", location: "São Paulo", min: 14000, max: 22000, median: 18000, percentile25: 16000, percentile75: 20000, percentile90: 24000, growth: 13, sample: 420, marketTrend: 'estável', demandLevel: 'média', lastUpdate: '2024-12' },
    
    // Marketing
    { position: "Marketing", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 3500, max: 6000, median: 4750, percentile25: 4000, percentile75: 5500, percentile90: 6500, growth: 9, sample: 1800, marketTrend: 'crescendo', demandLevel: 'média', lastUpdate: '2024-12' },
    { position: "Marketing", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 6000, max: 10000, median: 8000, percentile25: 7000, percentile75: 9000, percentile90: 11000, growth: 12, sample: 1200, marketTrend: 'crescendo', demandLevel: 'média', lastUpdate: '2024-12' },
    { position: "Marketing", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 10000, max: 16000, median: 13000, percentile25: 11500, percentile75: 15000, percentile90: 17000, growth: 14, sample: 600, marketTrend: 'crescendo', demandLevel: 'média', lastUpdate: '2024-12' },
  ];

  // Dados de empresas para benchmarking
  const companyBenchmarks: CompanyBenchmark[] = [
    {
      name: "Google Brasil",
      type: "multinational",
      size: "10.000+ funcionários",
      salaryRange: { min: 18000, max: 35000 },
      benefits: ["Stock Options", "Seguro Saúde Premium", "Vale Refeição R$ 2.000"],
      culture: "Inovação e autonomia",
      growth: 25
    },
    {
      name: "Nubank",
      type: "scale-up",
      size: "5.000+ funcionários", 
      salaryRange: { min: 15000, max: 28000 },
      benefits: ["Equity", "Plano de Saúde", "Vale Alimentação R$ 1.500"],
      culture: "Customer obsessed",
      growth: 22
    },
    {
      name: "Stone",
      type: "corporate",
      size: "3.000+ funcionários",
      salaryRange: { min: 13000, max: 25000 },
      benefits: ["PLR", "Auxílio Educação", "Vale Refeição R$ 1.200"],
      culture: "Performance driven",
      growth: 18
    },
    {
      name: "Startup Série A",
      type: "startup",
      size: "50-200 funcionários",
      salaryRange: { min: 8000, max: 15000 },
      benefits: ["Equity significativo", "Flexibilidade", "Home Office"],
      culture: "Fast-paced growth",
      growth: 35
    }
  ];

  // Dados regionais
  const regionalData: RegionalData[] = [
    {
      city: "São Paulo",
      state: "SP",
      costOfLiving: 1.0,
      salaryMultiplier: 1.0,
      demandLevel: "alta",
      marketSize: 450000,
      avgSalary: 12500,
      topIndustries: ["Tecnologia", "Fintech", "Consultoria", "E-commerce"]
    },
    {
      city: "Rio de Janeiro", 
      state: "RJ",
      costOfLiving: 0.92,
      salaryMultiplier: 0.9,
      demandLevel: "média",
      marketSize: 180000,
      avgSalary: 11200,
      topIndustries: ["Tecnologia", "Energia", "Telecomunicações"]
    },
    {
      city: "Belo Horizonte",
      state: "MG", 
      costOfLiving: 0.75,
      salaryMultiplier: 0.8,
      demandLevel: "média",
      marketSize: 95000,
      avgSalary: 9800,
      topIndustries: ["Tecnologia", "Mineração", "Automotivo"]
    },
    {
      city: "Porto Alegre",
      state: "RS",
      costOfLiving: 0.78,
      salaryMultiplier: 0.85, 
      demandLevel: "média",
      marketSize: 85000,
      avgSalary: 10200,
      topIndustries: ["Tecnologia", "Agronegócio", "Manufatura"]
    },
    {
      city: "Recife",
      state: "PE",
      costOfLiving: 0.68,
      salaryMultiplier: 0.75,
      demandLevel: "baixa",
      marketSize: 55000,
      avgSalary: 8500,
      topIndustries: ["Tecnologia", "Turismo", "Indústria Naval"]
    },
    {
      city: "Brasília",
      state: "DF",
      costOfLiving: 0.88,
      salaryMultiplier: 0.9,
      demandLevel: "média",
      marketSize: 120000,
      avgSalary: 11800,
      topIndustries: ["Governo", "Tecnologia", "Consultoria"]
    }
  ];

  const matchingBenchmark = useMemo(() => {
    if (!currentPosition || !currentLevel || !currentIndustry) return null;

    // Busca exata primeiro
    let match = benchmarkDatabase.find(data => 
      data.position.toLowerCase().includes(currentPosition.toLowerCase()) &&
      data.level === currentLevel &&
      data.industry === currentIndustry
    );

    // Se não encontrar, busca por posição e nível
    if (!match) {
      match = benchmarkDatabase.find(data => 
        data.position.toLowerCase().includes(currentPosition.toLowerCase()) &&
        data.level === currentLevel
      );
    }

    // Se ainda não encontrar, busca só por indústria e nível
    if (!match) {
      match = benchmarkDatabase.find(data => 
        data.industry === currentIndustry &&
        data.level === currentLevel
      );
    }

    return match;
  }, [currentPosition, currentLevel, currentIndustry]);

  const regionalBenchmark = useMemo(() => {
    return regionalData.find(data => 
      data.city.toLowerCase() === currentLocation?.toLowerCase()
    ) || regionalData[0]; // Default para São Paulo
  }, [currentLocation]);

  const getSalaryPosition = () => {
    if (!matchingBenchmark || !currentSalary) return null;

    const difference = ((currentSalary - matchingBenchmark.median) / matchingBenchmark.median) * 100;
    
    let status: 'low' | 'market' | 'high' | 'excellent' = 'market';
    let message = '';
    let color = '';
    let icon = BarChart3;

    if (difference < -20) {
      status = 'low';
      message = 'Significativamente abaixo';
      color = 'red-500';
      icon = TrendingDown;
    } else if (difference < -5) {
      status = 'low';
      message = 'Abaixo do mercado';
      color = 'orange-500';
      icon = TrendingDown;
    } else if (difference > 25) {
      status = 'excellent';
      message = 'Excelente posição';
      color = 'green-600';
      icon = Trophy;
    } else if (difference > 10) {
      status = 'high';
      message = 'Acima do mercado';
      color = 'green-500';
      icon = TrendingUp;
    } else {
      message = 'Dentro da média';
      color = 'blue-500';
      icon = BarChart3;
    }

    return { difference, message, color, icon, status };
  };

  const salaryPosition = getSalaryPosition();

  const renderOverview = () => (
    <div className="space-y-6">
      {matchingBenchmark && (
        <>
          {/* Resumo Principal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-ravyz-blue">
                R$ {matchingBenchmark.median.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Mediana Nacional</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-ravyz-green">
                +{matchingBenchmark.growth}%
              </p>
              <p className="text-sm text-gray-500">Crescimento Anual</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-ravyz-purple">
                R$ {matchingBenchmark.percentile90.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Top 10%</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-700">
                {matchingBenchmark.sample.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Profissionais</p>
            </div>
          </div>

          {/* Status da Posição Atual */}
          {salaryPosition && currentSalary && (
            <div className={`p-4 rounded-lg border-2 border-${salaryPosition.color}/20 bg-${salaryPosition.color}/5`}>
              <div className="flex items-center gap-3">
                <salaryPosition.icon className={`w-6 h-6 text-${salaryPosition.color}`} />
                <div className="flex-1">
                  <p className={`font-semibold text-${salaryPosition.color} text-lg`}>
                    {salaryPosition.message}
                  </p>
                  <p className="text-gray-600">
                    Seu salário (R$ {currentSalary.toLocaleString()}) está {Math.abs(salaryPosition.difference).toFixed(0)}% 
                    {salaryPosition.difference > 0 ? ' acima' : ' abaixo'} da mediana de mercado
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`border-${matchingBenchmark.demandLevel === 'alta' ? 'green' : matchingBenchmark.demandLevel === 'média' ? 'yellow' : 'orange'}-500`}
                    >
                      Demanda {matchingBenchmark.demandLevel}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`border-${matchingBenchmark.marketTrend === 'crescendo' ? 'green' : matchingBenchmark.marketTrend === 'estável' ? 'blue' : 'red'}-500`}
                    >
                      Mercado {matchingBenchmark.marketTrend}
                    </Badge>
                  </div>
                </div>
                {salaryPosition.status === 'low' && (
                  <Button
                    size="sm"
                    onClick={() => onSuggestionApply?.(
                      Math.round(matchingBenchmark.percentile25 * regionalBenchmark.salaryMultiplier),
                      Math.round(matchingBenchmark.percentile75 * regionalBenchmark.salaryMultiplier)
                    )}
                    className="bg-ravyz-blue hover:bg-ravyz-blue/90"
                  >
                    Ajustar Expectativa
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Distribuição Salarial */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-ravyz-blue" />
              Distribuição Salarial
            </h4>
            <div className="space-y-3">
              {[
                { label: "Entrada (P25)", value: matchingBenchmark.percentile25, color: "gray" },
                { label: "Mediana (P50)", value: matchingBenchmark.median, color: "blue" },
                { label: "Experiente (P75)", value: matchingBenchmark.percentile75, color: "green" },
                { label: "Elite (P90)", value: matchingBenchmark.percentile90, color: "purple" }
              ].map((tier, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${tier.color}-500`}></div>
                    <span className="text-sm text-gray-600">{tier.label}</span>
                  </div>
                  <span className="font-medium">R$ {tier.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderRegional = () => (
    <div className="space-y-4">
      {/* Ajuste Regional */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-ravyz-orange" />
          Análise Regional - {regionalBenchmark.city}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 border rounded-lg">
            <p className="text-xl font-bold text-ravyz-blue">
              R$ {regionalBenchmark.avgSalary.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Salário Médio</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <p className="text-xl font-bold text-ravyz-green">
              {((regionalBenchmark.salaryMultiplier - 1) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">vs São Paulo</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <p className="text-xl font-bold text-ravyz-purple">
              {regionalBenchmark.marketSize.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Profissionais</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <p className={`text-xl font-bold ${
              regionalBenchmark.demandLevel === 'alta' ? 'text-green-500' :
              regionalBenchmark.demandLevel === 'média' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {regionalBenchmark.demandLevel.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">Demanda</p>
          </div>
        </div>

        {/* Top Indústrias */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Principais Indústrias:</p>
          <div className="flex flex-wrap gap-2">
            {regionalBenchmark.topIndustries.map((industry, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Comparativo entre Cidades */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold text-gray-900 mb-4">Comparativo Nacional</h4>
        <div className="space-y-3">
          {regionalData
            .sort((a, b) => b.avgSalary - a.avgSalary)
            .map((region, index) => (
              <div 
                key={region.city} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  region.city === regionalBenchmark.city ? 'border-ravyz-blue bg-ravyz-blue/5' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    region.city === regionalBenchmark.city ? 'bg-ravyz-blue text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      region.city === regionalBenchmark.city ? 'text-ravyz-blue' : 'text-gray-900'
                    }`}>
                      {region.city}, {region.state}
                    </p>
                    <p className="text-sm text-gray-500">
                      Custo de vida: {(region.costOfLiving * 100).toFixed(0)}% de SP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {region.avgSalary.toLocaleString()}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      region.demandLevel === 'alta' ? 'border-green-500 text-green-500' :
                      region.demandLevel === 'média' ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'
                    }`}
                  >
                    {region.demandLevel}
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-ravyz-green" />
          Benchmarking por Empresas
        </h4>
        <div className="space-y-4">
          {companyBenchmarks.map((company, index) => (
            <div key={index} className="border rounded-lg p-4 hover:border-ravyz-blue/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-gray-900">{company.name}</h5>
                  <p className="text-sm text-gray-600">{company.size}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-xs ${
                      company.type === 'startup' ? 'border-purple-500 text-purple-500' :
                      company.type === 'scale-up' ? 'border-blue-500 text-blue-500' :
                      company.type === 'corporate' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500'
                    }`}
                  >
                    {company.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    R$ {company.salaryRange.min.toLocaleString()} - R$ {company.salaryRange.max.toLocaleString()}
                  </p>
                  <p className="text-sm text-ravyz-green font-medium">+{company.growth}% growth</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Benefícios:</p>
                  <ul className="text-gray-600 space-y-1">
                    {company.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-ravyz-blue rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Cultura:</p>
                  <p className="text-gray-600">{company.culture}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!matchingBenchmark) {
    return (
      <Card className="p-6 bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-900">Dados de benchmarking não encontrados</h4>
            <p className="text-sm text-gray-600">
              Complete as informações de cargo, nível e indústria para ver análises detalhadas
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="p-6 border-2 border-ravyz-blue/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-ravyz-green" />
                Benchmarking Salarial
              </h3>
              <p className="text-gray-600 mt-1">
                {matchingBenchmark.position} {matchingBenchmark.level} - {matchingBenchmark.industry}
              </p>
              <p className="text-sm text-gray-500">
                Última atualização: {matchingBenchmark.lastUpdate} • {matchingBenchmark.sample.toLocaleString()} profissionais
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dados baseados em pesquisas salariais reais</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Regional
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">{renderOverview()}</TabsContent>
            <TabsContent value="regional">{renderRegional()}</TabsContent>
            <TabsContent value="companies">{renderCompanies()}</TabsContent>
          </Tabs>

          {/* Recomendações Rápidas */}
          {matchingBenchmark && onSuggestionApply && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-ravyz-orange" />
                Sugestões Rápidas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionApply(
                    Math.round(matchingBenchmark.percentile25 * regionalBenchmark.salaryMultiplier),
                    Math.round(matchingBenchmark.median * regionalBenchmark.salaryMultiplier)
                  )}
                  className="text-left justify-start flex-col h-auto p-3"
                >
                  <p className="font-medium text-xs">Conservador</p>
                  <p className="text-xs text-gray-500">P25 - Mediana</p>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionApply(
                    Math.round(matchingBenchmark.median * regionalBenchmark.salaryMultiplier),
                    Math.round(matchingBenchmark.percentile75 * regionalBenchmark.salaryMultiplier)
                  )}
                  className="text-left justify-start flex-col h-auto p-3"
                >
                  <p className="font-medium text-xs">Competitivo</p>
                  <p className="text-xs text-gray-500">Mediana - P75</p>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionApply(
                    Math.round(matchingBenchmark.percentile75 * regionalBenchmark.salaryMultiplier),
                    Math.round(matchingBenchmark.percentile90 * regionalBenchmark.salaryMultiplier)
                  )}
                  className="text-left justify-start flex-col h-auto p-3"
                >
                  <p className="font-medium text-xs">Ambicioso</p>
                  <p className="text-xs text-gray-500">P75 - P90</p>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionApply(
                    Math.round(matchingBenchmark.percentile25 * regionalBenchmark.salaryMultiplier),
                    Math.round(matchingBenchmark.percentile75 * regionalBenchmark.salaryMultiplier)
                  )}
                  className="text-left justify-start flex-col h-auto p-3"
                >
                  <p className="font-medium text-xs">Mercado</p>
                  <p className="text-xs text-gray-500">Faixa Padrão</p>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}