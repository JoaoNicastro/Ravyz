// ========================================
// Audio Utilities - Mock & Error Handling
// ========================================

/**
 * Generate a valid mock audio data URL
 * Creates a short silent WAV file for testing
 */
export const generateMockAudioData = (durationMs: number = 3000): string => {
  // Create a simple WAV header for a silent audio file
  const sampleRate = 22050; // 22kHz
  const numChannels = 1;     // Mono
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationMs / 1000);
  
  // WAV file structure
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // RIFF header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true);
  view.setUint16(32, numChannels * bitsPerSample / 8, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // Fill with silence (zeros)
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, 0, true);
  }
  
  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return `data:audio/wav;base64,${btoa(binary)}`;
};

/**
 * Check microphone permissions and request if needed
 */
export const checkMicrophonePermission = async (): Promise<{
  granted: boolean;
  error?: string;
}> => {
  try {
    // Check if we have permission
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permission.state === 'granted') {
        return { granted: true };
      }
      
      if (permission.state === 'denied') {
        return { 
          granted: false, 
          error: 'Permissão do microfone foi negada. Habilite nas configurações do navegador.' 
        };
      }
    }
    
    // Try to get user media to trigger permission request
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // If successful, stop the stream and return success
    stream.getTracks().forEach(track => track.stop());
    return { granted: true };
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        return { 
          granted: false, 
          error: 'Permissão do microfone foi negada. Clique no ícone do microfone na barra de endereços para permitir.' 
        };
      }
      if (error.name === 'NotFoundError') {
        return { 
          granted: false, 
          error: 'Nenhum microfone foi encontrado. Conecte um microfone e tente novamente.' 
        };
      }
      if (error.name === 'NotSupportedError') {
        return { 
          granted: false, 
          error: 'Gravação de áudio não é suportada neste navegador.' 
        };
      }
    }
    
    return { 
      granted: false, 
      error: 'Erro ao acessar o microfone. Verifique as configurações do navegador.' 
    };
  }
};

/**
 * Create a MediaRecorder with error handling
 */
export const createMediaRecorder = async (onDataAvailable: (blob: Blob) => void): Promise<{
  recorder?: MediaRecorder;
  error?: string;
}> => {
  try {
    const permissionResult = await checkMicrophonePermission();
    
    if (!permissionResult.granted) {
      return { error: permissionResult.error };
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      } 
    });
    
    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      return { error: 'Gravação de áudio não é suportada neste navegador.' };
    }
    
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav'
    });
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: recorder.mimeType });
      onDataAvailable(audioBlob);
      
      // Clean up stream
      stream.getTracks().forEach(track => track.stop());
    };
    
    recorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      stream.getTracks().forEach(track => track.stop());
    };
    
    return { recorder };
    
  } catch (error) {
    console.error('Failed to create MediaRecorder:', error);
    return { 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao inicializar gravação.' 
    };
  }
};

/**
 * Test if an audio URL can be played
 */
export const testAudioPlayback = (audioUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    
    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
    };
    
    const onCanPlay = () => {
      cleanup();
      resolve(true);
    };
    
    const onError = () => {
      cleanup();
      resolve(false);
    };
    
    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);
    
    // Set timeout to avoid hanging
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 3000);
    
    audio.src = audioUrl;
  });
};

/**
 * Safe audio playback with fallbacks
 */
export const safeAudioPlay = async (audioUrl: string, onPlay?: () => void, onError?: (error: string) => void): Promise<boolean> => {
  try {
    // Test if audio can be played
    const canPlay = await testAudioPlayback(audioUrl);
    
    if (!canPlay) {
      onError?.('Áudio não pode ser reproduzido. Formato não suportado.');
      return false;
    }
    
    const audio = new Audio(audioUrl);
    
    audio.oncanplaythrough = () => {
      onPlay?.();
    };
    
    audio.onerror = () => {
      onError?.('Erro ao reproduzir áudio.');
    };
    
    await audio.play();
    return true;
    
  } catch (error) {
    console.error('Audio playback failed:', error);
    onError?.('Falha na reprodução do áudio.');
    return false;
  }
};

/**
 * Generate mock responses for different conversation contexts
 */
export const getMockAIResponse = (questionIndex: number): { text: string; audioUrl: string } => {
  const responses = [
    {
      text: "Interessante! Me conta mais sobre sua experiência na área de tecnologia.",
      duration: 4000
    },
    {
      text: "Muito bom! Como você lida com desafios no trabalho em equipe?",
      duration: 3500
    },
    {
      text: "Excelente resposta! Qual é seu maior objetivo profissional?",
      duration: 3000
    },
    {
      text: "Perfeito! Me conte mais sobre suas conquistas.",
      duration: 3500
    },
    {
      text: "Ótimo! Tenho todas as informações que preciso para criar seu perfil.",
      duration: 4500
    }
  ];
  
  const response = responses[Math.min(questionIndex, responses.length - 1)];
  
  return {
    text: response.text,
    audioUrl: generateMockAudioData(response.duration)
  };
};

/**
 * Check if the current browser supports required audio features
 */
export const checkAudioSupport = (): {
  supported: boolean;
  features: {
    mediaRecorder: boolean;
    getUserMedia: boolean;
    audioElement: boolean;
  };
  message?: string;
} => {
  const features = {
    mediaRecorder: !!window.MediaRecorder,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    audioElement: !!window.Audio
  };
  
  const supported = features.mediaRecorder && features.getUserMedia && features.audioElement;
  
  if (!supported) {
    let message = 'Algumas funcionalidades de áudio não são suportadas: ';
    const missing = [];
    
    if (!features.mediaRecorder) missing.push('gravação');
    if (!features.getUserMedia) missing.push('acesso ao microfone');
    if (!features.audioElement) missing.push('reprodução de áudio');
    
    message += missing.join(', ');
    
    return { supported, features, message };
  }
  
  return { supported, features };
};