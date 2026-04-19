export type AIProvider = 'gemini' | 'openrouter' | 'groq' | 'featherless';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GetAIOptions {
  provider?: AIProvider;
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onStreamChunk?: (chunk: string) => void;
  onStreamComplete?: (fullContent: string) => void;
  signal?: AbortSignal;
}

const DEFAULT_SYSTEM_INSTRUCTION = "You are Zenith, a highly intelligent and encouraging AI Study Mentor. Your goal is to help students understand complex topics, provide study tips, and encourage them. Use clear explanations and occasionally use emojis. Format your responses using Markdown for better readability.";

// Groq API Key dari Vercel env
const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export const getAIResponse = async (
  messages: AIMessage[],
  options: GetAIOptions = {}
): Promise<string> => {
  const {
    provider = 'groq',
    model,
    systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
    onStreamChunk,
    onStreamComplete,
    signal
  } = options;

  if (provider !== 'groq') {
    throw new Error('Only groq provider is configured');
  }

  const groqModel = model || 'llama-3.3-70b-versatile';
  
  // Groq pakai format OpenAI
  const groqMessages = systemInstruction 
    ? [{ role: 'system' as const, content: systemInstruction }, ...messages]
    : messages;

  try {
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        messages: groqMessages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    if (stream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                // Groq streaming format: choices[0].delta.content
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  onStreamChunk?.(content);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      onStreamComplete?.(fullContent);
      return fullContent;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response generated.";

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request cancelled');
    }
    console.error("Groq Service Error:", error);
    throw error;
  }
};
