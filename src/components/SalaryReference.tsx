import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Info, Lightbulb, MapPin, Building2, Briefcase, DollarSign, BarChart3 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SalaryReferenceProps {
  currentPosition?: string;
  currentLevel?: string;
  currentIndustry?: string;
  currentLocation?: string;
  selectedMin?: number;
  selectedMax?: number;
  onSuggestionApply?: (min: number, max: number) => void;
}

interface SalaryData {
  position: string;
  level: string;
  industry: string;
  location: string;
  min: number;
  max: number;
  median: number;
  percentile25: number;
  percentile75: number;
  growth: number;
  sample: number;
}

export function SalaryReference({
  currentPosition,
  currentLevel,
  currentIndustry,
  currentLocation,
  selectedMin,
  selectedMax,
  onSuggestionApply
}: SalaryReferenceProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Base de dados salarial simulada (em uma aplicação real viria de uma API)
  const salaryDatabase: SalaryData[] = [
    // Tecnologia
    { position: "Product Manager", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 6000, max: 9000, median: 7500, percentile25: 6500, percentile75: 8500, growth: 12, sample: 1250 },
    { position: "Product Manager", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 9000, max: 15000, median: 12000, percentile25: 10000, percentile75: 14000, growth: 15, sample: 2100 },
    { position: "Product Manager", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 15000, max: 25000, median: 20000, percentile25: 17000, percentile75: 23000, growth: 18, sample: 850 },
    
    { position: "Desenvolvedor", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 4000, max: 7000, median: 5500, percentile25: 4500, percentile75: 6500, growth: 10, sample: 3200 },
    { position: "Desenvolvedor", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 7000, max: 12000, median: 9500, percentile25: 8000, percentile75: 11000, growth: 13, sample: 2800 },
    { position: "Desenvolvedor", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 12000, max: 20000, median: 16000, percentile25: 14000, percentile75: 18000, growth: 16, sample: 1100 },
    
    // Fintech
    { position: "Product Manager", level: "Pleno", industry: "Fintech", location: "São Paulo", min: 10000, max: 16000, median: 13000, percentile25: 11000, percentile75: 15000, growth: 20, sample: 450 },
    { position: "Product Manager", level: "Sênior", industry: "Fintech", location: "São Paulo", min: 16000, max: 28000, median: 22000, percentile25: 18000, percentile75: 25000, growth: 22, sample: 280 },
    
    { position: "Analista", level: "Júnior", industry: "Fintech", location: "São Paulo", min: 4500, max: 7500, median: 6000, percentile25: 5000, percentile75: 7000, growth: 14, sample: 890 },
    { position: "Analista", level: "Pleno", industry: "Fintech", location: "São Paulo", min: 7500, max: 12000, median: 9750, percentile25: 8500, percentile75: 11000, growth: 17, sample: 650 },
    
    // Consultoria
    { position: "Consultor", level: "Júnior", industry: "Consultoria", location: "São Paulo", min: 5000, max: 8000, median: 6500, percentile25: 5500, percentile75: 7500, growth: 8, sample: 1500 },
    { position: "Consultor", level: "Pleno", industry: "Consultoria", location: "São Paulo", min: 8000, max: 14000, median: 11000, percentile25: 9000, percentile75: 13000, growth: 11, sample: 980 },
    { position: "Consultor", level: "Sênior", industry: "Consultoria", location: "São Paulo", min: 14000, max: 22000, median: 18000, percentile25: 16000, percentile75: 20000, growth: 13, sample: 420 },
    
    // Marketing
    { position: "Marketing", level: "Júnior", industry: "Tecnologia", location: "São Paulo", min: 3500, max: 6000, median: 4750, percentile25: 4000, percentile75: 5500, growth: 9, sample: 1800 },
    { position: "Marketing", level: "Pleno", industry: "Tecnologia", location: "São Paulo", min: 6000, max: 10000, median: 8000, percentile25: 7000, percentile75: 9000, growth: 12, sample: 1200 },
    { position: "Marketing", level: "Sênior", industry: "Tecnologia", location: "São Paulo", min: 10000, max: 16000, median: 13000, percentile25: 11500, percentile75: 15000, growth: 14, sample: 600 },
  ];

  const matchingSalaryData = useMemo(() => {
    if (!currentPosition || !currentLevel || !currentIndustry) return null;

    // Busca exata primeiro
    let match = salaryDatabase.find(data => 
      data.position.toLowerCase().includes(currentPosition.toLowerCase()) &&
      data.level === currentLevel &&
      data.industry === currentIndustry
    );

    // Se não encontrar, busca por posição e nível
    if (!match) {
      match = salaryDatabase.find(data => 
        data.position.toLowerCase().includes(currentPosition.toLowerCase()) &&
        data.level === currentLevel
      );
    }

    // Se ainda não encontrar, busca só por indústria e nível
    if (!match) {
      match = salaryDatabase.find(data => 
        data.industry === currentIndustry &&
        data.level === currentLevel
      );
    }

    return match;
  }, [currentPosition, currentLevel, currentIndustry]);

  const getSalaryAnalysis = () => {
    if (!matchingSalaryData || !selectedMin || !selectedMax) return null;

    const userMedian = (selectedMin + selectedMax) / 2;
    const marketMedian = matchingSalaryData.median;
    const difference = ((userMedian - marketMedian) / marketMedian) * 100;

    let status: 'low' | 'market' | 'high' = 'market';
    let message = '';
    let color = 'ravyz-blue';
    let icon = BarChart3;

    if (difference < -15) {
      status = 'low';
      message = 'Abaixo do mercado';
      color = 'ravyz-orange';
      icon = TrendingDown;
    } else if (difference > 15) {
      status = 'high';
      message = 'Acima do mercado';
      color = 'ravyz-green';
      icon = TrendingUp;
    } else {
      message = 'Dentro da média';
      color = 'ravyz-blue';
      icon = BarChart3;
    }

    return { difference, message, color, icon, status };
  };

  const getLocationAdjustment = () => {
    // Simulação de ajustes por localização
    const adjustments: Record<string, number> = {
      'São Paulo': 1.0,
      'Rio de Janeiro': 0.9,
      'Belo Horizonte': 0.8,
      'Porto Alegre': 0.85,
      'Recife': 0.75,
      'Brasília': 0.9,
      'Remoto': 0.95
    };

    return adjustments[currentLocation || 'São Paulo'] || 1.0;
  };

  const analysis = getSalaryAnalysis();
  const locationAdjustment = getLocationAdjustment();

  if (!matchingSalaryData) {
    return (
      <Card className="p-6 bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-900">Dados de mercado não encontrados</h4>
            <p className="text-sm text-gray-600">
              Complete as informações de cargo, nível e indústria para ver dados de referência
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Principal de Referência */}
      <Card className="p-6 border-2 border-ravyz-blue/20 bg-gradient-to-r from-ravyz-blue/5 to-white">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-ravyz-blue" />
                Referência de Mercado
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {matchingSalaryData.position} {matchingSalaryData.level} - {matchingSalaryData.industry}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-ravyz-blue hover:bg-ravyz-blue/10"
            >
              <Info className="w-4 h-4 mr-1" />
              {showDetails ? 'Ocultar' : 'Detalhes'}
            </Button>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-ravyz-blue">
                R$ {matchingSalaryData.median.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Mediana</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-semibold text-gray-700">
                R$ {matchingSalaryData.min.toLocaleString()} - R$ {matchingSalaryData.max.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Faixa Geral</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-semibold text-ravyz-green">
                +{matchingSalaryData.growth}%
              </p>
              <p className="text-xs text-gray-500">Crescimento anual</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-lg font-semibold text-gray-700">
                {matchingSalaryData.sample}
              </p>
              <p className="text-xs text-gray-500">Profissionais</p>
            </div>
          </div>

          {/* Análise da Seleção Atual */}
          {analysis && (
            <div className={`p-4 rounded-lg border-2 border-${analysis.color}/20 bg-${analysis.color}/5`}>
              <div className="flex items-center gap-3">
                <analysis.icon className={`w-5 h-5 text-${analysis.color}`} />
                <div className="flex-1">
                  <p className={`font-medium text-${analysis.color}`}>
                    {analysis.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sua faixa está {Math.abs(analysis.difference).toFixed(0)}% 
                    {analysis.difference > 0 ? ' acima' : ' abaixo'} da mediana de mercado
                  </p>
                </div>
                {analysis.status !== 'market' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSuggestionApply?.(
                      Math.round(matchingSalaryData.percentile25 * locationAdjustment),
                      Math.round(matchingSalaryData.percentile75 * locationAdjustment)
                    )}
                    className={`border-${analysis.color} text-${analysis.color} hover:bg-${analysis.color}/10`}
                  >
                    Ajustar
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Detalhes Expandidos */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-200"
            >
              {/* Distribuição Salarial */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Distribuição Salarial</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Percentil 25°</span>
                    <span className="font-medium">R$ {matchingSalaryData.percentile25.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mediana (50°)</span>
                    <span className="font-medium text-ravyz-blue">R$ {matchingSalaryData.median.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Percentil 75°</span>
                    <span className="font-medium">R$ {matchingSalaryData.percentile75.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ajuste por Localização */}
              {currentLocation && locationAdjustment !== 1.0 && (
                <div className="p-3 bg-ravyz-orange/10 rounded-lg border border-ravyz-orange/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-ravyz-orange" />
                    <span className="font-medium text-ravyz-orange">Ajuste por Localização</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Valores ajustados para <strong>{currentLocation}</strong> 
                    ({locationAdjustment > 1 ? '+' : ''}{((locationAdjustment - 1) * 100).toFixed(0)}% vs São Paulo)
                  </p>
                </div>
              )}

              {/* Sugestões Rápidas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sugestões Rápidas</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionApply?.(
                      Math.round(matchingSalaryData.percentile25 * locationAdjustment),
                      Math.round(matchingSalaryData.median * locationAdjustment)
                    )}
                    className="text-left justify-start"
                  >
                    <div>
                      <p className="font-medium">Conservador</p>
                      <p className="text-xs text-gray-500">P25 - Mediana</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionApply?.(
                      Math.round(matchingSalaryData.median * locationAdjustment),
                      Math.round(matchingSalaryData.percentile75 * locationAdjustment)
                    )}
                    className="text-left justify-start"
                  >
                    <div>
                      <p className="font-medium">Competitivo</p>
                      <p className="text-xs text-gray-500">Mediana - P75</p>
                    </div>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Dicas do Mentor */}
      {analysis?.status === 'low' && (
        <Card className="p-4 bg-ravyz-purple/5 border border-ravyz-purple/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-ravyz-purple mt-0.5" />
            <div>
              <h4 className="font-medium text-ravyz-purple mb-1">💡 Dica do Mentor</h4>
              <p className="text-sm text-gray-700">
                Sua faixa atual está abaixo do mercado. Considere destacar suas conquistas e resultados 
                em futuras negociações. Profissionais {matchingSalaryData.level} em {matchingSalaryData.industry} 
                têm boa margem para crescimento salarial.
              </p>
            </div>
          </div>
        </Card>
      )}

      {analysis?.status === 'high' && (
        <Card className="p-4 bg-ravyz-green/5 border border-ravyz-green/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-ravyz-green mt-0.5" />
            <div>
              <h4 className="font-medium text-ravyz-green mb-1">🎯 Dica do Mentor</h4>
              <p className="text-sm text-gray-700">
                Excelente! Você está bem posicionado no mercado. Isso demonstra o valor das suas 
                competências. Mantenha o foco no desenvolvimento contínuo para sustentar essa posição.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}