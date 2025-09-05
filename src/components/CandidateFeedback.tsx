import { useState } from "react";
import { motion } from "motion/react";
import { Star, TrendingUp, Users, Award, Eye, BarChart3, Target, Brain, Code, Heart, MessageSquare, ChevronRight, Trophy, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FeedbackData {
  id: string;
  skillType: 'hard' | 'soft';
  skillName: string;
  rating: number; // 1-5
  relationshipType: 'leader' | 'peer' | 'subordinate';
  weight: number; // 5 for leader, 3 for peer, 4 for subordinate
  comment?: string;
  timestamp: string;
}

interface SkillSummary {
  skillName: string;
  averageRating: number;
  weightedAverage: number;
  totalFeedbacks: number;
  breakdown: {
    leader: number;
    peer: number;
    subordinate: number;
  };
  trend: 'up' | 'down' | 'stable';
}

interface CandidateFeedbackProps {
  candidateData: any;
}

export function CandidateFeedback({ candidateData }: CandidateFeedbackProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'hard-skills' | 'soft-skills'>('overview');

  // Mock feedback data - em produção viria da API
  const mockFeedbacks: FeedbackData[] = [
    // Hard Skills
    { id: '1', skillType: 'hard', skillName: 'JavaScript', rating: 5, relationshipType: 'leader', weight: 5, comment: 'Excepcional domínio técnico', timestamp: '2024-01-15' },
    { id: '2', skillType: 'hard', skillName: 'JavaScript', rating: 4, relationshipType: 'peer', weight: 3, timestamp: '2024-01-18' },
    { id: '3', skillType: 'hard', skillName: 'JavaScript', rating: 5, relationshipType: 'subordinate', weight: 4, timestamp: '2024-01-20' },
    { id: '4', skillType: 'hard', skillName: 'React', rating: 4, relationshipType: 'leader', weight: 5, timestamp: '2024-01-15' },
    { id: '5', skillType: 'hard', skillName: 'React', rating: 5, relationshipType: 'peer', weight: 3, timestamp: '2024-01-19' },
    { id: '6', skillType: 'hard', skillName: 'Node.js', rating: 4, relationshipType: 'leader', weight: 5, timestamp: '2024-01-16' },
    { id: '7', skillType: 'hard', skillName: 'Python', rating: 3, relationshipType: 'peer', weight: 3, timestamp: '2024-01-17' },
    { id: '8', skillType: 'hard', skillName: 'SQL', rating: 4, relationshipType: 'leader', weight: 5, timestamp: '2024-01-15' },
    
    // Soft Skills
    { id: '9', skillType: 'soft', skillName: 'Liderança', rating: 5, relationshipType: 'subordinate', weight: 4, comment: 'Inspirador e motivador', timestamp: '2024-01-20' },
    { id: '10', skillType: 'soft', skillName: 'Liderança', rating: 4, relationshipType: 'leader', weight: 5, timestamp: '2024-01-15' },
    { id: '11', skillType: 'soft', skillName: 'Comunicação', rating: 5, relationshipType: 'peer', weight: 3, timestamp: '2024-01-18' },
    { id: '12', skillType: 'soft', skillName: 'Comunicação', rating: 4, relationshipType: 'leader', weight: 5, timestamp: '2024-01-15' },
    { id: '13', skillType: 'soft', skillName: 'Resolução de Problemas', rating: 5, relationshipType: 'leader', weight: 5, comment: 'Sempre encontra soluções criativas', timestamp: '2024-01-15' },
    { id: '14', skillType: 'soft', skillName: 'Trabalho em Equipe', rating: 5, relationshipType: 'peer', weight: 3, timestamp: '2024-01-19' },
    { id: '15', skillType: 'soft', skillName: 'Adaptabilidade', rating: 4, relationshipType: 'subordinate', weight: 4, timestamp: '2024-01-21' },
    { id: '16', skillType: 'soft', skillName: 'Criatividade', rating: 4, relationshipType: 'peer', weight: 3, timestamp: '2024-01-17' },
  ];

  const calculateSkillSummary = (skillName: string, skillType: 'hard' | 'soft'): SkillSummary => {
    const skillFeedbacks = mockFeedbacks.filter(f => f.skillName === skillName && f.skillType === skillType);
    
    if (skillFeedbacks.length === 0) {
      return {
        skillName,
        averageRating: 0,
        weightedAverage: 0,
        totalFeedbacks: 0,
        breakdown: { leader: 0, peer: 0, subordinate: 0 },
        trend: 'stable'
      };
    }

    const totalRating = skillFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / skillFeedbacks.length;

    const weightedSum = skillFeedbacks.reduce((sum, f) => sum + (f.rating * f.weight), 0);
    const totalWeight = skillFeedbacks.reduce((sum, f) => sum + f.weight, 0);
    const weightedAverage = weightedSum / totalWeight;

    const breakdown = {
      leader: skillFeedbacks.filter(f => f.relationshipType === 'leader').length,
      peer: skillFeedbacks.filter(f => f.relationshipType === 'peer').length,
      subordinate: skillFeedbacks.filter(f => f.relationshipType === 'subordinate').length,
    };

    return {
      skillName,
      averageRating,
      weightedAverage,
      totalFeedbacks: skillFeedbacks.length,
      breakdown,
      trend: weightedAverage >= 4.0 ? 'up' : weightedAverage >= 3.0 ? 'stable' : 'down'
    };
  };

  const hardSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
  const softSkills = ['Liderança', 'Comunicação', 'Resolução de Problemas', 'Trabalho em Equipe', 'Adaptabilidade', 'Criatividade'];

  const hardSkillsSummary = hardSkills.map(skill => calculateSkillSummary(skill, 'hard'));
  const softSkillsSummary = softSkills.map(skill => calculateSkillSummary(skill, 'soft'));

  const overallHardSkillsAverage = hardSkillsSummary.reduce((sum, skill) => sum + skill.weightedAverage, 0) / hardSkillsSummary.length;
  const overallSoftSkillsAverage = softSkillsSummary.reduce((sum, skill) => sum + skill.weightedAverage, 0) / softSkillsSummary.length;
  const overallRating = (overallHardSkillsAverage + overallSoftSkillsAverage) / 2;

  const totalFeedbacks = mockFeedbacks.length;
  const currentRanking = Math.floor(Math.random() * 100) + 1; // Mock ranking
  const percentile = Math.round((1000 - currentRanking) / 1000 * 100);

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'leader': return '👔';
      case 'peer': return '🤝';
      case 'subordinate': return '📈';
      default: return '👤';
    }
  };

  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case 'leader': return 'Liderança';
      case 'peer': return 'Colegas';
      case 'subordinate': return 'Liderados';
      default: return 'Outros';
    }
  };

  const renderSkillCard = (skill: SkillSummary, type: 'hard' | 'soft') => (
    <motion.div
      key={skill.skillName}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{skill.skillName}</h4>
          <p className="text-sm text-gray-600">{skill.totalFeedbacks} avaliações</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-ravyz-orange fill-current" />
            <span className="font-bold text-gray-900">{skill.weightedAverage.toFixed(1)}</span>
          </div>
          {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-ravyz-green" />}
          {skill.trend === 'stable' && <Target className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Rating Ponderado</span>
          <span className="font-medium">{skill.weightedAverage.toFixed(1)}/5.0</span>
        </div>
        <Progress value={skill.weightedAverage * 20} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="font-medium text-gray-900">{skill.breakdown.leader}</div>
          <div className="text-gray-600">Líderes</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">{skill.breakdown.peer}</div>
          <div className="text-gray-600">Pares</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">{skill.breakdown.subordinate}</div>
          <div className="text-gray-600">Liderados</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-ravyz-purple to-ravyz-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Avaliações & Feedback</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Veja como seus colegas, líderes e liderados avaliam suas competências técnicas e comportamentais
        </p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid lg:grid-cols-4 gap-4"
      >
        <Card className="p-6 bg-gradient-to-br from-ravyz-orange/5 to-ravyz-orange/10 border-ravyz-orange/20">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-ravyz-orange" />
            <Badge className="bg-ravyz-orange/10 text-ravyz-orange border-ravyz-orange/20">
              Top {percentile}%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{overallRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Rating Geral</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-ravyz-blue" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{overallHardSkillsAverage.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Hard Skills</div>
            </div>
          </div>
          <Progress value={overallHardSkillsAverage * 20} className="h-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-ravyz-purple" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{overallSoftSkillsAverage.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Soft Skills</div>
            </div>
          </div>
          <Progress value={overallSoftSkillsAverage * 20} className="h-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-ravyz-green" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalFeedbacks}</div>
              <div className="text-sm text-gray-600">Avaliações</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Último mês: +{Math.floor(totalFeedbacks * 0.3)}</div>
        </Card>
      </motion.div>

      {/* Ranking Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-r from-ravyz-green/5 to-ravyz-blue/5 border-ravyz-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ravyz-green rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Posição no Ranking RAVYZ</h3>
                <p className="text-sm text-gray-600">
                  Você está na posição <span className="font-bold text-ravyz-green">#{currentRanking}</span> de 1.000+ candidatos
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-ravyz-green">Top {percentile}%</div>
              <div className="text-sm text-gray-600">Melhor que {percentile}% dos candidatos</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Skills Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumo</TabsTrigger>
            <TabsTrigger value="hard-skills">Hard Skills</TabsTrigger>
            <TabsTrigger value="soft-skills">Soft Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Distribuição de Avaliações</h3>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">👔</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {mockFeedbacks.filter(f => f.relationshipType === 'leader').length}
                  </div>
                  <div className="text-sm text-gray-600">Avaliações de Líderes</div>
                  <div className="text-xs text-gray-500 mt-1">Peso: 5 pontos</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {mockFeedbacks.filter(f => f.relationshipType === 'peer').length}
                  </div>
                  <div className="text-sm text-gray-600">Avaliações de Colegas</div>
                  <div className="text-xs text-gray-500 mt-1">Peso: 3 pontos</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {mockFeedbacks.filter(f => f.relationshipType === 'subordinate').length}
                  </div>
                  <div className="text-sm text-gray-600">Avaliações de Liderados</div>
                  <div className="text-xs text-gray-500 mt-1">Peso: 4 pontos</div>
                </div>
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Hard Skills</h3>
                <div className="space-y-3">
                  {hardSkillsSummary
                    .sort((a, b) => b.weightedAverage - a.weightedAverage)
                    .slice(0, 3)
                    .map((skill, index) => (
                      <div key={skill.skillName} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-ravyz-blue/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-ravyz-blue">{index + 1}</span>
                          </div>
                          <span className="font-medium">{skill.skillName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-ravyz-orange fill-current" />
                            <span className="font-bold">{skill.weightedAverage.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Soft Skills</h3>
                <div className="space-y-3">
                  {softSkillsSummary
                    .sort((a, b) => b.weightedAverage - a.weightedAverage)
                    .slice(0, 3)
                    .map((skill, index) => (
                      <div key={skill.skillName} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-ravyz-purple/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-ravyz-purple">{index + 1}</span>
                          </div>
                          <span className="font-medium">{skill.skillName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-ravyz-orange fill-current" />
                            <span className="font-bold">{skill.weightedAverage.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hard-skills" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              {hardSkillsSummary.map(skill => renderSkillCard(skill, 'hard'))}
            </div>
          </TabsContent>

          <TabsContent value="soft-skills" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              {softSkillsSummary.map(skill => renderSkillCard(skill, 'soft'))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-r from-ravyz-orange/5 to-ravyz-purple/5 border-ravyz-orange/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Solicitar Mais Avaliações</h3>
              <p className="text-sm text-gray-600">
                Convide colegas para avaliar suas competências e melhorar seu ranking
              </p>
            </div>
            <Button className="bg-ravyz-orange hover:bg-ravyz-orange/90">
              <Users className="w-4 h-4 mr-2" />
              Solicitar Feedback
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}