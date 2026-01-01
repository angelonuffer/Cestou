import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AICategoryResult {
  categoryName: string;
  files: string[];
}

export const analyzeFilesWithGemini = async (filenames: string[], existingFolders: string[]): Promise<AICategoryResult[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert file organizer. I will provide a list of filenames and a list of existing folders in the directory. 
      Analyze the files and group them.
      
      Rules:
      1. **PRIORITY**: If a file matches the context of an "Existing Folder", you MUST put it in that folder.
      2. If no existing folder fits, create a new meaningful category name in Portuguese (Brazil). Examples: "Financeiro", "Projetos", "Fotos Pessoais".
      3. If a file is ambiguous and fits no folder, put it in "Outros".
      4. Do not leave any file uncategorized.
      
      Existing Folders (Use these if possible):
      ${JSON.stringify(existingFolders)}
      
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
                    description: "The name of the folder/category. Use existing folder names if they match.",
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