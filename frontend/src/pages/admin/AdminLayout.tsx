import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CreditCard, Package, Store, LogOut, Truck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function classNames(active: boolean) {
  return active
    ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-200'
    : 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 border border-transparent';
}

export function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500" />
                <div>
                  <div className="font-bold text-gray-900">Store Admin</div>
                  <div className="text-xs text-gray-600">Dashboard</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-xl hover:bg-gray-50 text-gray-700"
                aria-label="Back to store"
              >
                <Store className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-200">
              <div className="text-xs text-gray-600">Signed in as</div>
              <div className="font-semibold text-gray-900 truncate">{auth.user?.name ?? 'Admin'}</div>
              <div className="text-xs text-gray-600 truncate">{auth.user?.email ?? ''}</div>
            </div>

            <nav className="space-y-2">
              <NavLink to="/admin" end className={({ isActive }) => classNames(isActive)}>
                <BarChart3 className="h-5 w-5" />
                Sales
              </NavLink>
              <NavLink to="/admin/payments" className={({ isActive }) => classNames(isActive)}>
                <CreditCard className="h-5 w-5" />
                Payments
              </NavLink>
              <NavLink to="/admin/orders" className={({ isActive }) => classNames(isActive)}>
                <Truck className="h-5 w-5" />
                Orders
              </NavLink>
              <NavLink to="/admin/products" className={({ isActive }) => classNames(isActive)}>
                <Package className="h-5 w-5" />
                Products
              </NavLink>
            </nav>

            <div className="mt-4">
              <button
                onClick={() => {
                  auth.logout();
                  navigate('/');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>

          <main className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
