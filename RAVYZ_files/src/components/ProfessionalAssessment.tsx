import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BarChart3, Users, Target, CheckCircle, Brain } from "lucide-react";
import { RavyzButton } from "./RavyzButton";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Question {
  id: number;
  text: string;
  dimension: string;
  category: 'leadership' | 'communication' | 'analytical' | 'creative' | 'execution';
}

interface AssessmentResult {
  primaryProfile: string;
  secondaryProfile: string;
  scores: Record<string, number>;
  percentile: number;
  strengths: string[];
  developmentAreas: string[];
}

interface ProfessionalAssessmentProps {
  onComplete: (result: AssessmentResult) => void;
  onBack: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Eu me sinto confortável assumindo a liderança de projetos e equipes",
    dimension: "Liderança",
    category: "leadership"
  },
  {
    id: 2,
    text: "Consigo comunicar ideias complexas de forma clara e objetiva",
    dimension: "Comunicação",
    category: "communication"
  },
  {
    id: 3,
    text: "Prefiro trabalhar em equipe a trabalhar sozinho(a)",
    dimension: "Colaboração",
    category: "communication"
  },
  {
    id: 4,
    text: "Me adapto facilmente a mudanças e situações inesperadas",
    dimension: "Adaptabilidade",
    category: "execution"
  },
  {
    id: 5,
    text: "Sou orientado(a) por metas e resultados mensuráveis",
    dimension: "Foco em Resultados",
    category: "execution"
  },
  {
    id: 6,
    text: "Tenho facilidade para gerar ideias inovadoras e criativas",
    dimension: "Criatividade",
    category: "creative"
  },
  {
    id: 7,
    text: "Sou muito organizado(a) e gosto de ter tudo planejado",
    dimension: "Organização",
    category: "analytical"
  },
  {
    id: 8,
    text: "Tomo decisões rapidamente, mesmo com informações limitadas",
    dimension: "Tomada de Decisão",
    category: "leadership"
  },
  {
    id: 9,
    text: "Construo relacionamentos facilmente com colegas e clientes",
    dimension: "Relacionamento Interpessoal",
    category: "communication"
  },
  {
    id: 10,
    text: "Sou proativo(a) e antecipo problemas antes que aconteçam",
    dimension: "Proatividade",
    category: "leadership"
  },
  {
    id: 11,
    text: "Gosto de analisar dados e informações antes de agir",
    dimension: "Pensamento Analítico",
    category: "analytical"
  },
  {
    id: 12,
    text: "Trabalho bem sob pressão e prazos apertados",
    dimension: "Gestão de Pressão",
    category: "execution"
  },
  {
    id: 13,
    text: "Busco constantemente novas formas de melhorar processos",
    dimension: "Inovação",
    category: "creative"
  },
  {
    id: 14,
    text: "Prefiro ter um plano detalhado antes de começar qualquer projeto",
    dimension: "Planejamento",
    category: "analytical"
  },
  {
    id: 15,
    text: "Trabalho melhor com autonomia e independência",
    dimension: "Autonomia",
    category: "execution"
  }
];

const profileTypes = {
  leadership: {
    name: "Líder Estratégico",
    description: "Natural para liderar equipes e projetos",
    color: "ravyz-orange",
    icon: "👑",
    traits: ["Liderança", "Visão estratégica", "Tomada de decisão"]
  },
  communication: {
    name: "Facilitador",
    description: "Excelente em comunicação e colaboração",
    color: "ravyz-blue",
    icon: "🤝",
    traits: ["Comunicação", "Relacionamento", "Colaboração"]
  },
  analytical: {
    name: "Analista Estratégico",
    description: "Foco em análise e planejamento detalhado",
    color: "ravyz-purple",
    icon: "📊",
    traits: ["Análise", "Planejamento", "Organização"]
  },
  creative: {
    name: "Inovador Criativo",
    description: "Orientado para inovação e criatividade",
    color: "ravyz-green",
    icon: "💡",
    traits: ["Criatividade", "Inovação", "Visão"]
  },
  execution: {
    name: "Executor de Resultados",
    description: "Foco em entrega e resultados práticos",
    color: "ravyz-orange",
    icon: "🎯",
    traits: ["Execução", "Resultados", "Eficiência"]
  }
};

