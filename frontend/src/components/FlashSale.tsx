"use client";
import React, { useState, useEffect } from 'react';

const FLASH_SALE_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 299, oldPrice: 599, sold: 85, image: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 2, name: "Gaming Mouse", price: 159, oldPrice: 399, sold: 45, image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 3, name: "Mechanical Keyboard", price: 899, oldPrice: 1599, sold: 92, image: "https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400" },
  { id: 4, name: "Smart Watch Series 7", price: 1290, oldPrice: 2490, sold: 60, image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 5, name: "Portable SSD 1TB", price: 2100, oldPrice: 3500, sold: 30, image: "https://images.pexels.com/photos/401107/pexels-photo-401107.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: 6, name: "Noise Cancelling Earbuds", price: 499, oldPrice: 999, sold: 78, image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400" }
];

export const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

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

  return (
    <section className="max-w-[1188px] mx-auto px-4 mt-8">
      <div className="bg-white p-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-8">
            <h2 className="text-[#ff4e00] font-black text-xl italic uppercase tracking-tighter">Flash Sale</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#212121]">Ending in</span>
              <div className="flex gap-1.5">
                {[h, m, s].map((unit, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-[#ff4e00] text-white w-8 h-8 rounded-sm flex items-center justify-center font-bold">{unit}</div>
                    {i < 2 && <span className="text-[#ff4e00] font-bold self-center">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button className="text-[#ff4e00] text-sm font-bold border border-[#ff4e00] px-4 py-1.5 hover:bg-[#ff4e00] hover:text-white transition-all uppercase tracking-tight">
            Shop All Products
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {FLASH_SALE_PRODUCTS.map((product) => (
            <div key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100">
              <div className="aspect-square overflow-hidden bg-[#f5f5f5]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-[13px] text-[#212121] line-clamp-2 h-10 mb-2 leading-tight">{product.name}</h3>
                <p className="text-[#ff4e00] text-xl font-bold tracking-tight">฿{product.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] text-[#757575] line-through">฿{product.oldPrice.toLocaleString()}</span>
                  <span className="text-[12px] text-[#212121]">-{Math.round((1 - product.price/product.oldPrice) * 100)}%</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-3">
                   <div className="w-full h-1 bg-[#f5f5f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff4e00]" style={{ width: `${product.sold}%` }}></div>
                   </div>
                   <p className="text-[10px] text-[#757575] mt-1 uppercase font-bold">{product.sold} ITEMS SOLD</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
