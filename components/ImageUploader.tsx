
import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageAnalyzed: (base64Image: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageAnalyzed }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        setError('Image size exceeds 4MB. Please choose a smaller file.');
        setPreview(null);
        return;
      }
      setError(null);
      const base64 = await fileToBase64(file);
      setPreview(base64);
    }
  }, []);

  const handleAnalyze = () => {
    if (preview) {
      onImageAnalyzed(preview);
    } else {
      setError('Please select an image first.');
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">What's in your fridge?</h2>
            <p className="text-gray-500 dark:text-gray-400">
            Snap a photo and let AI create delicious recipes from your ingredients.
            </p>
        </div>
        
        <div 
            className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
            onClick={triggerFileSelect}
        >
          {preview ? (
            <img src={preview} alt="Fridge preview" className="object-contain h-full w-full rounded-md" />
          ) : (
            <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Click to upload or take a photo</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          onClick={handleAnalyze}
          disabled={!preview}
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          Find Recipes
        </button>
      </div>
    </div>
  );
};
