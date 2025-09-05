// ========================================
// n8n Configuration - Client-Safe
// ========================================

// Configuração segura para o cliente que funciona sem process.env
export const getN8nConfig = () => {
  // Valores padrão que funcionam em qualquer ambiente
  const config = {
    baseUrl: 'https://your-n8n-instance.com/webhook',
    apiKey: undefined as string | undefined,
    isConfigured: false,
    timeout: 10000,
    retries: 3
  };

  // Tentar acessar variáveis de ambiente apenas se disponível
  if (typeof window !== 'undefined') {
    // Browser environment - check for injected ENV
    const envVars = (window as any).ENV || {};
    config.baseUrl = envVars.NEXT_PUBLIC_N8N_WEBHOOK_URL || config.baseUrl;
    config.apiKey = envVars.N8N_API_KEY;
  }

  // Mock/development URLs para teste
  if (config.baseUrl === 'https://your-n8n-instance.com/webhook') {
    // Em desenvolvimento, usar um mock endpoint
    config.baseUrl = 'https://mock-n8n.ravyz.com/webhook';
    config.isConfigured = false; // Marcar como não configurado para usar mocks
  } else {
    config.isConfigured = true;
  }

  return config;
};

// Função para verificar se estamos em ambiente de desenvolvimento
export const isDevelopment = () => {
  return !getN8nConfig().isConfigured;
};

// Headers padrão para requisições
export const getDefaultHeaders = () => {
  const config = getN8nConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  return headers;
};

// URLs específicas para diferentes endpoints
export const getEndpointUrl = (endpoint: string) => {
  const config = getN8nConfig();
  return `${config.baseUrl}/${endpoint}`;
};