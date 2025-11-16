
import { GoogleGenAI, Modality } from "@google/genai";

// Assume process.env.API_KEY is available in the execution environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured. Please set up your API_KEY environment variable.";
  }
  try {
    const prompt = `Generate a seductive and appealing product description for an adult toy named "${productName}". The description should be short, enticing, and focus on pleasure and excitement. Keep it under 30 words. Do not use explicit or vulgar language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim().replace(/["*]/g, '');
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const suggestProductTitle = async (description: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured.";
  }
  try {
    const prompt = `Based on the following adult toy description, suggest a short, catchy, and evocative product name (2-4 words max): "${description}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim().replace(/["*]/g, '');
  } catch (error) {
    console.error("Error suggesting product title:", error);
    return "AI Suggestion Failed";
  }
};

export const generateProductImage = async (productName: string, productDescription: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured.";
  }
  try {
    const prompt = `Generate a professional, high-quality, visually appealing e-commerce product image for an adult toy.
    Product Name: "${productName}"
    Description: "${productDescription}"
    Style requirements: The product should be the central focus, placed on a clean, minimalist, and elegant background (like marble, silk, or a soft gradient). The lighting should be soft and sophisticated, highlighting the product's texture and shape. The overall mood should be luxurious and sensual, not explicit. Avoid any human elements or distracting props. Generate a square image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating product image:", error);
    return "Failed to generate image. Please try again.";
  }
};
