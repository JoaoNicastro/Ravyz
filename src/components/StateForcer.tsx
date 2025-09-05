import { useEffect, useRef } from 'react';

interface StateForcerProps {
  currentState: string;
  onForceState: (state: string) => void;
}

export function StateForcer({ currentState, onForceState }: StateForcerProps) {
  const stateRef = useRef(currentState);
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current += 1;
    stateRef.current = currentState;
    console.log(`🔄 StateForcer useEffect #${renderCountRef.current}:`, currentState);
  }, [currentState]);

  const forceToCandidate = () => {
    console.log("🚀 FORÇANDO mudança para candidate-registration");
    console.log("📊 Estado atual antes:", stateRef.current);
    
    // Usar requestAnimationFrame para garantir que o React processe
    requestAnimationFrame(() => {
      console.log("🎬 Frame 1 - Executando onForceState");
      onForceState("candidate-registration");
      
      requestAnimationFrame(() => {
        console.log("🎬 Frame 2 - Estado após força:", stateRef.current);
      });
    });
  };

  return (
    <div className="fixed top-4 left-4 bg-red-500 text-white p-3 rounded-lg z-50 space-y-2">
      <div className="font-bold">🔧 STATE FORCER</div>
      <div className="text-xs">Estado: {currentState}</div>
      <div className="text-xs">Renders: {renderCountRef.current}</div>
      <button
        onClick={forceToCandidate}
        className="bg-white text-red-500 px-2 py-1 rounded text-xs font-bold"
      >
        FORÇAR CANDIDATO
      </button>
    </div>
  );
}