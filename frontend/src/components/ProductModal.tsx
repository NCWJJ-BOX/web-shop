import React, { useState } from 'react';
import { X, Heart, ShoppingCart, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onBuyNow?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onBuyNow
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) onAddToCart(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="bg-gray-50 p-6">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
              <img
                src={product.images[currentImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentImageIndex ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <p className="text-sm text-orange-500 font-medium mb-1">{product.category}</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.reviews} รีวิว)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-orange-500">฿{(product.price * 35).toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">฿{(product.originalPrice * 35).toLocaleString()}</span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {product.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">คุณสมบัติ</h4>
                <ul className="space-y-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">จำนวน</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-lg">-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-lg">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                เพิ่มลงตะกร้า
              </button>
              <button
                onClick={() => onBuyNow ? onBuyNow(product) : handleAddToCart()}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 shadow-sm"
              >
                ซื้อทันที
              </button>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-12 border-2 rounded-xl flex items-center justify-center ${
                  isInWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, label: 'รับประกันของแท้' },
                { icon: Truck, label: 'จัดส่งฟรี' },
                { icon: RotateCcw, label: 'คืนสินค้า 7 วัน' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={16} className="text-orange-500" />
                  <span className="text-[10px] text-gray-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
