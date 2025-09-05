import { useEffect, useRef, useState } from 'react';

interface StateMonitorProps {
  currentState: string;
  userData: any;
  selectedProfile: string;
}

export function StateMonitor({ currentState, userData, selectedProfile }: StateMonitorProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const previousState = useRef<string>();
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const timestamp = new Date().toLocaleTimeString();
    const elapsed = ((Date.now() - startTime.current) / 1000).toFixed(1);
    
    let newLog = `[${elapsed}s] #${renderCount.current} Estado: ${currentState}`;
    
    if (previousState.current && previousState.current !== currentState) {
      newLog = `🚨 [${elapsed}s] MUDANÇA: ${previousState.current} → ${currentState}`;
      console.log(`🔥 ESTADO MUDOU! ${previousState.current} → ${currentState}`);
    }
    
    setLogs(prev => [...prev.slice(-9), newLog]); // Mantém últimos 10 logs
    previousState.current = currentState;
  }, [currentState, userData, selectedProfile]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: '#FF7A00',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 9998
        }}
      >
        📊 Mostrar Monitor
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'white',
      border: '2px solid #FF7A00',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '11px',
      fontFamily: 'monospace',
      maxWidth: '350px',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
      }}>
        <span style={{ fontWeight: 'bold', color: '#FF7A00' }}>📊 STATE MONITOR</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ marginBottom: '8px', fontSize: '10px', color: '#666' }}>
        <div>Renders: {renderCount.current}</div>
        <div>Profile: {selectedProfile || 'none'}</div>
        <div>User: {userData ? '✅' : '❌'}</div>
      </div>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        padding: '8px',
        fontSize: '10px'
      }}>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              color: log.includes('MUDANÇA') ? '#d00' : '#333',
              fontWeight: log.includes('MUDANÇA') ? 'bold' : 'normal',
              marginBottom: '2px'
            }}
          >
            {log}
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '8px',
        fontSize: '9px',
        color: '#999',
        textAlign: 'center'
      }}>
        Monitorando mudanças de estado em tempo real
      </div>
    </div>
  );
}