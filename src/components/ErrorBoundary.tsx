import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("🚨 ErrorBoundary capturou erro:", error);
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 ErrorBoundary - Detalhes do erro:", {
      error,
      errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#fee',
          padding: '40px',
          fontFamily: 'monospace'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            border: '2px solid #f00'
          }}>
            <h1 style={{ color: '#d00', marginBottom: '20px' }}>
              🚨 ERRO CAPTURADO PELO ERROR BOUNDARY
            </h1>
            
            <div style={{ marginBottom: '20px' }}>
              <h3>❌ Erro:</h3>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error?.toString()}
              </pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>📍 Stack Trace:</h3>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '10px'
              }}>
                {this.state.error?.stack}
              </pre>
            </div>

            {this.state.errorInfo && (
              <div style={{ marginBottom: '20px' }}>
                <h3>🧩 Component Stack:</h3>
                <pre style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '10px'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}