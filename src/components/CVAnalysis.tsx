import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, Edit2, X, Plus, Building2, Briefcase, Award, Calendar, Linkedin } from "lucide-react";
import { Badge } from "./ui/badge";
import { RavyzButton } from "./RavyzButton";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

interface ExtractedData {
  companies: string[];
  positions: string[];
  skills: string[];
  education: string[];
  experienceYears: number;
  industries: string[];
}

interface CVAnalysisProps {
  file: File | null;
  onDataExtracted: (data: ExtractedData) => void;
  onLinkedInImport?: () => void;
}

export function CVAnalysis({ file, onDataExtracted, onLinkedInImport }: CVAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    companies: [],
    positions: [],
    skills: [],
    education: [],
    experienceYears: 0,
    industries: []
  });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  // Simular análise de CV
  useEffect(() => {
    if (file && !analysisComplete) {
      setIsAnalyzing(true);
      
      // Simular tempo de processamento
      const timer = setTimeout(() => {
        // Dados simulados extraídos do CV
        const mockData: ExtractedData = {
          companies: ["Google", "Microsoft", "Startup XYZ"],
          positions: ["Desenvolvedor Frontend", "Engenheiro de Software", "Tech Lead"],
          skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "Agile"],
          education: ["Ciência da Computação - USP", "MBA em Gestão - FGV"],
          experienceYears: 5,
          industries: ["Tecnologia", "Fintech", "E-commerce"]
        };
        
        setExtractedData(mockData);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        onDataExtracted(mockData);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [file, onDataExtracted, analysisComplete]);

  const addItem = (section: keyof ExtractedData, item: string) => {
    if (Array.isArray(extractedData[section])) {
      setExtractedData(prev => ({
        ...prev,
        [section]: [...(prev[section] as string[]), item]
      }));
    }
    setNewItem("");
    setEditingSection(null);
  };

  const removeItem = (section: keyof ExtractedData, index: number) => {
    if (Array.isArray(extractedData[section])) {
      setExtractedData(prev => ({
        ...prev,
        [section]: (prev[section] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  const renderEditableSection = (
    title: string,
    section: keyof ExtractedData,
    icon: React.ReactNode,
    color: string
  ) => {
    const items = extractedData[section] as string[];
    const isEditing = editingSection === section;

    return (
      <div className="bg-white rounded-xl p-4 border border-ravyz-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}/10`}>
              {icon}
            </div>
            <h4 className="font-medium text-ravyz-black">{title}</h4>
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          </div>
          <button
            onClick={() => setEditingSection(isEditing ? null : section)}
            className="p-1 hover:bg-ravyz-gray-200 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4 text-ravyz-gray-500" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative"
            >
              <Badge 
                variant="secondary"
                className={`text-sm px-3 py-1 bg-${color}/10 text-${color} border-${color}/20 pr-8`}
              >
                {item}
                {isEditing && (
                  <button
                    onClick={() => removeItem(section, index)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-ravyz-gray-500 hover:text-red-500" />
                  </button>
                )}
              </Badge>
            </motion.div>
          ))}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Adicionar ${title.toLowerCase()}`}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newItem.trim()) {
                  addItem(section, newItem.trim());
                }
              }}
            />
            <RavyzButton
              size="sm"
              onClick={() => newItem.trim() && addItem(section, newItem.trim())}
              disabled={!newItem.trim()}
            >
              <Plus className="w-4 h-4" />
            </RavyzButton>
          </motion.div>
        )}
      </div>
    );
  };

  if (!file) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-gray-200 rounded-xl flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-ravyz-gray-500" />
        </div>
        <p className="text-ravyz-gray-500">
          Faça upload do seu CV para análise inteligente
        </p>
        
        {onLinkedInImport && (
          <div className="mt-6">
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-ravyz-gray-200"></div>
              <span className="text-sm text-ravyz-gray-500">ou</span>
              <div className="flex-1 h-px bg-ravyz-gray-200"></div>
            </div>
            
            <RavyzButton
              variant="outline"
              onClick={onLinkedInImport}
              className="w-full border-ravyz-blue text-ravyz-blue hover:bg-ravyz-blue hover:text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Importar do LinkedIn
            </RavyzButton>
          </div>
        )}
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-xl flex items-center justify-center mb-4"
        >
          <Briefcase className="w-8 h-8 text-ravyz-orange" />
        </motion.div>
        
        <h3 className="font-medium text-ravyz-black mb-2">
          Analisando seu currículo...
        </h3>
        <p className="text-sm text-ravyz-gray-500 mb-4">
          Nossa IA está extraindo suas informações profissionais
        </p>

        <div className="space-y-2 text-left max-w-xs mx-auto">
          {[
            "Identificando empresas e cargos",
            "Extraindo habilidades técnicas",
            "Analisando tempo de experiência",
            "Organizando informações educacionais"
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
              className="flex items-center gap-2 text-sm text-ravyz-gray-600"
            >
              <div className="w-2 h-2 bg-ravyz-orange rounded-full"></div>
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (analysisComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header de Sucesso */}
        <div className="text-center bg-ravyz-green/10 p-4 rounded-xl border border-ravyz-green/20">
          <CheckCircle className="w-8 h-8 text-ravyz-green mx-auto mb-2" />
          <h3 className="font-medium text-ravyz-green mb-1">
            Análise Concluída!
          </h3>
          <p className="text-sm text-ravyz-gray-600">
            Encontramos <strong>{extractedData.experienceYears} anos de experiência</strong> e extraímos suas principais informações
          </p>
        </div>

        {/* Informações Extraídas */}
        <div className="space-y-4">
          {renderEditableSection(
            "Empresas",
            "companies",
            <Building2 className="w-4 h-4 text-ravyz-blue" />,
            "ravyz-blue"
          )}

          {renderEditableSection(
            "Cargos",
            "positions",
            <Briefcase className="w-4 h-4 text-ravyz-purple" />,
            "ravyz-purple"
          )}

          {renderEditableSection(
            "Habilidades",
            "skills",
            <Award className="w-4 h-4 text-ravyz-orange" />,
            "ravyz-orange"
          )}

          {renderEditableSection(
            "Formação",
            "education",
            <Calendar className="w-4 h-4 text-ravyz-green" />,
            "ravyz-green"
          )}
        </div>

        {/* Resumo da Experiência */}
        <div className="bg-ravyz-orange/10 p-4 rounded-xl border border-ravyz-orange/20">
          <h4 className="font-medium text-ravyz-orange mb-2">
            📊 Resumo do Perfil
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-ravyz-gray-500">Experiência:</span>
              <p className="font-medium text-ravyz-black">{extractedData.experienceYears} anos</p>
            </div>
            <div>
              <span className="text-ravyz-gray-500">Setores:</span>
              <p className="font-medium text-ravyz-black">
                {extractedData.industries.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-ravyz-blue/10 p-4 rounded-xl">
          <p className="text-sm text-ravyz-gray-700">
            <strong>💡 Dica:</strong> Revise e edite as informações acima clicando no ícone de edição. 
            Isso nos ajudará a encontrar vagas mais compatíveis com seu perfil.
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}