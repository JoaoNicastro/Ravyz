// ========================================
// n8n Webhook Integration
// ========================================

import { getN8nConfig, isDevelopment, getDefaultHeaders, getEndpointUrl } from './n8n-config';

// ========================================
// TypeScript Types for n8n Integration
// ========================================

export interface N8nWebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
  timestamp?: string;
}

export interface CandidateAnalysisPayload {
  candidateId: string;
  email: string;
  fullName: string;
  professionalProfile: {
    primaryProfile: string;
    secondaryProfile: string;
    profileType: string;
    overallScore: number;
  };
  dreamJob: {
    position: string;
    salaryRange: { min: number; max: number };
    industries: string[];
    workFormat: string;
  };
  mentorData?: {
    name: string;
    avatar: string;
    category: string;
  };
}

export interface JobMatchingPayload {
  jobId: string;
  companyId: string;
  jobTitle: string;
  candidateIds: string[];
  matchingCriteria: {
    salaryRange: { min: number; max: number };
    requiredSkills: string[];
    workFormat: string;
    seniority: string;
  };
}

export interface AIConversationPayload {
  candidateId: string;
  conversationData: {
    method: 'ai-writing' | 'ai-conversation';
    responses: string[];
    duration: number;
    mentorUsed: string;
  };
  extractedInsights: {
    skills: string[];
    interests: string[];
    careerGoals: string[];
    personalityTraits: string[];
  };
}

// ========================================
// n8n Webhook Functions
// ========================================

const makeN8nRequest = async (
  endpoint: string, 
  payload: any, 
  options: { timeout?: number; retries?: number } = {}
): Promise<N8nWebhookResponse> => {
  const config = getN8nConfig();
  const { timeout = config.timeout, retries = config.retries } = options;
  
  // Se estamos em desenvolvimento, retornar mock response
  if (isDevelopment()) {
    console.log(`🔧 Mock n8n request to ${endpoint}:`, payload);
    return {
      success: true,
      data: { message: 'Mock response from n8n', endpoint, payload },
      executionId: `mock-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
  
  const headers = getDefaultHeaders();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(getEndpointUrl(endpoint), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          attempt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        executionId: data?.executionId,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error(`n8n request attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
    timestamp: new Date().toISOString(),
  };
};

// ========================================
// Specific n8n Webhook Endpoints
// ========================================

/**
 * Trigger AI analysis for candidate profile
 * Use case: After candidate completes assessment/AI chat
 */
export const triggerCandidateAnalysis = async (payload: CandidateAnalysisPayload): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('candidate-analysis', payload);
};

/**
 * Trigger job matching algorithm
 * Use case: When new job is created or candidate completes profile
 */
export const triggerJobMatching = async (payload: JobMatchingPayload): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('job-matching', payload);
};

/**
 * Process AI conversation insights
 * Use case: After AI Writing or Conversation Chat completion
 */
export const processAIConversationInsights = async (payload: AIConversationPayload): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('ai-conversation-insights', payload);
};

/**
 * Send user audio to AI mentor and get response
 * Use case: During AI Conversation Chat flow
 */
