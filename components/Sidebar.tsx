
import React from 'react';
import type { DietaryOption } from '../types';
import { FilterIcon, ShoppingCartIcon } from './icons';

interface SidebarProps {
  activeFilters: string[];
  onFilterChange: (filter: string) => void;
  onNavigate: (view: 'shopping') => void;
  currentView: string;
  dietaryOptions: DietaryOption[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    activeFilters, 
    onFilterChange, 
    onNavigate, 
    currentView, 
    dietaryOptions,
    isOpen,
    setIsOpen,
}) => {

  const navItemClasses = (view: string) => 
    `flex items-center w-full px-4 py-3 text-left text-lg rounded-lg transition-colors duration-200 ${
      currentView === view
        ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
    }`;
    
  const filterButtonClasses = (id: string) =>
    `w-full text-left px-4 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-green-500 ${
      activeFilters.includes(id)
        ? 'bg-green-500 text-white font-semibold shadow-md'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg p-4">
        <button 
            onClick={() => onNavigate('shopping')}
            className={navItemClasses('shopping')}
        >
            <ShoppingCartIcon className="w-6 h-6 mr-3" />
            Shopping List
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center px-4 text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                <FilterIcon className="w-6 h-6 mr-3"/>
                Dietary Filters
            </h3>
            <div className="space-y-2">
                {dietaryOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange(option.id)}
                        className={filterButtonClasses(option.id)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)}></div>
        <div className={`relative w-72 h-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
          <SidebarContent />
      </aside>
    </>
  );
};
