import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover millions of products across all your favorite categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <button
          onClick={() => onCategorySelect('all')}
          className={`group p-6 rounded-2xl transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl'
              : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 text-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <div className={`p-3 rounded-xl mb-3 ${
              selectedCategory === 'all'
                ? 'bg-white/20'
                : 'bg-gradient-to-br from-orange-100 to-pink-100 group-hover:from-orange-200 group-hover:to-pink-200'
            }`}>
              <Icons.Grid3X3 className={`h-6 w-6 ${
                selectedCategory === 'all' ? 'text-white' : 'text-orange-500'
              }`} />
            </div>
            <span className="font-medium text-sm">All</span>
            <span className={`text-xs mt-1 ${
              selectedCategory === 'all' ? 'text-white/80' : 'text-gray-500'
            }`}>
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </div>
        </button>

        {categories.map((category) => {
          const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group p-6 rounded-2xl transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl'
                  : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-xl mb-3 ${
                  selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-orange-100 to-pink-100 group-hover:from-orange-200 group-hover:to-pink-200'
                }`}>
                  <IconComponent className={`h-6 w-6 ${
                    selectedCategory === category.id ? 'text-white' : 'text-orange-500'
                  }`} />
                </div>
                <span className="font-medium text-sm">{category.name}</span>
                <span className={`text-xs mt-1 ${
                  selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};