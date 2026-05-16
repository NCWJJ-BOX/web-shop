import { useMemo, useState } from 'react';
import { X, Upload, MapPin, Phone, User as UserIcon, Package } from 'lucide-react';
import type { CartItem, Order } from '../types';
import { API_BASE } from '../api/client';

export function CheckoutModal(props: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  isAuthenticated: boolean;
  onCreateOrder: (input: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
  }) => Promise<Order>;
  onUploadSlip: (orderId: string, slip: File) => Promise<Order>;
}) {
  const { isOpen, onClose, items, total, isAuthenticated, onCreateOrder, onUploadSlip } = props;

  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  const canSubmitOrder = useMemo(() => {
    return isAuthenticated && items.length > 0 && shippingName.trim() && shippingPhone.trim() && shippingAddress.trim();
  }, [isAuthenticated, items.length, shippingName, shippingPhone, shippingAddress]);

  if (!isOpen) return null;

  const createOrder = async () => {
    setError(null);
    setCreating(true);
    try {
      const created = await onCreateOrder({
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        items: items.map((it) => ({ productId: it.id, quantity: it.quantity })),
      });
      setOrder(created);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const uploadSlip = async () => {
    if (!order || !slipFile) return;
    setError(null);
    setUploading(true);
    try {
      const updated = await onUploadSlip(order.id, slipFile);
      setOrder(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-orange-500" />
            <span className="text-lg font-bold text-gray-900">ชำระเงิน</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
          {!isAuthenticated && <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl px-4 py-2.5 text-sm">กรุณาเข้าสู่ระบบก่อนชำระเงิน</div>}

          {/* Shipping Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">ข้อมูลการจัดส่ง</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={shippingName} onChange={(e) => setShippingName(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm" placeholder="ชื่อผู้รับ" />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm" placeholder="เบอร์โทร" />
              </div>
            </div>
            <div className="relative mt-3">
              <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
              <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm" rows={2} placeholder="ที่อยู่จัดส่ง" />
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-200 text-sm font-semibold text-gray-900">รายการสินค้า</div>
            <div className="divide-y divide-gray-200">
              {items.map((it) => (
                <div key={it.id} className="px-4 py-3 flex items-center gap-3">
                  <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{it.name}</div>
                    <div className="text-xs text-gray-500">x{it.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-orange-500">฿{Math.round(it.price * 35).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-orange-50 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">ยอดรวม</span>
              <span className="text-xl font-bold text-orange-500">฿{(total * 35).toLocaleString()}</span>
            </div>
          </div>

          {!order && (
            <button disabled={!canSubmitOrder || creating} onClick={createOrder} className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 shadow-sm">
              {creating ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันคำสั่งซื้อ'}
            </button>
          )}

          {order && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">คำสั่งซื้อ</div>
                  <div className="font-bold text-gray-900">{order.orderNo}</div>
                </div>
                <span className="text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{order.status}</span>
              </div>
              <p className="text-sm text-gray-600">อัปโหลดสลิปเพื่อยืนยันการชำระเงิน</p>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
                <button disabled={!slipFile || uploading} onClick={uploadSlip} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:opacity-60 whitespace-nowrap">
                  <Upload size={14} />
                  {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                </button>
              </div>
              {order.payment?.slipPath && (
                <a className="text-sm text-orange-500 hover:text-orange-600 font-medium" href={`${API_BASE}${order.payment.slipPath}`} target="_blank" rel="noreferrer">
                  ดูสลิปที่อัปโหลด
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
