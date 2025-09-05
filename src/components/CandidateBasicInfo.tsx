import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, User, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CandidateBasicInfoProps {
  onComplete: (data: {
    gender: string;
    ageRange: string;
  }) => void;
  onBack: () => void;
}

export function CandidateBasicInfo({ onComplete, onBack }: CandidateBasicInfoProps) {
  const [gender, setGender] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");

  const genderOptions = [
    { value: "masculine", label: "Masculino", icon: "👨" },
    { value: "feminine", label: "Feminino", icon: "👩" },
    { value: "indifferent", label: "Indiferente", icon: "👤" }
  ];

  const ageRangeOptions = [
    { value: "18-25", label: "18 a 25 anos" },
    { value: "26-30", label: "26 a 30 anos" },
    { value: "31-35", label: "31 a 35 anos" },
    { value: "36-40", label: "36 a 40 anos" },
    { value: "41-50", label: "41 a 50 anos" },
    { value: "51+", label: "51+ anos" },
    { value: "indifferent", label: "Indiferente" }
  ];

  const isFormValid = gender && ageRange;

  const handleNext = () => {
    if (isFormValid) {
      onComplete({
        gender,
        ageRange
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-ravyz-orange rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vamos conhecer você melhor
          </h1>
          <p className="text-gray-600">
            Compartilhe algumas informações básicas para personalizarmos sua experiência
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-ravyz-orange">
              <User className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Seleção de Gênero */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Como você se identifica?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {genderOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGender(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                      gender === option.value
                        ? "border-ravyz-orange bg-ravyz-orange/5 text-ravyz-orange"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Seleção de Faixa Etária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Qual sua faixa etária?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ageRangeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAgeRange(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      ageRange === option.value
                        ? "border-ravyz-orange bg-ravyz-orange/5 text-ravyz-orange"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isFormValid}
                className={`flex items-center gap-2 px-8 ${
                  isFormValid
                    ? "bg-ravyz-orange hover:bg-ravyz-orange/90 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Indicador de Progresso */}
            {!isFormValid && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Complete as seleções acima para continuar
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-ravyz-orange h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((gender ? 1 : 0) + (ageRange ? 1 : 0)) * 50}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer informativo */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Essas informações nos ajudam a personalizar as oportunidades para você
          </p>
        </div>
      </motion.div>
    </div>
  );
}