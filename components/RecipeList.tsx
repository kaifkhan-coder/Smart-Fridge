
import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartOver: () => void;
  imagePreview: string | null;
}

const LoadingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="flex justify-between pt-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, isLoading, error, onSelectRecipe, onStartOver, imagePreview }) => {
  return (
    <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
                {imagePreview && <img src={imagePreview} alt="fridge content" className="w-16 h-16 object-cover rounded-lg shadow-md mr-4" />}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Recipe Suggestions</h2>
                    <p className="text-gray-500 dark:text-gray-400">Here's what you can make with your ingredients.</p>
                </div>
            </div>
            <button
                onClick={onStartOver}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                Start Over
            </button>
      </div>

      {error && (
        <div className="text-center p-8 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 rounded-lg">
          <p className="font-semibold text-lg">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && !error && recipes.length === 0 && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-8">
          <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">No recipes found.</p>
          <p className="text-gray-500 dark:text-gray-400">Try a different photo or adjust your filters.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard key={`${recipe.recipeName}-${index}`} recipe={recipe} onSelect={() => onSelectRecipe(recipe)} />
        ))}
      </div>
    </div>
  );
};
