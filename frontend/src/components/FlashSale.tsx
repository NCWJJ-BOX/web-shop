"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { Product } from '../types';

export const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(7200);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const data = await apiFetch<Product[]>('/api/products/featured');
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch flash sale products:', error);
      }
    };
    void fetchSaleProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') };
  };

  const { h, m, s } = formatTime(timeLeft);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-orange-500 font-black text-xl">Flash Sale</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">จบใน</span>
              <div className="flex gap-1">
                {[h, m, s].map((unit, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-gray-900 text-white text-xs font-bold w-7 h-7 rounded-md flex items-center justify-center">{unit}</span>
                    {i < 2 && <span className="text-gray-900 font-bold text-xs self-center">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
            ดูทั้งหมด &rarr;
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
              <div className="aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-xs text-gray-800 line-clamp-2 h-8 mb-2 leading-tight">{product.name}</h3>
                <p className="text-orange-500 text-base font-bold">฿{(product.price * 35).toLocaleString()}</p>
                {product.originalPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400 line-through">฿{(product.originalPrice * 35).toLocaleString()}</span>
                    {product.discount && (
                      <span className="text-[11px] text-white bg-red-500 px-1.5 py-0.5 rounded font-medium">-{product.discount}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
