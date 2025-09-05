# Integração AI Conversation Chat com Backend n8n

## Visão Geral

Este documento descreve a implementação completa da funcionalidade "Conversa com AI Mentor" integrada ao backend n8n, seguindo os requisitos funcionais e de design especificados.

## Arquitetura

```
[Frontend React] → [n8n Webhook] → [AI/TTS Service] → [Response: MP3 + Text Header]
```

## Fluxo Completo

### 1. Iniciação da Conversa
- Usuário acessa "ai-conversation-chat" 
- Sistema carrega primeiro pergunta do mentor
- Audio é gerado pelo n8n e reproduzido automaticamente

### 2. Gravação do Usuário
- Usuário clica no botão circular roxo para gravar
- `MediaRecorder` captura áudio do microfone
- Estado visual muda para "listening" com animações

### 3. Processamento no Backend
- Áudio enviado para webhook n8n: `/ai-mentor-conversation`
- n8n processa:
  - Transcrição de voz para texto
  - Análise da resposta pelo AI
  - Geração de próxima pergunta/resposta
  - Conversão texto para fala (TTS)

### 4. Resposta do Backend
```http
POST /webhook/ai-mentor-conversation
Content-Type: multipart/form-data

Response:
- Body: MP3 audio file (binary)
- Header: X-Assistant-Text: "Texto correspondente ao áudio"
```

### 5. Exibição da Resposta
- Texto exibido em balão de chat
- Player customizado toca o áudio automaticamente
- Botão "🔊 Ouvir novamente" para replay

## Componentes Implementados

### AIConversationChat.tsx
- **Layout**: Fundo gradiente roxo/azul escuro
- **Chat**: Balões usuário (direita, #7C3AED) e AI (esquerda, #1F2937)
- **Controles**: Botão gravar circular, progress dots
- **Estados**: waiting, listening, processing, speaking, completed

### CustomAudioPlayer.tsx
- **Inline Player**: Dentro dos balões de chat
- **Floating Player**: Player global quando reproduzindo
- **Controles**: Play/pause, progress bar, volume, waveform
- **Design**: Gradiente roxo, controles minimalistas

### Integração n8n (lib/n8n.ts)
```typescript
// Enviar áudio e receber resposta do AI
sendAudioToAIMentor({
  candidateId: string,
  audioBlob: Blob,
  conversationContext: {
    questionIndex: number,
    previousResponses: string[],
    mentorId: string
  }
}) → { audioUrl, responseText }

// Processar resposta completa do usuário
processUserAudioResponse({
  candidateId: string,
  audioBlob: Blob,
  questionIndex: number,
  mentorData: MentorInfo
}) → { transcription, aiResponse, isComplete }
```

## Configuração do Backend n8n

### Webhook Endpoint
```
POST /webhook/ai-mentor-conversation
```

### Input esperado:
- `audio`: Blob (arquivo WAV do usuário)
- `candidateId`: string (ID do candidato)
- `conversationContext`: JSON com contexto da conversa

### Output esperado:
- **Body**: Arquivo MP3 com resposta falada do AI
- **Header X-Assistant-Text**: Texto da resposta do AI
- **Status**: 200 OK

### Fluxo n8n Sugerido:
1. **Webhook Trigger** - Recebe áudio + contexto
2. **Speech-to-Text** - Transcreve áudio do usuário
3. **AI Analysis** - Processa resposta e gera próxima pergunta
4. **Text-to-Speech** - Converte resposta para áudio
5. **Response** - Retorna MP3 + header com texto

## Design System (RAVYZ)

### Cores Utilizadas:
- **Fundo**: Gradiente `from-gray-900 via-purple-900 to-blue-900`
- **Usuário**: `bg-purple-500` (#7C3AED)
- **AI**: `bg-gray-800` (#1F2937)
- **Botões**: Gradiente `from-purple-600 to-blue-600`
- **Accents**: `text-purple-400`, `bg-purple-600/20`

### Layout Responsivo:
- **Desktop**: Chat centralizado, max-width 4xl
- **Mobile**: Full width, botões adaptados para touch
- **Player**: Floating player se adapta ao viewport

## Estados Visuais

### Aguardando (waiting)
- Botão roxo circular com ícone microfone
- Texto: "Clique para falar sua resposta"

### Gravando (listening)  
- Botão vermelho com ícone mic-off
- Texto: "Gravando... Toque para parar"
- Avatar do mentor com animação de escala

### Processando (processing)
- Dots animados de loading
- Texto: "Processando sua resposta..."

### Falando (speaking)
- Player de áudio ativo
- Animação no avatar do mentor
- Progress dots indicando progresso

### Concluído (completed)
- Botão "Ver Meu Perfil Completo"
- Mensagem final do mentor

## Funcionalidades Implementadas

✅ **Gravação de áudio** via MediaRecorder API
✅ **Player customizado** substituindo `<audio>` nativo
✅ **Layout responsivo** desktop e mobile
✅ **Integração n8n** com handlers para upload/download
✅ **Estados visuais** completos com animações
✅ **Balões de chat** diferenciados por tipo
✅ **Progress tracking** com dots indicadores
✅ **Waveform visual** no player de áudio
✅ **Controles de volume** e replay
✅ **Floating player** para reprodução global

## Próximos Passos

1. **Configurar n8n** com workflows reais
2. **Implementar Speech-to-Text** (Azure, Google, AWS)
3. **Configurar AI/LLM** para análise de respostas
4. **Implementar TTS** para geração de áudio
5. **Adicionar analytics** de conversa no Supabase
6. **Testes A/B** de diferentes mentores/vozes

## Exemplo de Uso

```typescript
// No App.tsx, estado "ai-conversation-chat"
<AIConversationChat
  onComplete={handleAssessmentComplete}
  onBack={() => setCurrentState("questionnaire-method-selection")}
  mentorData={userData?.mentor}
/>
```

O componente integra automaticamente com:
- Sistema de estados do app RAVYZ
- Fluxo completo de onboarding
- Dados do mentor selecionado
- Transição para perfil do candidato