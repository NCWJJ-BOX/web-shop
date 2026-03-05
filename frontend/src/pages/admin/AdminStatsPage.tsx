import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

type AdminStats = {
  revenueTotal: number;
  paidOrdersCount: number;
  totalOrdersCount: number;
  pendingPaymentCount: number;
  recentOrders: Array<{
    id: string;
    orderNo: string;
    status: string;
    total: number;
    createdAt: string;
    user: { id: string; name: string; email: string };
  }>;
  topProducts: Array<{
    productId: string;
    name: string;
    image: string;
    quantity: number;
    revenue: number;
  }>;
};

export function AdminStatsPage() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AdminStats>('/api/admin/stats')
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  if (error) {
    return <div className="text-red-700">{error}</div>;
  }
  if (!data) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-2xl font-bold text-gray-900">Sales Overview</div>
        <div className="text-sm text-gray-600">Paid revenue and order health</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="text-xs text-gray-600">Revenue (Paid)</div>
          <div className="text-2xl font-bold text-gray-900">฿{data.revenueTotal.toLocaleString()}</div>
        </div>
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="text-xs text-gray-600">Paid Orders</div>
          <div className="text-2xl font-bold text-gray-900">{data.paidOrdersCount}</div>
        </div>
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="text-xs text-gray-600">All Orders</div>
          <div className="text-2xl font-bold text-gray-900">{data.totalOrdersCount}</div>
        </div>
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="text-xs text-gray-600">Pending Payments</div>
          <div className="text-2xl font-bold text-gray-900">{data.pendingPaymentCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="font-semibold text-gray-900 mb-3">Top Products</div>
          <div className="space-y-2">
            {data.topProducts.map((p) => (
              <div key={p.productId} className="flex items-center justify-between">
                <div className="min-w-0 flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-600">Qty {p.quantity}</div>
                  </div>
                </div>
                <div className="font-semibold text-gray-900">฿{p.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="font-semibold text-gray-900 mb-3">Recent Orders</div>
          <div className="space-y-2">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{o.orderNo}</div>
                  <div className="text-xs text-gray-600 truncate">{o.user.name} · {o.status}</div>
                </div>
                <div className="font-semibold text-gray-900">฿{o.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
