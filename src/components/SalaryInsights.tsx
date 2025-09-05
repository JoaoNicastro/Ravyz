import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, BarChart3, MapPin, Building2, Users, Award, Target, Lightbulb, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SalaryInsightsProps {
  candidateData: any;
}

export function SalaryInsights({ candidateData }: SalaryInsightsProps) {
  const [selectedComparison, setSelectedComparison] = useState<'market' | 'peers' | 'growth'>('market');

  // Dados simulados baseados no perfil do candidato
  const salaryInsights = {
    current: candidateData?.matching?.currentJob?.currentSalaryMax || 12000,
    market: {
      median: 15000,
      percentile25: 12000,
      percentile75: 18000,
      percentile90: 22000,
      growth: 15
    },
    peers: {
      median: 14500,
      topPerformers: 19000,
      newHires: 13000,
      experienced: 17500
    },
    projections: {
      nextYear: 16500,
      in3Years: 22000,
      withPromotion: 25000,
      withSkillUpgrade: 20000
    },
    recommendations: [
      {
        type: 'skill',
        title: 'Certificação em Product Management',
        impact: '+R$ 3.000',
        timeframe: '6 meses',
        priority: 'alta'
      },
      {
        type: 'experience',
        title: 'Liderança de equipe técnica',
        impact: '+R$ 5.000',
        timeframe: '12 meses',
        priority: 'alta'
      },
      {
        type: 'industry',
        title: 'Migração para Fintech',
        impact: '+R$ 4.000',
        timeframe: '3 meses',
        priority: 'média'
      }
    ]
  };

  const getPositionVsMarket = () => {
    const difference = ((salaryInsights.current - salaryInsights.market.median) / salaryInsights.market.median) * 100;
    
    if (difference >= 10) return { status: 'above', color: 'ravyz-green', message: 'Acima do mercado' };
    if (difference <= -10) return { status: 'below', color: 'ravyz-orange', message: 'Abaixo do mercado' };
    return { status: 'market', color: 'ravyz-blue', message: 'Na média do mercado' };
  };

  const position = getPositionVsMarket();

  const renderMarketComparison = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white rounded-lg border">
          <p className="text-2xl font-bold text-ravyz-blue">
            R$ {salaryInsights.market.median.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Mediana de Mercado</p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <p className="text-2xl font-bold text-gray-700">
            R$ {salaryInsights.current.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Seu Salário Atual</p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <p className="text-2xl font-bold text-ravyz-green">
            +{salaryInsights.market.growth}%
          </p>
          <p className="text-sm text-gray-500">Crescimento Anual</p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <p className="text-2xl font-bold text-ravyz-purple">
            R$ {salaryInsights.market.percentile90.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Top 10%</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg border-2 border-${position.color}/20 bg-${position.color}/5`}>
        <div className="flex items-center gap-3">
          {position.status === 'above' && <TrendingUp className={`w-5 h-5 text-${position.color}`} />}
          {position.status === 'below' && <TrendingDown className={`w-5 h-5 text-${position.color}`} />}
          {position.status === 'market' && <BarChart3 className={`w-5 h-5 text-${position.color}`} />}
          <div>
            <p className={`font-medium text-${position.color}`}>{position.message}</p>
            <p className="text-sm text-gray-600">
              Você está {Math.abs(((salaryInsights.current - salaryInsights.market.median) / salaryInsights.market.median) * 100).toFixed(0)}% 
              {salaryInsights.current > salaryInsights.market.median ? ' acima' : ' da'} mediana
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPeersComparison = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {[
          { label: 'Top Performers', value: salaryInsights.peers.topPerformers, description: '10% melhores' },
          { label: 'Você', value: salaryInsights.current, description: 'Sua posição atual', highlight: true },
          { label: 'Profissionais Experientes', value: salaryInsights.peers.experienced, description: '5+ anos exp.' },
          { label: 'Mediana dos Pares', value: salaryInsights.peers.median, description: 'Mesmo nível' },
          { label: 'Novos Contratados', value: salaryInsights.peers.newHires, description: 'Últimos 12 meses' }
        ].sort((a, b) => b.value - a.value).map((item, index) => (
          <div 
            key={item.label}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              item.highlight ? 'border-ravyz-blue bg-ravyz-blue/5' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                item.highlight ? 'bg-ravyz-blue text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className={`font-medium ${item.highlight ? 'text-ravyz-blue' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${item.highlight ? 'text-ravyz-blue' : 'text-gray-900'}`}>
                R$ {item.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrowthProjections = () => (
    <div className="space-y-4">
      <div className="grid gap-3">
        {[
          { 
            title: 'Projeção Próximo Ano', 
            value: salaryInsights.projections.nextYear, 
            increase: salaryInsights.projections.nextYear - salaryInsights.current,
            timeframe: '12 meses',
            description: 'Crescimento natural'
          },
          { 
            title: 'Com Promoção', 
            value: salaryInsights.projections.withPromotion, 
            increase: salaryInsights.projections.withPromotion - salaryInsights.current,
            timeframe: '18 meses',
            description: 'Promoção para Senior/Lead'
          },
          { 
            title: 'Com Upskilling', 
            value: salaryInsights.projections.withSkillUpgrade, 
            increase: salaryInsights.projections.withSkillUpgrade - salaryInsights.current,
            timeframe: '6-12 meses',
            description: 'Novas certificações'
          },
          { 
            title: 'Projeção 3 Anos', 
            value: salaryInsights.projections.in3Years, 
            increase: salaryInsights.projections.in3Years - salaryInsights.current,
            timeframe: '36 meses',
            description: 'Crescimento acelerado'
          }
        ].map((projection, index) => (
          <div key={index} className="p-4 border rounded-lg hover:border-ravyz-blue/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{projection.title}</h4>
              <div className="text-right">
                <p className="font-bold text-gray-900">R$ {projection.value.toLocaleString()}</p>
                <p className="text-sm text-ravyz-green font-medium">
                  +R$ {projection.increase.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{projection.description}</span>
              <span>{projection.timeframe}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-ravyz-green" />
            Insights Salariais
          </h3>
          <p className="text-sm text-gray-600">
            Análise detalhada da sua posição salarial no mercado
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {[
            { id: 'market', label: 'vs Mercado', icon: BarChart3 },
            { id: 'peers', label: 'vs Pares', icon: Users },
            { id: 'growth', label: 'Projeções', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedComparison(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                selectedComparison === tab.id
                  ? 'bg-white text-ravyz-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {selectedComparison === 'market' && renderMarketComparison()}
          {selectedComparison === 'peers' && renderPeersComparison()}
          {selectedComparison === 'growth' && renderGrowthProjections()}
        </div>

        {/* Recommendations */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-ravyz-orange" />
            Recomendações para Crescimento
          </h4>
          <div className="space-y-3">
            {salaryInsights.recommendations.map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                rec.priority === 'alta' 
                  ? 'border-ravyz-green bg-ravyz-green/5' 
                  : 'border-ravyz-blue bg-ravyz-blue/5'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Impacto potencial: <span className="font-medium text-ravyz-green">{rec.impact}</span> em {rec.timeframe}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      rec.priority === 'alta' 
                        ? 'border-ravyz-green text-ravyz-green' 
                        : 'border-ravyz-blue text-ravyz-blue'
                    }`}
                  >
                    {rec.priority === 'alta' ? 'Alta' : 'Média'} prioridade
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}