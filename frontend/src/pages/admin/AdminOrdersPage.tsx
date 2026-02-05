import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { apiFetch } from '../../api/client';
import type { Order, OrderStatus } from '../../types';

type AdminOrder = Order & {
  user: { id: string; name: string; email: string };
};

const STATUSES: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_SUBMITTED',
  'PAID',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const load = async () => {
    setError(null);
    try {
      const q = filter === 'ALL' ? '' : `?status=${encodeURIComponent(filter)}`;
      const data = await apiFetch<AdminOrder[]>(`/api/admin/orders${q}`);
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  useEffect(() => {
    void load();
  }, [filter]);

  const updateShipping = async (orderId: string, patch: { status?: OrderStatus; carrier?: string; trackingNo?: string }) => {
    setSavingId(orderId);
    setError(null);
    try {
      const updated = await apiFetch<AdminOrder>(`/api/admin/orders/${orderId}/shipping`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">Orders</div>
          <div className="text-sm text-gray-600">Manage fulfillment and tracking</div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-xl px-3 py-2"
        >
          <option value="ALL">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-gray-600">No orders</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{o.orderNo} · {o.status}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {o.user.name} ({o.user.email}) · ฿{o.total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block">
                    <div className="text-xs text-gray-600 mb-1">Status</div>
                    <select
                      defaultValue={o.status}
                      onChange={(e) => void updateShipping(o.id, { status: e.target.value as OrderStatus })}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <div className="text-xs text-gray-600 mb-1">Carrier</div>
                    <input
                      defaultValue={o.shipment?.carrier ?? ''}
                      onBlur={(e) => void updateShipping(o.id, { carrier: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2"
                      placeholder="ThaiPost / Kerry"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs text-gray-600 mb-1">Tracking No</div>
                    <input
                      defaultValue={o.shipment?.trackingNo ?? ''}
                      onBlur={(e) => void updateShipping(o.id, { trackingNo: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2"
                      placeholder="Tracking number"
                    />
                  </label>
                </div>

                <div className="text-xs text-gray-500">
                  Shipping to: {o.shippingName} · {o.shippingPhone} · {o.shippingAddress}
                </div>

                <button
                  disabled={savingId === o.id}
                  onClick={() => void load()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingId === o.id ? 'Saving...' : 'Refresh list'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
