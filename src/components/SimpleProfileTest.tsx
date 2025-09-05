interface SimpleProfileTestProps {
  onSelect: (type: 'candidate' | 'company') => void;
  onBack: () => void;
}

export function SimpleProfileTest({ onSelect, onBack }: SimpleProfileTestProps) {
  console.log("🎯 SimpleProfileTest renderizado");
  console.log("📦 Props:", { onSelect: typeof onSelect, onBack: typeof onBack });

  const handleCandidateClick = () => {
    console.log("🚀 CANDIDATO clicado!");
    console.log("⏰ Timestamp:", new Date().toISOString());
    
    try {
      console.log("📞 Chamando onSelect('candidate')...");
      onSelect('candidate');
      console.log("✅ onSelect('candidate') executado!");
    } catch (error) {
      console.error("❌ ERRO:", error);
    }
  };

  const handleCompanyClick = () => {
    console.log("🏢 EMPRESA clicado!");
    console.log("⏰ Timestamp:", new Date().toISOString());
    
    try {
      console.log("📞 Chamando onSelect('company')...");
      onSelect('company');
      console.log("✅ onSelect('company') executado!");
    } catch (error) {
      console.error("❌ ERRO:", error);
    }
  };

  const handleBackClick = () => {
    console.log("⬅️ VOLTAR clicado!");
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
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#111',
          marginBottom: '24px'
        }}>
          🧪 TESTE SIMPLES - SELEÇÃO DE PERFIL
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px'
        }}>
          Escolha seu perfil para continuar:
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Botão Candidato */}
          <button
            onClick={handleCandidateClick}
            style={{
              padding: '40px 20px',
              backgroundColor: '#6C4DFF',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A3FE6';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#6C4DFF';
            }}
          >
            <div style={{ fontSize: '48px' }}>👤</div>
            <div>BUSCO VAGA</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              Sou candidato procurando emprego
            </div>
          </button>
          
          {/* Botão Empresa */}
          <button
            onClick={handleCompanyClick}
            style={{
              padding: '40px 20px',
              backgroundColor: '#1477FF',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#0D66E8';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#1477FF';
            }}
          >
            <div style={{ fontSize: '48px' }}>🏢</div>
            <div>BUSCO CANDIDATO</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              Sou empresa procurando talentos
            </div>
          </button>
        </div>
        
        <button
          onClick={handleBackClick}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '2px solid #E8E8E8',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          ⬅️ Voltar ao Login
        </button>
        
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666',
          fontFamily: 'monospace',
          textAlign: 'left'
        }}>
          <div>🔍 Debug Info:</div>
          <div>⏰ Renderizado em: {new Date().toLocaleTimeString()}</div>
          <div>📦 onSelect: {typeof onSelect}</div>
          <div>📦 onBack: {typeof onBack}</div>
          <div>📋 Abra o Console (F12) para logs detalhados</div>
        </div>
      </div>
    </div>
  );
}