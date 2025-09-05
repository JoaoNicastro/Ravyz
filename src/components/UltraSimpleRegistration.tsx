interface UltraSimpleRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function UltraSimpleRegistration({ onComplete, onBack }: UltraSimpleRegistrationProps) {
  console.log("🧪 UltraSimpleRegistration RENDERIZADO");
  
  const handleClick = () => {
    console.log("🚀 UltraSimpleRegistration - Botão clicado!");
    console.log("📞 Chamando onComplete...");
    
    const testData = { name: "Teste", email: "teste@teste.com" };
    console.log("📦 Dados:", testData);
    
    onComplete(testData);
    console.log("✅ onComplete chamado!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-ravyz-orange">
          🧪 TESTE ULTRA SIMPLES
        </h1>
        
        <div className="bg-gray-100 p-6 rounded-xl">
          <p className="text-lg mb-4">Componente UltraSimpleRegistration carregado!</p>
          <p className="text-sm text-gray-600">Se você está vendo isso, o componente renderizou corretamente.</p>
        </div>

        <button
          onClick={handleClick}
          className="bg-ravyz-orange text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-ravyz-orange/90"
        >
          🚀 PRÓXIMO PASSO
        </button>
        
        <button
          onClick={onBack}
          className="block mx-auto text-gray-500 hover:text-gray-700"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}