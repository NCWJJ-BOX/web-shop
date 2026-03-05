import { useEffect, useState } from 'react';
import { X, LogOut, Upload } from 'lucide-react';
import type { Order } from '../types';
import { API_BASE } from '../api/client';

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

  const doLogout = () => {
    onLogout();
    onClose();
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <div className="font-bold text-gray-900 text-lg">Account</div>
            <div className="text-sm text-gray-600">{user.name} · {user.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={doLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 hover:border-orange-500 hover:text-orange-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="font-semibold text-gray-900">My Orders</div>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600">No orders yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{o.orderNo}</div>
                      <div className="text-sm text-gray-600">Total ฿{o.total.toLocaleString()} · {o.status}</div>
                    </div>
                    <div className="text-right">
                      {o.payment?.status === 'REJECTED' && o.payment.reviewNote && (
                        <div className="text-xs text-red-700">Rejected: {o.payment.reviewNote}</div>
                      )}
                      {o.payment?.slipPath && (
                        <a
                          className="text-sm text-orange-700 hover:text-orange-800 font-medium"
                          href={`${API_BASE}${o.payment.slipPath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Slip
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="text-sm text-gray-700">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex justify-between">
                          <span className="truncate pr-4">{it.name} x{it.quantity}</span>
                          <span className="font-medium">฿{it.lineTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {o.status !== 'PAID' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => void onFile(o.id, e.target.files?.[0] ?? null)}
                          className="block w-full text-sm"
                        />
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                          <Upload className="h-4 w-4" />
                          {uploadingOrderId === o.id ? 'Uploading...' : 'Upload slip'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
