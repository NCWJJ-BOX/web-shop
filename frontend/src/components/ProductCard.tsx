import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onQuickView,
}) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            หมด
          </span>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-orange-500 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
            className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all ${
              isInWishlist ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md transform translate-y-2 group-hover:translate-y-0 hover:bg-orange-600 transition-all"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-orange-500 font-medium mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 h-10 leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-base">฿{(product.price * 35).toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">฿{(product.originalPrice * 35).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};
