interface UltraSimpleTestProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  title: string;
}

export function UltraSimpleTest({ onComplete, onBack, title }: UltraSimpleTestProps) {
  console.log("🔥 UltraSimpleTest renderizado:", title);
  console.log("📦 Props recebidas:", { onComplete: typeof onComplete, onBack: typeof onBack });

  const handleNextClick = () => {
    console.log("🚀 ULTRA SIMPLE - Botão clicado!");
    
    const data = {
      test: "ultra-simple",
      title,
      timestamp: Date.now()
    };
    
    console.log("📤 Chamando onComplete com:", data);
    
    try {
      onComplete(data);
      console.log("✅ onComplete executado!");
    } catch (error) {
      console.error("❌ ERRO:", error);
    }
  };

  const handleBackClick = () => {
    console.log("⬅️ ULTRA SIMPLE - Voltar clicado!");
    try {
      onBack();
    } catch (error) {
      console.error("❌ ERRO no back:", error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#111',
          marginBottom: '16px'
        }}>
          {title}
        </h1>
        
        <p style={{
          color: '#666',
          marginBottom: '32px'
        }}>
          Teste ultra-simplificado usando HTML puro
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleNextClick}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#6C4DFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A3FE6';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#6C4DFF';
            }}
          >
            🚀 CONTINUAR (Ultra Simple)
          </button>
          
          <button
            onClick={handleBackClick}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ⬅️ Voltar
          </button>
        </div>
        
        <div style={{
          marginTop: '24px',
          fontSize: '12px',
          color: '#999',
          border: '1px solid #ddd',
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <div>📺 Componente: {title}</div>
          <div>🕐 {new Date().toLocaleTimeString()}</div>
          <div>📋 Abra o Console (F12) para logs</div>
        </div>
      </div>
    </div>
  );
}