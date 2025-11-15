
export interface Ingredient {
  name: string;
  status: 'available' | 'missing';
  quantity?: string;
}

export interface Recipe {
  recipeName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: Ingredient[];
  steps: string[];
}

export interface DietaryOption {
    id: string;
    label: string;
}
