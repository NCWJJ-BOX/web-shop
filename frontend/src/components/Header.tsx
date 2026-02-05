"use client";
import React from 'react';
import { Search, ShoppingCart, User, Globe, PhoneCall, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="w-full">
      {/* Top Campaign Banner Mockup */}
      <div className="w-full h-[40px] bg-[#fde9e7] flex items-center justify-center text-[#ff4e00] text-xs font-bold cursor-pointer hover:underline">
        ช้อปคุ้มกว่าเดิม! แจกโค้ดส่วนลดสูงสุด 500 บาท เฉพาะวันนี้เท่านั้น
      </div>

      {/* Utility Bar */}
      <div className="w-full bg-[#eff0f5] py-1 border-b border-gray-200">
        <div className="max-w-[1188px] mx-auto px-4 flex justify-end gap-6 text-[12px] text-[#757575]">
          <a href="#" className="hover:text-[#ff4e00] flex items-center gap-1"><PhoneCall size={12} /> ติดต่อเรา</a>
          <a href="#" className="hover:text-[#ff4e00] flex items-center gap-1"><HelpCircle size={12} /> ศูนย์ช่วยเหลือ</a>
          <a href="#" className="hover:text-[#ff4e00] flex items-center gap-1 uppercase tracking-tighter font-bold text-[#00126d]">Lazada Logistics</a>
          <a href="#" className="hover:text-[#ff4e00]">ติดตามสินค้า</a>
          <a href="#" className="hover:text-[#ff4e00]">ลงชื่อเข้าใช้</a>
          <a href="#" className="hover:text-[#ff4e00]">สมัครสมาชิก</a>
          <a href="#" className="hover:text-[#ff4e00] flex items-center gap-1">CHANGE LANGUAGE <Globe size={12} /></a>
        </div>
      </div>

      {/* Main Header (Sticky) */}
      <header className="sticky top-0 z-50 bg-white shadow-sm py-4">
        <div className="max-w-[1188px] mx-auto px-4 flex items-center gap-8">
          {/* Logo Placeholder */}
          <div className="flex-shrink-0 cursor-pointer">
             <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-[#ff4e00] rounded-lg flex items-center justify-center">
                   <span className="text-white font-black text-xl italic">L</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-[#00126d]">Lazada</span>
             </div>
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-[700px]">
            <div className="relative flex">
              <input 
                type="text" 
                placeholder="ค้นหาในลาซาด้า" 
                className="w-full bg-[#eff0f5] py-2.5 px-4 outline-none text-sm placeholder:text-[#9e9e9e] focus:bg-white focus:ring-1 focus:ring-[#ff4e00] transition-all"
              />
              <button className="bg-[#ff4e00] text-white px-5 flex items-center justify-center hover:bg-[#e64600] transition-colors">
                <Search size={20} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-8 text-[#00126d]">
            <div className="relative cursor-pointer hover:opacity-80">
              <ShoppingCart size={28} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-[#ff4e00] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </div>
            <div className="cursor-pointer hover:opacity-80">
               <img 
                 src="https://laz-img-cdn.alicdn.com/tfs/TB196t_Xv1TBuNjy0FjXXajpXXa-32-32.png" 
                 alt="wallet" 
                 className="w-7 h-7 object-contain"
               />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
