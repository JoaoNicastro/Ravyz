import { useEffect } from 'react';

interface AutoNavigationTestProps {
  onSelect: (type: 'candidate' | 'company') => void;
  onBack: () => void;
}

export function AutoNavigationTest({ onSelect, onBack }: AutoNavigationTestProps) {
  console.log("🤖 AutoNavigationTest renderizado");

  // Teste automático após 3 segundos
  useEffect(() => {
    console.log("⏰ Iniciando teste automático em 3 segundos...");
    
    const timer = setTimeout(() => {
      console.log("🚀 EXECUTANDO TESTE AUTOMÁTICO - CHAMANDO onSelect('candidate')");
      try {
        onSelect('candidate');
        console.log("✅ onSelect('candidate') executado automaticamente!");
      } catch (error) {
        console.error("❌ ERRO no teste automático:", error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSelect]);

  const handleManualTest = () => {
    console.log("👆 Teste manual clicado");
    try {
      onSelect('candidate');
      console.log("✅ Teste manual executado!");
    } catch (error) {
      console.error("❌ ERRO no teste manual:", error);
    }
  };

  const handleCompanyTest = () => {
    console.log("🏢 Teste empresa clicado");
    try {
      onSelect('company');
      console.log("✅ Teste empresa executado!");
    } catch (error) {
      console.error("❌ ERRO no teste empresa:", error);
    }
  };

  const testStateChange = () => {
    console.log("🔧 Testando mudança de estado direta...");
    
    // Simula exatamente o que handleProfileSelect deveria fazer
    console.log("1️⃣ Chamando onSelect('candidate')...");
    onSelect('candidate');
    console.log("2️⃣ onSelect chamado");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#111',
          marginBottom: '20px'
        }}>
          🤖 TESTE AUTOMÁTICO DE NAVEGAÇÃO
        </h1>
        
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '12px' }}>⚠️ TESTANDO AUTOMATICAMENTE</h3>
          <p style={{ color: '#856404', margin: 0 }}>
            Este componente vai tentar mudar para candidato automaticamente em 3 segundos.
            Se não funcionar, o problema NÃO está nos botões de clique.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <button
            onClick={handleManualTest}
            style={{
              padding: '30px 20px',
              backgroundColor: '#6C4DFF',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🧪 TESTE MANUAL CANDIDATO
          </button>
          
          <button
            onClick={handleCompanyTest}
            style={{
              padding: '30px 20px',
              backgroundColor: '#1477FF',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🧪 TESTE MANUAL EMPRESA
          </button>
        </div>

        <button
          onClick={testStateChange}
          style={{
            padding: '20px 40px',
            backgroundColor: '#FF7A00',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          🔧 FORÇA MUDANÇA DE ESTADO
        </button>

        <div style={{ marginTop: '30px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ⬅️ Voltar
          </button>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '30px',
          fontSize: '12px',
          fontFamily: 'monospace',
          textAlign: 'left'
        }}>
          <div><strong>🔍 DEBUG INFO:</strong></div>
          <div>Renderizado: {new Date().toLocaleTimeString()}</div>
          <div>onSelect type: {typeof onSelect}</div>
          <div>onBack type: {typeof onBack}</div>
          <div>Teste automático: Ativo (3s)</div>
          <div><strong>📋 Console (F12) para logs completos</strong></div>
        </div>
      </div>
    </div>
  );
}