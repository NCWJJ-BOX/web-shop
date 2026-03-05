import { useMemo, useState } from 'react';
import { X, Upload } from 'lucide-react';
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
  const {
    isOpen,
    onClose,
    items,
    total,
    isAuthenticated,
    onCreateOrder,
    onUploadSlip,
  } = props;

  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  const canSubmitOrder = useMemo(() => {
    return (
      isAuthenticated &&
      items.length > 0 &&
      shippingName.trim() &&
      shippingPhone.trim() &&
      shippingAddress.trim()
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="font-bold text-gray-900 text-lg">Checkout</div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl px-3 py-2 text-sm">
              Please sign in before checkout.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block md:col-span-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Name</div>
              <input
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </label>
            <label className="block md:col-span-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Phone</div>
              <input
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </label>
            <div className="md:col-span-1 bg-gray-50 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-xl font-bold text-orange-600">฿{total.toLocaleString()}</div>
            </div>
          </div>

          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Address</div>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
            />
          </label>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b font-medium text-gray-900">Items</div>
            <div className="divide-y">
              {items.map((it) => (
                <div key={it.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{it.name}</div>
                    <div className="text-sm text-gray-600">x{it.quantity}</div>
                  </div>
                  <div className="font-semibold text-gray-900">฿{Math.round(it.price * 35).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {!order && (
            <button
              disabled={!canSubmitOrder || creating}
              onClick={createOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-60"
            >
              {creating ? 'Creating order...' : 'Create order'}
            </button>
          )}

          {order && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600">Order</div>
                  <div className="font-bold text-gray-900">{order.orderNo}</div>
                </div>
                <div className="text-sm font-semibold text-gray-700">{order.status}</div>
              </div>

              <div className="text-sm text-gray-700">
                Payment simulation: attach an image slip to complete payment.
              </div>

              <label className="block">
                <div className="text-sm font-medium text-gray-700 mb-1">Slip image</div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm"
                  />
                  <button
                    disabled={!slipFile || uploading}
                    onClick={uploadSlip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-medium disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </label>

              {order.payment?.slipPath && (
                <a
                  className="text-sm text-orange-700 hover:text-orange-800 font-medium"
                  href={`${API_BASE}${order.payment.slipPath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View uploaded slip
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
