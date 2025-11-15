
import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

const difficultyColorMap = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const imageUrl = `https://picsum.photos/seed/${recipe.recipeName.replace(/\s/g, '')}/400/300`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
      <div className="relative">
        <img src={imageUrl} alt={recipe.recipeName} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{recipe.recipeName}</h3>
        
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColorMap[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          <span>{recipe.prepTime}</span>
          <span>{recipe.calories} kcal</span>
        </div>
        
        <div className="mt-auto pt-4">
          <button
            onClick={onSelect}
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-transform transform group-hover:scale-105"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};
