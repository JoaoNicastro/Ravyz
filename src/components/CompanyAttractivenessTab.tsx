import { motion } from "motion/react";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Crown,
  Sparkles,
  Trophy,
  Star
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export function CompanyAttractivenessTab() {
  return (
    <div className="space-y-8">
      {/* Header com resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-orange/5 to-ravyz-orange/10 border-l-4 border-l-ravyz-orange">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Competitividade Salarial</p>
                <p className="text-2xl font-bold text-ravyz-orange">68%</p>
              </div>
              <div className="w-12 h-12 bg-ravyz-orange/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-ravyz-orange" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Acima do mercado em 60% dos cargos
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50/5 to-red-100/10 border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Risco de Turnover</p>
                <p className="text-2xl font-bold text-red-600">11.6%</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              22 funcionários em risco
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-ravyz-purple/5 to-ravyz-purple/10 border-l-4 border-l-ravyz-purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Profissionais Estrelas</p>
                <p className="text-2xl font-bold text-ravyz-purple">4</p>
              </div>
              <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-ravyz-purple" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Com potencial de liderança
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Salarial vs Concorrentes */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-ravyz-orange" />
            Competitividade Salarial vs Mercado
          </CardTitle>
          <CardDescription>
            Comparação dos salários oferecidos pela empresa vs médias do mercado por cargo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                  <XAxis 
                    dataKey="cargo" 
                    stroke="#8A8A8A" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#8A8A8A" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E8E8E8', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="nossaSalario" fill="#FF7A00" name="Nossa Empresa" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="mercado" fill="#E8E8E8" name="Média do Mercado" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {salaryComparisonData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.cargo}</h4>
                    <Badge 
                      variant={item.diferenca > 0 ? "default" : "destructive"}
                      className={item.diferenca > 0 ? "bg-ravyz-green text-white" : ""}
                    >
                      {item.diferenca > 0 ? "+" : ""}{item.diferenca.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Percentil: {item.percentil}</span>
                    <div className="flex items-center gap-1">
                      {item.diferenca > 0 ? (
                        <TrendingUp className="w-4 h-4 text-ravyz-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={item.diferenca > 0 ? "text-ravyz-green" : "text-red-500"}>
                        {item.diferenca > 0 ? "Acima" : "Abaixo"} do mercado
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predição de Turnover por Departamento */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Predição de Turnover por Departamento
          </CardTitle>
          <CardDescription>
            Análise preditiva de rotatividade baseada em fatores internos e externos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turnoverPredictionData.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{dept.departamento}</h3>
                  <Badge className={`${getRiskColor(dept.risco)} border`}>
                    {getRiskText(dept.risco)} Risco
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Turnover Atual:</span>
                    <span className="font-medium text-gray-900">{dept.turnoverAtual}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Predição 6 meses:</span>
                    <span className="font-medium text-gray-900">{dept.turnoverPredito}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funcionários em risco:</span>
                    <span className="font-medium text-red-600">{dept.emRisco}/{dept.funcionarios}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Principais fatores de risco:</p>
                  <div className="space-y-1">
                    {dept.fatoresRisco.map((fator, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {fator}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profissionais Estrelas */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-ravyz-purple" />
            Profissionais Estrelas - Potencial de Liderança
          </CardTitle>
          <CardDescription>
            Identificação de talentos com alto potencial para posições de liderança futura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {starProfessionalsData.map((professional, index) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-br from-ravyz-purple/5 to-ravyz-purple/10 rounded-lg p-6 border border-ravyz-purple/20"
              >
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-ravyz-purple/20 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-ravyz-purple" />
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{professional.foto}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{professional.nome}</h3>
                    <p className="text-sm text-gray-600">{professional.cargo}</p>
                    <p className="text-xs text-gray-500">{professional.departamento}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-ravyz-purple">{professional.pontuacao}</div>
                    <div className="text-xs text-gray-600">Pontuação</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-ravyz-green">{professional.engajamento}%</div>
                    <div className="text-xs text-gray-600">Engajamento</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Potencial de Carreira:</p>
                    <Badge className="bg-ravyz-purple text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      {professional.potencial}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Próximo Nível:</p>
                    <Badge variant="outline" className="border-ravyz-blue text-ravyz-blue">
                      {professional.proximoNivel}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Fatores de Destaque:</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.fatores.map((fator, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {fator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}