import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Loader2, PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
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
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-gray-400 text-sm">กำลังโหลดสินค้า...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <PackageOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-1">ไม่พบสินค้า</h3>
        <p className="text-gray-400 text-sm">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูครับ</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">สินค้าทั้งหมด</h2>
          <span className="text-sm text-gray-400">{products.length} รายการ</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={isInWishlist(product.id)}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
