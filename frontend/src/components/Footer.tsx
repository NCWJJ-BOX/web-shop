import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-6">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WebShop</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              ช้อปปิ้งออนไลน์ สินค้าคุณภาพ ราคาดี จัดส่งไว ทั่วประเทศ
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">ช้อปปิ้ง</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500">สินค้าทั้งหมด</a></li>
              <li><a href="#" className="hover:text-orange-500">Flash Sale</a></li>
              <li><a href="#" className="hover:text-orange-500">สินค้าใหม่</a></li>
              <li><a href="#" className="hover:text-orange-500">สินค้ายอดนิยม</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">ช่วยเหลือ</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500">ศูนย์ช่วยเหลือ</a></li>
              <li><a href="#" className="hover:text-orange-500">วิธีการชำระเงิน</a></li>
              <li><a href="#" className="hover:text-orange-500">การจัดส่ง</a></li>
              <li><a href="#" className="hover:text-orange-500">คืนสินค้า & คืนเงิน</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">ติดต่อเรา</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-orange-500" />
                <span>support@webshop.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-orange-500" />
                <span>02-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-orange-500" />
                <span>กรุงเทพมหานคร, ประเทศไทย</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400">
            &copy; 2026 WebShop. สงวนลิขสิทธิ์
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-orange-500">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-orange-500">ข้อกำหนดการใช้งาน</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
