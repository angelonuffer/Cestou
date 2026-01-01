import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AICategoryResult {
  categoryName: string;
  files: string[];
}

export const analyzeFilesWithGemini = async (filenames: string[]): Promise<AICategoryResult[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert file organizer. I will provide a list of filenames. 
      Analyze them and group them into logical folders based on their content, context, extension, and name.
      
      Rules:
      1. Create meaningful category names in Portuguese (Brazil). Examples: "Financeiro", "Projetos", "Fotos Pessoais", "Instaladores".
      2. If a file is ambiguous, put it in "Outros".
      3. Do not leave any file uncategorized.
      
      Files to organize:
      ${JSON.stringify(filenames)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoryName: {
                    type: Type.STRING,
                    description: "The name of the folder/category in Portuguese",
                  },
                  files: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of filenames belonging to this category",
                  },
                },
                required: ["categoryName", "files"],
              },
            },
          },
        },
      },
    });

    if (!response.text) return [];

    const result = JSON.parse(response.text);
    return result.categories || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};