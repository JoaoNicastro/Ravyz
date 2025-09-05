import { useState, useEffect } from 'react';

type HashState = 'start' | 'profile' | 'candidate' | 'company' | 'success';

interface HashNavigationProps {
  onStateChange: (state: string) => void;
}

export function HashNavigation({ onStateChange }: HashNavigationProps) {
  const [currentHash, setCurrentHash] = useState<HashState>('start');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as HashState;
      console.log("🌐 Hash mudou para:", hash);
      setCurrentHash(hash || 'start');
      onStateChange(hash || 'start');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Verificar hash inicial
    const initialHash = window.location.hash.slice(1) as HashState;
    if (initialHash) {
      setCurrentHash(initialHash);
      onStateChange(initialHash);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onStateChange]);

  const navigateTo = (state: HashState) => {
    console.log("🚀 Navegando via hash para:", state);
    window.location.hash = state;
  };

  return (
    <div className="fixed top-20 left-4 bg-blue-800 text-white p-4 rounded-lg z-50 space-y-2">
      <div className="font-bold text-sm">🌐 HASH NAVIGATION</div>
      <div className="text-xs">Hash atual: {currentHash}</div>
      <div className="text-xs">URL: {window.location.hash}</div>
      
      <div className="space-y-1">
        <button
          onClick={() => navigateTo('start')}
          className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Start
        </button>
        <button
          onClick={() => navigateTo('profile')}
          className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Profile
        </button>
        <button
          onClick={() => navigateTo('candidate')}
          className="block w-full bg-green-600 px-2 py-1 rounded text-xs"
        >
          Candidate
        </button>
      </div>
    </div>
  );
}