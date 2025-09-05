import { Button } from "./ui/button";

interface TestSimpleFlowProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  title: string;
}

export function TestSimpleFlow({ onComplete, onBack, title }: TestSimpleFlowProps) {
  console.log("🧪 TestSimpleFlow renderizado:", title);
  console.log("📦 Props:", { onComplete: typeof onComplete, onBack: typeof onBack });

  const handleNext = () => {
    console.log("🚀 TestSimpleFlow - Botão clicado!");
    
    const testData = {
      test: true,
      timestamp: Date.now(),
      component: title
    };
    
    console.log("📤 Enviando dados:", testData);
    
    try {
      onComplete(testData);
      console.log("✅ onComplete executado com sucesso!");
    } catch (error) {
      console.error("❌ Erro:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        <p className="text-gray-600">
          Este é um componente de teste para verificar o fluxo.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            className="w-full bg-ravyz-purple hover:bg-ravyz-purple/90 text-white"
          >
            Continuar para próxima etapa
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Voltar
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Verifique o console do navegador para logs de debug
        </div>
      </div>
    </div>
  );
}