import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black mb-4">Curated Categories</h2>
          <p className="text-gray-400 max-w-md">Browse our hand-picked selection of high-quality gear and lifestyle accessories.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategorySelect('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id.toString())}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                selectedCategory === category.id.toString()
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.slice(0, 5).map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onCategorySelect(category.id.toString())}
            className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
          >
            <img 
              src={`https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&q=80&w=400`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              alt={category.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore Items &rarr;</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};