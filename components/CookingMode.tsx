
import React, { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from './icons';

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
  onAddToShoppingList: (item: string) => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit, onAddToShoppingList }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isIngredientsVisible, setIsIngredientsVisible] = useState(true);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  useEffect(() => {
    // Cleanup speech synthesis on component unmount
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(recipe.steps[currentStep]);
    }
  };

  const nextStep = () => {
    stopSpeaking();
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    stopSpeaking();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
      {/* Left side - Ingredients */}
      <div className={`lg:w-1/3 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:pr-8 transition-all duration-300 ${isIngredientsVisible ? 'block' : 'hidden lg:block'}`}>
        <h2 className="text-2xl font-bold mb-4">{recipe.recipeName}</h2>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingredients</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400 max-h-96 overflow-y-auto">
          {recipe.ingredients.map((ing, index) => (
            <li key={index} className={`flex justify-between items-center p-2 rounded-md ${ing.status === 'missing' ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
              <span className={ing.status === 'missing' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}>
                {ing.quantity} {ing.name}
              </span>
              {ing.status === 'missing' && (
                <button
                  onClick={() => onAddToShoppingList(ing.name)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={onExit}
          className="mt-6 w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to Recipes
        </button>
      </div>

      {/* Right side - Steps */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Step {currentStep + 1} <span className="text-gray-400">/ {recipe.steps.length}</span></h3>
          <button onClick={() => setIsIngredientsVisible(!isIngredientsVisible)} className="lg:hidden bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-sm">
            {isIngredientsVisible ? 'Hide' : 'Show'} Ingredients
          </button>
        </div>

        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-lg p-6 min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
          <p className="text-2xl sm:text-3xl md:text-4xl leading-relaxed text-center font-serif text-gray-800 dark:text-gray-100">
            {recipe.steps[currentStep]}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={prevStep} disabled={currentStep === 0} className="px-6 py-3 bg-gray-300 dark:bg-gray-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Prev
            </button>
            <button onClick={nextStep} disabled={currentStep === recipe.steps.length - 1} className="px-6 py-3 bg-gray-300 dark:bg-gray-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
          <button onClick={handleReadAloud} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
            {isSpeaking ? <SpeakerXMarkIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
            <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