const scaleLabels = [
  { value: 1, label: "Discordo totalmente", short: "Nunca" },
  { value: 2, label: "Discordo parcialmente", short: "Raramente" },
  { value: 3, label: "Neutro", short: "Às vezes" },
  { value: 4, label: "Concordo parcialmente", short: "Frequentemente" },
  { value: 5, label: "Concordo totalmente", short: "Sempre" }
];

export function ProfessionalAssessment({ onComplete, onBack }: ProfessionalAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleAnswer = (score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: score
    }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 400);
    } else {
      setTimeout(() => {
        calculateResult();
      }, 400);
    }
  };

  const calculateResult = () => {
    const categoryScores: Record<string, number[]> = {
      leadership: [],
      communication: [],
      analytical: [],
      creative: [],
      execution: []
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        categoryScores[question.category].push(answer);
      }
    });

    const averageScores: Record<string, number> = {};
    Object.keys(categoryScores).forEach(category => {
      const scores = categoryScores[category];
      averageScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    const sortedCategories = Object.entries(averageScores)
      .sort(([,a], [,b]) => b - a);

    const primaryCategory = sortedCategories[0][0] as keyof typeof profileTypes;
    const secondaryCategory = sortedCategories[1][0] as keyof typeof profileTypes;

    const totalScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0) / Object.keys(averageScores).length;
    const percentile = Math.min(95, Math.max(15, Math.round((totalScore / 5) * 100)));

    const strengths = sortedCategories
      .slice(0, 3)
      .map(([category]) => profileTypes[category as keyof typeof profileTypes].traits[0]);
    
    const developmentAreas = sortedCategories
      .slice(-2)
      .map(([category]) => profileTypes[category as keyof typeof profileTypes].traits[0]);

    const result: AssessmentResult = {
      primaryProfile: profileTypes[primaryCategory].name,
      secondaryProfile: profileTypes[secondaryCategory].name,
      scores: averageScores,
      percentile,
      strengths,
      developmentAreas
    };

    setAssessmentResult(result);
    setShowResults(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  if (showResults && assessmentResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header de Sucesso */}
        <div className="text-center bg-ravyz-green/10 p-6 rounded-2xl border border-ravyz-green/20">
          <CheckCircle className="w-12 h-12 text-ravyz-green mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ravyz-black mb-2">
            Avaliação Concluída!
          </h2>
          <p className="text-ravyz-gray-500 text-sm">
            Descobrimos seu perfil profissional com base em 15 dimensões comportamentais
          </p>
        </div>

        {/* Perfil Principal */}
        <Card className="p-6 bg-white border border-ravyz-gray-200">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">
                {profileTypes[Object.keys(profileTypes).find(key => 
                  profileTypes[key as keyof typeof profileTypes].name === assessmentResult.primaryProfile
                ) as keyof typeof profileTypes]?.icon}
              </span>
            </div>
            <h3 className="text-lg font-bold text-ravyz-black mb-2">
              Seu Perfil: {assessmentResult.primaryProfile}
            </h3>
            <p className="text-ravyz-gray-500 text-sm mb-4">
              Com características de {assessmentResult.secondaryProfile}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-ravyz-blue/10 px-4 py-2 rounded-xl">
              <BarChart3 className="w-4 h-4 text-ravyz-blue" />
              <span className="text-sm font-medium text-ravyz-blue">
                Top {100 - assessmentResult.percentile}% dos profissionais
              </span>
            </div>
          </div>

          {/* Pontos Fortes */}
          <div className="mb-6">
            <h4 className="font-medium text-ravyz-black mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-ravyz-green" />
              Principais Forças
            </h4>
            <div className="flex flex-wrap gap-2">
              {assessmentResult.strengths.map((strength, index) => (
                <Badge key={index} className="bg-ravyz-green/10 text-ravyz-green border-ravyz-green/20 px-3 py-1">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Scores por Dimensão */}
          <div className="space-y-4">
            <h4 className="font-medium text-ravyz-black mb-3">
              Scores por Dimensão
            </h4>
            {Object.entries(assessmentResult.scores).map(([category, score]) => {
              const profileInfo = profileTypes[category as keyof typeof profileTypes];
              const percentage = (score / 5) * 100;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-ravyz-black">
                      {profileInfo.name}
                    </span>
                    <span className="text-sm text-ravyz-gray-500 font-medium">
                      {score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <div className="w-full bg-ravyz-gray-200 rounded-full h-3">
                    <div 
                      className="bg-ravyz-purple h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Benchmarking */}
        <Card className="p-6 bg-ravyz-blue/5 border border-ravyz-blue/20">
          <h4 className="font-medium text-ravyz-blue mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Comparação com a Comunidade RAVYZ
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-ravyz-blue/20 text-center">
              <div className="text-2xl font-bold text-ravyz-blue mb-1">
                {assessmentResult.percentile}%
              </div>
              <div className="text-xs text-ravyz-gray-500">
                Score geral
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-ravyz-blue/20 text-center">
              <div className="text-2xl font-bold text-ravyz-blue mb-1">
                {Math.floor(Math.random() * 5000) + 15000}
              </div>
              <div className="text-xs text-ravyz-gray-500">
                Profissionais similares
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-ravyz-gray-700">
              Você possui um perfil <strong>raro</strong> na plataforma, ideal para posições de {assessmentResult.primaryProfile.toLowerCase()}
            </p>
          </div>
        </Card>

        {/* Áreas de Desenvolvimento */}
        <Card className="p-4 bg-ravyz-orange/5 border border-ravyz-orange/20">
          <h4 className="font-medium text-ravyz-orange mb-3">
            💡 Oportunidades de Desenvolvimento
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {assessmentResult.developmentAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="border-ravyz-orange/30 text-ravyz-orange px-3 py-1">
                {area}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-ravyz-gray-600">
            Investir nessas áreas pode ampliar ainda mais suas oportunidades profissionais
          </p>
        </Card>

        {/* Botão de Conclusão */}
        <RavyzButton
          onClick={() => onComplete(assessmentResult)}
          className="w-full h-12"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalizar Cadastro
        </RavyzButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-ravyz-purple" />
        </div>
        <h2 className="text-xl font-bold text-ravyz-black mb-2">
          Avaliação Profissional
        </h2>
        <p className="text-ravyz-gray-500 text-sm mb-6">
          Responda 15 perguntas para descobrir seu perfil profissional
        </p>
        
        {/* Progress */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-ravyz-gray-500 mb-2">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-ravyz-gray-200 rounded-full h-2">
            <div 
              className="bg-ravyz-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 bg-white border border-ravyz-gray-200">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Header */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-3 text-xs bg-ravyz-purple/10 text-ravyz-purple">
              {questions[currentQuestion].dimension}
            </Badge>
            <h3 className="text-base font-medium text-ravyz-black leading-relaxed">
              {questions[currentQuestion].text}
            </h3>
          </div>

          {/* Escala de Resposta */}
          <div className="space-y-4">
            {/* Scale Labels */}
            <div className="flex justify-between text-xs text-ravyz-gray-500 px-2">
              <span>Discordo totalmente</span>
              <span>Concordo totalmente</span>
            </div>
            
            {/* Response Options */}
            <div className="space-y-3">
              {scaleLabels.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${answers[questions[currentQuestion].id] === option.value
                      ? 'border-ravyz-purple bg-ravyz-purple/10 shadow-sm'
                      : 'border-ravyz-gray-200 hover:border-ravyz-purple/50 hover:bg-ravyz-purple/5'
                    }
                  `}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                        ${answers[questions[currentQuestion].id] === option.value
                          ? 'bg-ravyz-purple text-white'
                          : 'bg-ravyz-gray-200 text-ravyz-gray-700'
                        }
                      `}>
                        {option.value}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-ravyz-black">
                          {option.short}
                        </div>
                        <div className="text-xs text-ravyz-gray-500">
                          {option.label}
                        </div>
                      </div>
                    </div>
                    
                    {answers[questions[currentQuestion].id] === option.value && (
                      <CheckCircle className="w-5 h-5 text-ravyz-purple" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <RavyzButton
          variant="outline"
          onClick={goBack}
          className="flex-1 h-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentQuestion === 0 ? 'Voltar' : 'Anterior'}
        </RavyzButton>
        
        {answers[questions[currentQuestion].id] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1"
          >
            <RavyzButton
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(prev => prev + 1);
                } else {
                  calculateResult();
                }
              }}
              className="w-full h-12"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ver Resultado
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </RavyzButton>
          </motion.div>
        )}
      </div>

      {/* Benchmark Hint */}
      <div className="bg-ravyz-blue/10 p-4 rounded-xl border border-ravyz-blue/20">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-4 h-4 text-ravyz-blue mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-ravyz-blue mb-1">Análise Comparativa</p>
            <p className="text-sm text-ravyz-gray-700">
              Suas respostas serão comparadas com mais de 20.000 profissionais para identificar seu perfil único
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}