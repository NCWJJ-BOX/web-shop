import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'electronics': 'https://images.unsplash.com/photo-1519389403241-75e17e6975a9?auto=format&fit=crop&q=80&w=400',
  'fashion': 'https://images.unsplash.com/photo-1445204450317-197ef2c9a717?auto=format&fit=crop&q=80&w=400',
  'home': 'https://images.unsplash.com/photo-1484101403033-57105e2e4756?auto=format&fit=crop&q=80&w=400',
  'beauty': 'https://images.unsplash.com/photo-1522338242962-d602a92f0003?auto=format&fit=crop&q=80&w=400',
  'sports': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
};

function getCategoryImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1558060370-d641c0b1f246?auto=format&fit=crop&q=80&w=400';
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">หมวดหมู่สินค้า</h2>
          <button
            onClick={() => onCategorySelect('all')}
            className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'text-orange-500 hover:bg-orange-50'
            }`}
          >
            ดูทั้งหมด
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id.toString())}
              className={`group cursor-pointer text-center p-3 rounded-xl border transition-all ${
                selectedCategory === category.id.toString()
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x100?text=${category.name}`;
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
