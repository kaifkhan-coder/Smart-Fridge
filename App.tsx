
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImageUploader } from './components/ImageUploader';
import { RecipeList } from './components/RecipeList';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { getRecipesFromImage } from './services/geminiService';
import type { Recipe } from './types';
import { DIETARY_OPTIONS } from './constants';
import { ChefHatIcon } from './components/icons';

type View = 'upload' | 'recipes' | 'cooking' | 'shopping';

export default function App() {
  const [view, setView] = useState<View>('upload');
  const [imageData, setImageData] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleImageAnalysis = useCallback(async (base64Image: string, filters: string[]) => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setView('recipes');
    setImageData(base64Image);
    
    try {
      const suggestedRecipes = await getRecipesFromImage(base64Image, filters);
      setRecipes(suggestedRecipes);
    } catch (err) {
      console.error(err);
      setError('Sorry, I couldn\'t come up with recipes. Please try another photo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
    setActiveFilters(newFilters);
    if (imageData) {
      handleImageAnalysis(imageData, newFilters);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('cooking');
  };

  const handleExitCookingMode = () => {
    setSelectedRecipe(null);
    setView('recipes');
  };

  const handleAddToShoppingList = useCallback((item: string) => {
    setShoppingList((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);
  
  const handleRemoveFromShoppingList = useCallback((item: string) => {
    setShoppingList((prev) => prev.filter(i => i !== item));
  }, []);

  const handleStartOver = () => {
    setView('upload');
    setImageData(null);
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
    setActiveFilters([]);
  }

  const mainContent = useMemo(() => {
    switch (view) {
      case 'upload':
        return <ImageUploader onImageAnalyzed={(base64) => handleImageAnalysis(base64, activeFilters)} />;
      case 'recipes':
        return <RecipeList recipes={recipes} isLoading={isLoading} error={error} onSelectRecipe={handleSelectRecipe} onStartOver={handleStartOver} imagePreview={imageData} />;
      case 'cooking':
        return selectedRecipe && <CookingMode recipe={selectedRecipe} onExit={handleExitCookingMode} onAddToShoppingList={handleAddToShoppingList} />;
      case 'shopping':
        return <ShoppingList items={shoppingList} onRemoveItem={handleRemoveFromShoppingList} />;
      default:
        return <ImageUploader onImageAnalyzed={(base64) => handleImageAnalysis(base64, activeFilters)} />;
    }
  }, [view, recipes, isLoading, error, selectedRecipe, shoppingList, activeFilters, imageData, handleImageAnalysis, handleSelectRecipe, handleExitCookingMode, handleAddToShoppingList, handleRemoveFromShoppingList, handleStartOver]);

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onNavigate={setView}
        currentView={view}
        dietaryOptions={DIETARY_OPTIONS}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col transition-all duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center z-20">
            <div className="flex items-center">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none mr-4"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                 <div className="flex items-center gap-2">
                    <ChefHatIcon className="w-8 h-8 text-green-500" />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Culinary Assistant</h1>
                </div>
            </div>
        </header>
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {mainContent}
        </div>
      </main>
    </div>
  );
}
