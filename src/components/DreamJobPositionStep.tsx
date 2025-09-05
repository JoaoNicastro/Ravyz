import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface PositionStepProps {
  position: string;
  positionLevel: string;
  onPositionChange: (position: string) => void;
  onLevelChange: (level: string) => void;
}

const positionCategories = [
  {
    category: 'Tecnologia',
    icon: '💻',
    positions: [
      'Desenvolvedor Front-end', 'Desenvolvedor Back-end', 'Desenvolvedor Full-stack', 
      'Desenvolvedor Mobile', 'DevOps Engineer', 'Data Scientist', 'Data Analyst', 
      'Product Manager', 'UX/UI Designer', 'QA Engineer', 'Tech Lead', 
      'Arquiteto de Software', 'Engenheiro de Software', 'Scrum Master'
    ]
  },
  {
    category: 'Marketing',
    icon: '📢',
    positions: [
      'Marketing Manager', 'Growth Hacker', 'Social Media Manager', 'Content Manager',
      'Performance Marketing', 'Brand Manager', 'Marketing Analyst', 'SEO Specialist',
      'Email Marketing', 'Influencer Marketing', 'Trade Marketing', 'Product Marketing'
    ]
  },
  {
    category: 'Vendas',
    icon: '📈',
    positions: [
      'Account Executive', 'Sales Development Representative', 'Business Development',
      'Key Account Manager', 'Sales Manager', 'Inside Sales', 'Field Sales',
      'Channel Sales', 'Customer Success', 'Sales Operations', 'Pre-Sales'
    ]
  },
  {
    category: 'Financeiro',
    icon: '💰',
    positions: [
      'Analista Financeiro', 'Controller', 'CFO', 'Auditor', 'Analista de Crédito',
      'Gerente Financeiro', 'Treasury', 'FP&A', 'Risk Manager', 'Compliance',
      'Investment Banking', 'Wealth Management'
    ]
  },
  {
    category: 'Recursos Humanos',
    icon: '👥',
    positions: [
      'Recruiter', 'HR Business Partner', 'HR Generalist', 'People Manager',
      'Talent Acquisition', 'Training & Development', 'Compensation & Benefits',
      'HR Analytics', 'Employer Branding', 'People Operations'
    ]
  },
  {
    category: 'Operações',
    icon: '⚙️',
    positions: [
      'Operations Manager', 'Supply Chain', 'Logistics Manager', 'Process Improvement',
      'Quality Assurance', 'Project Manager', 'Business Analyst', 'Operations Analyst',
      'Lean Six Sigma', 'Procurement', 'Facilities Manager'
    ]
  },
  {
    category: 'Consultoria',
    icon: '🎯',
    positions: [
      'Management Consultant', 'Strategy Consultant', 'Business Consultant',
      'IT Consultant', 'HR Consultant', 'Financial Consultant', 'Digital Consultant',
      'Process Consultant', 'Change Management', 'Transformation Lead'
    ]
  },
  {
    category: 'Jurídico',
    icon: '⚖️',
    positions: [
      'Advogado Corporativo', 'Legal Counsel', 'Compliance Officer', 'Contract Manager',
      'Intellectual Property', 'Regulatory Affairs', 'Data Privacy Officer',
      'Legal Operations', 'Litigation', 'M&A Legal'
    ]
  }
];

const positionLevels = [
  'Estagiário', 'Trainee', 'Júnior', 'Pleno', 'Sênior', 
  'Especialista', 'Coordenador', 'Gerente', 'Diretor', 'C-Level'
];

export function DreamJobPositionStep({ position, positionLevel, onPositionChange, onLevelChange }: PositionStepProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = positionCategories.map(category => ({
    ...category,
    positions: category.positions.filter(pos => 
      pos.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.positions.length > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
          <Briefcase className="w-8 h-8 text-ravyz-purple" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargo dos Sonhos</h2>
        <p className="text-gray-600">
          Selecione o cargo desejado e o nível de senioridade
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Seleção de Cargo */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargo Desejado</h3>
              <p className="text-sm text-gray-600 mb-4">Escolha o cargo que mais se alinha com seus objetivos profissionais</p>
              
              {/* Cargo selecionado */}
              {position && (
                <div className="mb-4 p-3 bg-ravyz-purple/5 border border-ravyz-purple/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ravyz-purple">Cargo selecionado: {position}</span>
                    <Badge variant="secondary" className="bg-ravyz-purple text-white">
                      Selecionado
                    </Badge>
                  </div>
                </div>
              )}

              {/* Barra de busca */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ravyz-purple focus:border-transparent"
                />
              </div>
            </div>

            {/* Categorias de cargo */}
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div key={category.category} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.positions.length} cargos
                      </Badge>
                    </div>
                    {expandedCategories.has(category.category) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedCategories.has(category.category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-4 bg-white"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {category.positions.map((pos) => (
                          <button
                            key={pos}
                            onClick={() => onPositionChange(pos)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                              position === pos
                                ? 'bg-ravyz-purple text-white border-ravyz-purple'
                                : 'border-gray-200 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Seleção de Nível */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nível de Senioridade</h3>
              <p className="text-sm text-gray-600 mb-4">Selecione o nível que corresponde à sua experiência e expectativas</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {positionLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => onLevelChange(level)}
                  className={`px-4 py-3 rounded-xl border transition-all font-medium ${
                    positionLevel === level
                      ? 'bg-ravyz-purple text-white border-ravyz-purple'
                      : 'border-gray-300 hover:border-ravyz-purple hover:bg-ravyz-purple/5'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Resumo da seleção */}
        {position && positionLevel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-ravyz-purple/5 border-ravyz-purple/20">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Seu cargo dos sonhos:</p>
                <p className="text-lg font-semibold text-ravyz-purple">
                  {position} - Nível {positionLevel}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}