import { motion } from "motion/react";
import { ArrowLeft, Target } from "lucide-react";

interface TestDreamJobBuilderProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function TestDreamJobBuilder({ onComplete, onBack }: TestDreamJobBuilderProps) {
  const handleComplete = () => {
    console.log("🧪 TestDreamJobBuilder - handleComplete chamado");
    const testData = {
      position: "Product Manager",
      company: "Empresa dos Sonhos",
      salary: "R$ 15.000",
      location: "São Paulo, SP",
      workMode: "hybrid"
    };
    console.log("🧪 Enviando dados:", testData);
    onComplete(testData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-ravyz-orange/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="font-bold text-white">RAVYZ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-ravyz-orange" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🧪 TESTE: Dream Job Builder
            </h1>
            <p className="text-gray-600 mb-8">
              Este é um componente de teste para verificar a navegação do Dream Job Builder.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">Status do teste:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ravyz-green rounded-full"></div>
                <span>✅ Navegação para Dream Job Builder bem-sucedida!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ravyz-green rounded-full"></div>
                <span>✅ Componente carregado corretamente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ravyz-green rounded-full"></div>
                <span>✅ Props funcionando corretamente</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-ravyz-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-ravyz-orange/90 transition-colors"
          >
            🚀 FINALIZAR E IR PARA CANDIDATE PAGE
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Clique no botão acima para testar a navegação para a página do candidato
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}