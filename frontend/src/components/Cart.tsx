import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-orange-500" />
            ตะกร้าสินค้า ({items.length})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">ตะกร้าว่างเปล่า</p>
              <p className="text-gray-400 text-sm mt-1">เพิ่มสินค้าเพื่อเริ่มช้อปปิ้ง</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                  <p className="text-orange-500 font-bold text-sm mt-1">฿{(item.price * 35).toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ยอดรวม</span>
              <span className="text-2xl font-bold text-orange-500">฿{(total * 35).toLocaleString()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 shadow-sm"
            >
              ดำเนินการชำระเงิน
            </button>
            <button
              onClick={onClearCart}
              className="w-full text-gray-500 py-2 text-sm hover:text-red-500"
            >
              ล้างตะกร้า
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
