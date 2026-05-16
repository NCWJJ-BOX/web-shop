"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchCategories } from '../lib/db';
import { Category } from '../types';

const BANNERS = [
  "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

export const Hero: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-4">
      <div className="grid grid-cols-12 gap-3">
        {/* Category Sidebar */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 py-2 shadow-sm hidden lg:block">
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">หมวดหมู่</span>
          </div>
          <ul className="py-1">
            {categories.map((cat) => (
              <li key={cat.id} className="group px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors">
                <span className="text-[13px] text-gray-700 group-hover:text-orange-500">{cat.name}</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-500" />
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel */}
        <div className="col-span-12 lg:col-span-9 relative overflow-hidden rounded-2xl h-[320px] shadow-sm">
          {BANNERS.map((banner, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={banner} alt={`Banner ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center pl-12">
                <div className="text-white">
                  <p className="text-sm font-medium mb-2 opacity-80">Special Offer</p>
                  <h2 className="text-3xl font-black mb-3 leading-tight">ลดราคา<br />สูงสุด 80%</h2>
                  <button className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg">
                    ช้อปเลย
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentBanner ? 'bg-orange-500 w-6' : 'bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
