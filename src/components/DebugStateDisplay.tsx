interface DebugStateDisplayProps {
  currentState: string;
  userData: any;
  jobData: any;
  selectedProfile: string;
}

export function DebugStateDisplay({ currentState, userData, jobData, selectedProfile }: DebugStateDisplayProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#000',
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 DEBUG STATE</div>
      <div>🎬 State: {currentState}</div>
      <div>👤 UserData: {userData ? 'YES' : 'NO'}</div>
      <div>📋 JobData: {jobData ? 'YES' : 'NO'}</div>
      <div>🎯 Profile: {selectedProfile || 'none'}</div>
      <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}