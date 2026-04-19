import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const getMentorResponse = async (history: { role: string; parts: string }[], userInput: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Zenith, a highly intelligent and encouraging AI Study Mentor. Your goal is to help students understand complex topics, provide study tips, and encourage them. Use clear explanations and occasionally use emojis. Format your responses using Markdown for better readability.",
      }
    });

    // Note: The SDK expects history in a specific format if we used its built-in chat. 
    // Here we'll just send the message.
    
    // Convert history for Gemini SDK
    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.parts }]
    }));
    
    // Add current message
    contents.push({ role: 'user', parts: [{ text: userInput }] });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: "You are Zenith, a highly intelligent and encouraging AI Study Mentor. Your goal is to help students understand complex topics, provide study tips, and encourage them. Use clear explanations and occasionally use emojis. Format your responses using Markdown for better readability.",
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
