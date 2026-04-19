export type AIProvider = 'gemini' | 'openrouter' | 'groq' | 'featherless';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getAIResponse = async (
  messages: AIMessage[], 
  provider: AIProvider = 'groq',
  model?: string
) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        model,
        messages,
        systemInstruction: "You are Zenith, a highly intelligent and encouraging AI Study Mentor. Your goal is to help students understand complex topics, provide study tips, and encourage them. Use clear explanations and occasionally use emojis. Format your responses using Markdown for better readability.",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
