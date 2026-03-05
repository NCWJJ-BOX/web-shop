import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireAdmin() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.bootstrapped) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (auth.user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
