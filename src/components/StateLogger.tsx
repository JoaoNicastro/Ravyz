import { useState, useEffect } from 'react';

interface StateLoggerProps {
  currentState: string;
}

interface LogEntry {
  id: number;
  timestamp: string;
  state: string;
  action: string;
}

export function StateLogger({ currentState }: StateLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      state: currentState,
      action: 'STATE_CHANGE'
    };
    
    setLogs(prev => [...prev.slice(-4), newLog]); // Manter apenas os últimos 5 logs
    
    console.log(`📋 StateLogger capturou mudança: ${currentState}`);
  }, [currentState]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-2 rounded-full z-50"
      >
        📋
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-900 text-white p-4 rounded-lg z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-sm">📋 STATE LOG</div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs bg-blue-700 px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        {logs.map(log => (
          <div key={log.id} className="text-xs font-mono">
            <div className="text-blue-300">{log.timestamp}</div>
            <div className={`font-bold ${
              log.state === 'candidate-registration' ? 'text-green-400' :
              log.state === 'profile-selection' ? 'text-yellow-400' :
              'text-white'
            }`}>
              {log.state}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs border-t border-blue-700 pt-2">
        <div>Current: <span className="font-bold text-blue-300">{currentState}</span></div>
        <div>Total logs: {logs.length}</div>
      </div>
    </div>
  );
}