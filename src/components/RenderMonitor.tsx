import { useEffect, useRef, useState } from 'react';

interface RenderLog {
  id: number;
  timestamp: string;
  component: string;
  state: string;
  renderCount: number;
}

interface RenderMonitorProps {
  currentState: string;
}

export function RenderMonitor({ currentState }: RenderMonitorProps) {
  const [renderLogs, setRenderLogs] = useState<RenderLog[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    
    const logEntry: RenderLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      component: 'RenderMonitor',
      state: currentState,
      renderCount: renderCountRef.current
    };

    setRenderLogs(prev => [...prev.slice(-9), logEntry]); // Manter últimos 10
    
    console.log(`🎬 RENDER #${renderCountRef.current}: RenderMonitor com state: ${currentState}`);
  }, [currentState]);

  // Função para outros componentes registrarem renders
  useEffect(() => {
    const handleComponentRender = (event: CustomEvent) => {
      const { component, state, extra } = event.detail;
      
      const logEntry: RenderLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        component,
        state: state || currentState,
        renderCount: extra?.renderCount || 0
      };

      setRenderLogs(prev => [...prev.slice(-9), logEntry]);
      console.log(`🎬 RENDER REGISTRADO: ${component} (${state})`);
    };

    window.addEventListener('component-render', handleComponentRender as EventListener);
    return () => window.removeEventListener('component-render', handleComponentRender as EventListener);
  }, [currentState]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 left-4 bg-yellow-500 text-black p-2 rounded-full z-50"
      >
        🎬
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 bg-yellow-800 text-white p-4 rounded-lg z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-sm">🎬 RENDER MONITOR</div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs bg-yellow-700 px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {renderLogs.map(log => (
          <div key={log.id} className="text-xs border-b border-yellow-700 pb-1">
            <div className="flex justify-between">
              <span className="font-mono text-yellow-300">{log.timestamp}</span>
              <span className="text-yellow-400">#{log.renderCount}</span>
            </div>
            <div className="font-bold text-white">{log.component}</div>
            <div className="text-yellow-200">{log.state}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs border-t border-yellow-700 pt-2">
        <div>Total renders: {renderLogs.length}</div>
        <div>Estado atual: <span className="font-bold text-yellow-300">{currentState}</span></div>
      </div>
    </div>
  );
}

// Hook para outros componentes registrarem renders
export function useRenderLogger(componentName: string, state?: string) {
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current += 1;
    
    window.dispatchEvent(new CustomEvent('component-render', {
      detail: {
        component: componentName,
        state,
        extra: { renderCount: renderCountRef.current }
      }
    }));
  });
  
  return renderCountRef.current;
}