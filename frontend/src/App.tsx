import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StorePage } from './pages/StorePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { RequireAdmin } from './pages/admin/RequireAdmin';
import { AdminStatsPage } from './pages/admin/AdminStatsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorePage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminStatsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
