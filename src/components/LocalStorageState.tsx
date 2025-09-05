import { useState, useEffect } from 'react';

interface LocalStorageStateProps {
  currentReactState: string;
}

export function LocalStorageState({ currentReactState }: LocalStorageStateProps) {
  const [localState, setLocalState] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<'sync' | 'out-of-sync'>('sync');

  useEffect(() => {
    // Carregar estado inicial do localStorage
    const stored = localStorage.getItem('ravyz-state') || 'login-selection';
    setLocalState(stored);
    console.log("💾 Estado carregado do localStorage:", stored);
  }, []);

  useEffect(() => {
    // Verificar se React state e localStorage estão sincronizados
    const stored = localStorage.getItem('ravyz-state') || 'login-selection';
    setSyncStatus(currentReactState === stored ? 'sync' : 'out-of-sync');
  }, [currentReactState, localState]);

  const updateLocalStorage = (newState: string) => {
    console.log("💾 Atualizando localStorage para:", newState);
    localStorage.setItem('ravyz-state', newState);
    setLocalState(newState);
  };

  const forceSync = () => {
    console.log("🔄 Forçando sincronização:", currentReactState);
    updateLocalStorage(currentReactState);
  };

  const forceReactSync = () => {
    console.log("🔄 Forçando React para estado localStorage:", localState);
    // Disparar evento customizado para forçar React a atualizar
    window.dispatchEvent(new CustomEvent('force-react-state', { 
      detail: { state: localState } 
    }));
  };

  return (
    <div className="fixed top-20 right-4 bg-purple-800 text-white p-4 rounded-lg z-50 space-y-2 max-w-xs">
      <div className="font-bold text-sm">💾 LOCALSTORAGE STATE</div>
      
      <div className="space-y-1 text-xs">
        <div>React: <span className="font-mono">{currentReactState}</span></div>
        <div>Local: <span className="font-mono">{localState}</span></div>
        <div className={`font-bold ${syncStatus === 'sync' ? 'text-green-400' : 'text-red-400'}`}>
          {syncStatus === 'sync' ? '✅ Sincronizado' : '❌ Fora de sincronia'}
        </div>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => updateLocalStorage('candidate-registration')}
          className="block w-full bg-purple-600 px-2 py-1 rounded text-xs"
        >
          → Candidate (Local)
        </button>
        
        <button
          onClick={forceSync}
          className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
        >
          React → Local
        </button>
        
        <button
          onClick={forceReactSync}
          className="block w-full bg-green-600 px-2 py-1 rounded text-xs"
        >
          Local → React
        </button>
      </div>

      <div className="text-xs border-t border-purple-600 pt-2">
        <div>Timestamp: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}