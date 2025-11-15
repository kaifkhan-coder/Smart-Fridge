
import { GoogleGenAI, Type } from '@google/genai';
import type { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        recipeName: { type: Type.STRING, description: "The name of the recipe." },
        difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'], description: "The difficulty to prepare the recipe." },
        prepTime: { type: Type.STRING, description: "Estimated preparation time, e.g., '30 mins'." },
        calories: { type: Type.NUMBER, description: "Estimated calories per serving." },
        ingredients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the ingredient." },
              quantity: { type: Type.STRING, description: "Quantity of the ingredient, e.g., '2 cups', '100g'." },
              status: { type: Type.STRING, enum: ['available', 'missing'], description: "Whether the ingredient is visibly available in the image or is a common pantry staple that might be missing." },
            },
            required: ['name', 'quantity', 'status']
          },
        },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Step-by-step instructions to prepare the recipe."
        },
      },
      required: ['recipeName', 'difficulty', 'prepTime', 'calories', 'ingredients', 'steps']
    }
};

const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

export const getRecipesFromImage = async (base64Image: string, dietaryRestrictions: string[]): Promise<Recipe[]> => {
    const prompt = `
        Analyze the ingredients in this image of a fridge.
        Identify all edible items.
        Suggest 5-10 diverse recipes that primarily use these ingredients.
        Assume common pantry staples like salt, pepper, oil, and basic spices are available but list them as 'missing' if they are essential for the recipe.
        For each ingredient in a recipe, determine if it is 'available' from the image or 'missing'.
        ${dietaryRestrictions.length > 0 ? `The recipes MUST adhere to the following dietary restrictions: ${dietaryRestrictions.join(', ')}.` : ''}
        Provide the output in a valid JSON format according to the provided schema.
    `;
    
    const imagePart = {
        inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/jpeg',
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: recipeSchema,
            },
        });

        const jsonText = response.text.trim();
        const recipes = JSON.parse(jsonText) as Recipe[];
        return recipes;
    } catch (error) {
        console.error("Error fetching recipes from Gemini:", error);
        throw new Error("Failed to generate recipes. The model may be experiencing issues or the image could not be processed.");
    }
};
