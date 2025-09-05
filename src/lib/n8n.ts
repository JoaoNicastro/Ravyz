import { N8N } from './n8n-config';

export async function processUserAudioResponse({
  candidateId, audioBlob, questionIndex, mentorData,
}: {
  candidateId: string;
  audioBlob: Blob;
  questionIndex: number;
  mentorData: { name: string; avatar: string; personality: string };
}) {
  const form = new FormData();
  form.append('audio', audioBlob, 'recording.webm'); // field n8n expects
  form.append('candidate_id', candidateId);
  form.append('questionIndex', String(questionIndex));
  form.append('mentorData', JSON.stringify(mentorData));

  const res = await fetch(N8N.endpoint('/agent/autofill'), {
    method: 'POST',
    body: form, // do NOT set Content-Type manually
  });
  if (!res.ok) return { success: false, error: `HTTP ${res.status}` };

  // audio (binary) + text via header
  const buf = await res.arrayBuffer();
  const audio = new Blob([buf], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audio);
  const reply = res.headers.get('X-Assistant-Text') || '';

  return {
    success: true,
    transcription: reply, // or set to your transcriber output if you have one
    aiResponse: { text: reply, audioUrl },
    isComplete: questionIndex >= 4,
  };
}

// (optional) insights call, if you use it later:
export async function processAIConversationInsights(payload: {
  candidateId: string;
  conversationData: any;
  extractedInsights: any;
}) {
  const res = await fetch(N8N.endpoint('/ai-conversation/insights'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
