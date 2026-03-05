import { useEffect, useMemo, useState } from 'react';
import { Check, XCircle } from 'lucide-react';
import { apiFetch } from '../../api/client';
import { API_BASE } from '../../api/client';
import type { Order, Payment } from '../../types';
import { ImagePreviewModal } from '../../components/ImagePreviewModal';

type AdminPayment = Payment & {
  order: Order & {
    user: { id: string; name: string; email: string };
  };
};

export function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const pending = useMemo(() => payments.filter((p) => p.status === 'SUBMITTED'), [payments]);

  const load = async () => {
    setError(null);
    try {
      const data = await apiFetch<AdminPayment[]>('/api/admin/payments');
      setPayments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const approve = async (paymentId: string) => {
    setError(null);
    try {
      await apiFetch(`/api/admin/payments/${paymentId}/approve`, { method: 'POST' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  const reject = async (paymentId: string) => {
    setError(null);
    try {
      await apiFetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ note: rejectNote }),
      });
      setRejectingId(null);
      setRejectNote('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold text-gray-900">Payments</div>
        <div className="text-sm text-gray-600">Pending: {pending.length}</div>
      </div>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">{error}</div>}

      <div className="space-y-3">
        {payments.length === 0 ? (
          <div className="text-gray-600">No payments</div>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{p.order.orderNo} · {p.status}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {p.order.user.name} ({p.order.user.email}) · ฿{p.order.total.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    className="text-sm text-orange-700 hover:text-orange-800 font-medium"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrl(`${API_BASE}${p.slipPath}`);
                      setPreviewTitle(p.order.orderNo);
                    }}
                  >
                    Slip
                  </a>
                  <button
                    disabled={p.status !== 'SUBMITTED'}
                    onClick={() => void approve(p.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    disabled={p.status !== 'SUBMITTED'}
                    onClick={() => {
                      setRejectingId(p.id);
                      setRejectNote('');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white font-medium disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {rejectingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setRejectingId(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold text-gray-900">Reject payment</div>
            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-600">Write a reason (required)</div>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600"
                >
                  Cancel
                </button>
                <button
                  disabled={!rejectNote.trim()}
                  onClick={() => void reject(rejectingId)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ImagePreviewModal
        isOpen={Boolean(previewUrl)}
        url={previewUrl}
        title={previewTitle ?? undefined}
        onClose={() => {
          setPreviewUrl(null);
          setPreviewTitle(null);
        }}
      />
    </div>
  );
}
