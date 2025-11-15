
import React from 'react';
import { ShoppingCartIcon, TrashIcon } from './icons';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (item: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
            <ShoppingCartIcon className="w-8 h-8 mr-3 text-green-500"/>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping List</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Your shopping list is empty.</p>
            ) : (
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li 
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md transition-all duration-200"
                        >
                            <span className="text-lg text-gray-800 dark:text-gray-200">{item}</span>
                            <button 
                                onClick={() => onRemoveItem(item)}
                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                aria-label={`Remove ${item}`}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};
