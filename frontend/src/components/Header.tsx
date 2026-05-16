"use client";
import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  onAccountClick: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onCartClick,
  onSearchChange,
  onAccountClick,
  userName,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearchChange(val);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-center text-xs py-1.5 font-medium">
        Flash Sale! ลดสูงสุด 80% เฉพาะวันนี้
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-lg">W</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">WebShop</span>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-xl">
          <div className="relative flex">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="ค้นหาสินค้า..."
              className="w-full border-2 border-orange-500 rounded-l-xl py-2.5 px-4 text-sm focus:outline-none"
            />
            <button className="bg-orange-500 text-white px-5 rounded-r-xl hover:bg-orange-600 flex items-center">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-gray-700">
          <button
            onClick={onAccountClick}
            className="flex flex-col items-center gap-0.5 hover:text-orange-500"
          >
            <User size={22} />
            <span className="text-[11px] font-medium hidden md:block">
              {userName || 'เข้าสู่ระบบ'}
            </span>
          </button>

          <button className="relative flex flex-col items-center gap-0.5 hover:text-orange-500">
            <Heart size={22} />
            <span className="text-[11px] font-medium hidden md:block"> Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onCartClick}
            className="relative flex flex-col items-center gap-0.5 hover:text-orange-500"
          >
            <ShoppingCart size={22} />
            <span className="text-[11px] font-medium hidden md:block"> ตะกร้า</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
