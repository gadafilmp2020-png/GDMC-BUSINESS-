import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingAdvice = async (query: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your environment configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are an elite Network Marketing (MLM) Coach and Copywriter for 'Nexus 2025'. 
        Your goal is to help distributors grow their downline, improve leadership, and close sales.
        Keep answers concise, motivational, and actionable. 
        Use modern, professional, yet energetic language.
        If asked for scripts, provide high-converting, non-spammy templates.
        `,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am having trouble connecting to the Nexus AI network. Please try again later.";
  }
};