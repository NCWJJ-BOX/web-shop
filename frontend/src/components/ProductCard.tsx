import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onQuickView,
}) => {
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={() => onQuickView(product)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-xl"
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-xl disabled:bg-gray-600"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md border transition-all ${
            isWishlisted 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-black/20 border-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">{product.category_name}</p>
            <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold">4.8</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-black tracking-tight">
            ${product.price.toLocaleString()}
          </p>
          <button 
             onClick={() => onAddToCart(product)}
             disabled={product.stock === 0}
             className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-600"
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};
