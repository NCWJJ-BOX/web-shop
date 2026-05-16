import { useEffect, useState } from 'react';
import { X, LogOut, Upload, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '../types';
import { API_BASE } from '../api/client';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING_PAYMENT: { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PAYMENT_SUBMITTED: { label: 'รอตรวจสอบ', color: 'bg-blue-100 text-blue-700', icon: Clock },
  PAID: { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  PACKED: { label: 'กำลังแพ็ค', color: 'bg-blue-100 text-blue-700', icon: Package },
  SHIPPED: { label: 'จัดส่งแล้ว', color: 'bg-purple-100 text-purple-700', icon: Package },
  DELIVERED: { label: 'สำเร็จ', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function AccountModal(props: {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string };
  onLogout: () => void;
  loadOrders: () => Promise<Order[]>;
  uploadSlip: (orderId: string, slip: File) => Promise<Order>;
}) {
  const { isOpen, onClose, user, onLogout, loadOrders, uploadSlip } = props;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    loadOrders()
      .then((data) => setOrders(data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false));
  }, [isOpen, loadOrders]);

  if (!isOpen) return null;

  const doLogout = () => { onLogout(); onClose(); };

  const onFile = async (orderId: string, file: File | null) => {
    if (!file) return;
    setUploadingOrderId(orderId);
    setError(null);
    try {
      const updated = await uploadSlip(orderId, file);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setUploadingOrderId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-orange-500 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-sm opacity-80">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={doLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium">
                <LogOut size={14} />
                ออกจากระบบ
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2.5 text-sm mb-4">{error}</div>}

          <h3 className="text-base font-bold text-gray-900 mb-4">คำสั่งซื้อของฉัน</h3>

          {loading ? (
            <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">ยังไม่มีคำสั่งซื้อ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const statusConf = STATUS_CONFIG[o.status] || { label: o.status, color: 'bg-gray-100 text-gray-700', icon: Clock };
                const StatusIcon = statusConf.icon;
                return (
                  <div key={o.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{o.orderNo}</div>
                          <div className="text-xs text-gray-500">฿{o.total.toLocaleString()}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusConf.color}`}>
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                      </div>
                      {o.payment?.status === 'REJECTED' && o.payment.reviewNote && (
                        <span className="text-xs text-red-500">เหตุผล: {o.payment.reviewNote}</span>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="text-sm text-gray-600 space-y-1">
                        {o.items.map((it) => (
                          <div key={it.id} className="flex justify-between">
                            <span className="truncate pr-4">{it.name} x{it.quantity}</span>
                            <span className="font-medium text-gray-900">฿{it.lineTotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      {o.status !== 'PAID' && (
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <label className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-orange-500">
                              <Upload size={14} />
                              <span>{uploadingOrderId === o.id ? 'กำลังอัปโหลด...' : 'อัปโหลดสลิป'}</span>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => void onFile(o.id, e.target.files?.[0] ?? null)} className="hidden" />
                          </label>
                          {o.payment?.slipPath && (
                            <a className="text-sm text-orange-500 hover:text-orange-600 font-medium" href={`${API_BASE}${o.payment.slipPath}`} target="_blank" rel="noreferrer">
                              ดูสลิป
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
