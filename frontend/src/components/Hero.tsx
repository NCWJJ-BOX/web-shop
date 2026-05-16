"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Smartphone } from 'lucide-react';

const CATEGORIES = [
  "Electronic Devices", "Electronic Accessories", "TV & Home Appliances",
  "Health & Beauty", "Babies & Toys", "Groceries & Pets",
  "Home & Living", "Womens Fashion", "Mens Fashion",
  "Fashion Accessories", "Sports & Lifestyle", "Automotive & Gadgets"
];

const BANNERS = [
  "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

export const Hero: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-[1188px] mx-auto px-4 mt-4 grid grid-cols-12 gap-0 shadow-sm border border-gray-200">
      {/* Category Sidebar */}
      <div className="col-span-2 bg-white border-r border-gray-100 py-2">
        <ul className="space-y-0.5">
          {CATEGORIES.map((cat, i) => (
            <li key={i} className="group px-3 py-1.5 flex items-center justify-between cursor-pointer hover:bg-[#eff0f5] hover:text-[#ff4e00] transition-colors">
              <span className="text-[13px] text-[#212121] group-hover:text-[#ff4e00]">{cat}</span>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-[#ff4e00]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Carousel */}
      <div className="col-span-10 lg:col-span-8 relative overflow-hidden h-[344px]">
        {BANNERS.map((banner, i) => (
          <div 
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={banner} alt={`Banner ${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {BANNERS.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentBanner(i)}
              className={`w-2.5 h-2.5 rounded-full border border-white transition-all ${i === currentBanner ? 'bg-white scale-125' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Right App Banner (Hidden on small screens) */}
      <div className="hidden lg:col-span-2 lg:flex flex-col gap-2 p-3 bg-[#eff0f5]">
         <div className="bg-white p-4 rounded flex flex-col items-center text-center gap-2 border border-gray-200">
            <Smartphone size={32} className="text-[#ff4e00]" />
            <p className="text-[13px] font-bold">Download App</p>
            <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
               <span className="text-[10px] text-gray-400">QR CODE</span>
            </div>
         </div>
         <div className="bg-gradient-to-br from-[#ff4e00] to-[#f53d2d] p-4 rounded text-white text-center flex-grow">
            <p className="text-xs uppercase tracking-widest mb-1 opacity-80">Flash Sale</p>
            <p className="text-lg font-black leading-tight">UP TO<br/>80% OFF</p>
            <button className="mt-2 bg-white text-[#ff4e00] text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Shop Now</button>
         </div>
      </div>
    </section>
  );
};
