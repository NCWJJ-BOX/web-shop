import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  onQuickView: (product: Product) => void;
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onQuickView,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Collections...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-40">
        <h3 className="text-2xl font-bold mb-2">No items found</h3>
        <p className="text-gray-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={isInWishlist}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};