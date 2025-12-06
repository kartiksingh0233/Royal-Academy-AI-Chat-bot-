
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Attachment, GroundingMetadata } from '../types';

// Helper: Ensure we have a fresh client with the latest environment key
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat & Vision ---

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      // Enable Google Search to find info on royalacademy.net.in
      tools: [{ googleSearch: {} }],
    },
  });
};

export const sendMessageToGemini = async (
  chat: Chat, 
  message: string, 
  attachment?: Attachment
): Promise<{ text: string, groundingMetadata?: GroundingMetadata }> => {
  try {
    let result: GenerateContentResponse;

    if (attachment) {
      // Multimodal request (Text + Image)
      result = await chat.sendMessage({
        message: [
          { inlineData: { mimeType: attachment.mimeType, data: attachment.data } },
          { text: message || "Analyze this image and help me with my doubt." }
        ]
      });
    } else {
      result = await chat.sendMessage({ message });
    }

    return {
        text: result.text || "I couldn't generate a text response.",
        groundingMetadata: result.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm sorry, I encountered an error connecting to the Royal Academy network. Please try again." };
  }
};
