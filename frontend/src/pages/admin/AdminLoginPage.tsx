import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AdminLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@store.local');
  const [password, setPassword] = useState('admin1234');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      const user = await auth.login(email, password);
      if (user.role !== 'ADMIN') {
        auth.logout();
        setError('Not an admin account');
        return;
      }
      navigate('/admin');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="font-bold text-2xl text-gray-900">Admin Sign In</div>
        <div className="text-sm text-gray-600 mt-1">Use your store admin account</div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-3">
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </label>
          <button
            disabled={auth.loading}
            onClick={() => void submit()}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-60"
          >
            {auth.loading ? 'Please wait...' : 'Sign in'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-orange-500 hover:text-orange-600"
          >
            Back to store
          </button>
        </div>
      </div>
    </div>
  );
}
