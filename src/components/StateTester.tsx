interface StateTesterProps {
  currentState: string;
  onChangeState: (newState: string) => void;
}

export function StateTester({ currentState, onChangeState }: StateTesterProps) {
  console.log("🧪 StateTester renderizado com estado:", currentState);

  const states = [
    "login-selection",
    "login", 
    "profile-selection",
    "candidate-registration",
    "dream-job-builder",
    "candidate-page",
    "job-builder"
  ];

  const handleStateChange = (newState: string) => {
    console.log("🔄 StateTester: Mudando estado de", currentState, "para", newState);
    onChangeState(newState);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '10px',
      backgroundColor: '#fff',
      border: '2px solid #000',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '250px',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>🧪 STATE TESTER</div>
      <div style={{ marginBottom: '12px' }}>📍 Atual: {currentState}</div>
      
      <div style={{ display: 'grid', gap: '4px' }}>
        {states.map(state => (
          <button
            key={state}
            onClick={() => handleStateChange(state)}
            style={{
              padding: '6px 8px',
              backgroundColor: currentState === state ? '#6C4DFF' : '#f0f0f0',
              color: currentState === state ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            {state}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '12px', fontSize: '10px', color: '#666' }}>
        Clique para mudar estado manualmente
      </div>
    </div>
  );
}