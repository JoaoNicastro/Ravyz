interface DirectStateTestProps {
  currentState: string;
  setCurrentState: (state: any) => void;
}

export function DirectStateTest({ currentState, setCurrentState }: DirectStateTestProps) {
  const states = [
    "login-selection",
    "profile-selection", 
    "candidate-registration",
    "dream-job-builder",
    "candidate-page"
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-ravyz-orange">🧪 TESTE DIRETO DE ESTADO</h1>
        
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="font-bold mb-2">Estado Atual:</p>
          <p className="text-xl text-ravyz-purple">{currentState}</p>
        </div>

        <div className="space-y-3">
          <p className="font-bold">Testar navegação direta:</p>
          {states.map(state => (
            <button
              key={state}
              onClick={() => {
                console.log(`🧪 Mudando estado diretamente para: ${state}`);
                setCurrentState(state);
              }}
              className={`block w-full px-4 py-2 rounded-xl font-medium transition-colors ${
                currentState === state 
                  ? 'bg-ravyz-orange text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500 mt-6">
          <p>Use os botões acima para testar mudanças de estado diretas.</p>
          <p>Isso vai ajudar a identificar se o problema é no setState ou nos componentes.</p>
        </div>
      </div>
    </div>
  );
}