export const sendAudioToAIMentor = async (payload: {
  candidateId: string;
  audioBlob: Blob;
  conversationContext: {
    questionIndex: number;
    previousResponses: string[];
    mentorId: string;
  };
}): Promise<{
  success: boolean;
  audioUrl?: string;
  responseText?: string;
  error?: string;
}> => {
  // Se estamos em desenvolvimento, retornar mock response
  if (isDevelopment()) {
    console.log('🔧 Mock audio upload to n8n:', payload.candidateId);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponses = [
      "Interessante! Me conta mais sobre sua experiência.",
      "Muito bom! Como você lida com desafios no trabalho?",
      "Excelente resposta! Qual é seu maior objetivo profissional?",
      "Perfeito! Tenho todas as informações que preciso."
    ];
    
    const responseText = mockResponses[payload.conversationContext.questionIndex] || "Obrigado pela resposta!";
    
    return {
      success: true,
      audioUrl: 'data:audio/wav;base64,mock-audio-data', // Mock audio URL
      responseText,
    };
  }
  
  try {
    const formData = new FormData();
    formData.append('audio', payload.audioBlob, 'user-response.wav');
    formData.append('candidateId', payload.candidateId);
    formData.append('conversationContext', JSON.stringify(payload.conversationContext));

    const response = await fetch(getEndpointUrl('ai-mentor-conversation'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Obter texto da resposta do header X-Assistant-Text
    const responseText = response.headers.get('X-Assistant-Text') || '';
    
    // Obter áudio MP3 do corpo da resposta
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      success: true,
      audioUrl,
      responseText,
    };

  } catch (error) {
    console.error('Erro ao enviar áudio para AI mentor:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Process user audio and get transcription + AI response
 * Use case: Convert user speech to text and generate AI mentor response
 */
export const processUserAudioResponse = async (payload: {
  candidateId: string;
  audioBlob: Blob;
  questionIndex: number;
  mentorData: {
    name: string;
    avatar: string;
    personality: string;
  };
}): Promise<{
  success: boolean;
  transcription?: string;
  aiResponse?: {
    text: string;
    audioUrl: string;
  };
  isComplete?: boolean;
  error?: string;
}> => {
  try {
        const form = new FormData();
    form.append('audio', payload.audioBlob, 'recording.webm'); // campo que o n8n espera
    form.append('candidate_id', payload.candidateId);
    form.append('questionIndex', String(payload.questionIndex));
    form.append('mentorData', JSON.stringify(payload.mentorData));

    const res = await fetch('/api/n8n/agent/autofill', {
      method: 'POST',
      body: form, // não defina Content-Type manualmente
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }

    const buf = await res.arrayBuffer();
    const audio = new Blob([buf], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audio);

    return {
      success: true,
      transcription: res.headers.get('X-Assistant-Text') || '',
      aiResponse: {
        text: res.headers.get('X-Assistant-Text') || '',
        audioUrl,
      },
      isComplete: payload.questionIndex >= 4, // 5 perguntas total
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send candidate welcome email with personalized content
 * Use case: After successful registration and mentor selection
 */
export const sendWelcomeEmail = async (candidateData: {
  email: string;
  fullName: string;
  mentorName: string;
  mentorAvatar: string;
}): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('welcome-email', candidateData);
};

/**
 * Notify company about new qualified candidates
 * Use case: When high-compatibility matches are found
 */
export const notifyCompanyNewCandidates = async (payload: {
  companyId: string;
  jobId: string;
  candidateCount: number;
  topMatches: Array<{
    candidateId: string;
    matchScore: number;
    profileSummary: string;
  }>;
}): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('company-candidate-notification', payload);
};

/**
 * Generate salary benchmarking report
 * Use case: When candidate requests salary insights
 */
export const generateSalaryReport = async (payload: {
  candidateId: string;
  position: string;
  seniority: string;
  location: string;
  currentSalary?: number;
}): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('salary-benchmarking', payload);
};

/**
 * Process feedback and update candidate ratings
 * Use case: After interview feedback is submitted
 */
export const processFeedback = async (payload: {
  candidateId: string;
  companyId: string;
  jobId: string;
  ratings: {
    communication: number;
    technical: number;
    culturalFit: number;
    overall: number;
  };
  feedback: string;
}): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('process-feedback', payload);
};

// ========================================
// Utility Functions
// ========================================

/**
 * Test n8n webhook connectivity
 */
export const testN8nConnection = async (): Promise<N8nWebhookResponse> => {
  return makeN8nRequest('health-check', { 
    timestamp: new Date().toISOString(),
    source: 'ravyz-frontend'
  });
};

/**
 * Get n8n execution status
 */
export const getExecutionStatus = async (executionId: string): Promise<N8nWebhookResponse> => {
  const config = getN8nConfig();

  if (!config.apiKey) {
    return {
      success: false,
      error: 'API key required for execution status check',
      timestamp: new Date().toISOString(),
    };
  }

  // Mock response em desenvolvimento
  if (isDevelopment()) {
    return {
      success: true,
      data: { status: 'completed', executionId },
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(getEndpointUrl(`execution/${executionId}`), {
      headers: getDefaultHeaders(),
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// ========================================
// Environment Configuration Helpers
// ========================================

/**
 * Check if n8n is properly configured
 */
export const isN8nConfigured = (): boolean => {
  return getN8nConfig().isConfigured;
};