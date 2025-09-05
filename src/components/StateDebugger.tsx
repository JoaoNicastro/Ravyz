interface StateDebuggerProps {
  currentState: string;
  selectedProfile: string;
  userData: any;
  jobData: any;
}

export function StateDebugger({ currentState, selectedProfile, userData, jobData }: StateDebuggerProps) {
  // Só mostrar em desenvolvimento - em produção isso seria removido
  const isDev = process.env.NODE_ENV === 'development' || true; // Para debug temporário
  
  if (!isDev) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs font-mono z-50 max-w-48 backdrop-blur-sm">
      <div className="text-ravyz-orange mb-1">🐛 Debug</div>
      <div className="space-y-0.5 text-xs">
        <div className="truncate">{currentState}</div>
        <div className="flex gap-2">
          <span>{userData ? '👤' : '❌'}</span>
          <span>{selectedProfile ? '✓' : '○'}</span>
          <span>{jobData ? '🎯' : '○'}</span>
        </div>
      </div>
    </div>
  );
}