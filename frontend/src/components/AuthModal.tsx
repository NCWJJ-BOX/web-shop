import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

type Mode = 'login' | 'register';

export function AuthModal(props: {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}) {
  const { isOpen, onClose, loading, onLogin, onRegister } = props;
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === 'login' ? 'Sign in' : 'Create account'), [mode]);

  if (!isOpen) return null;

  const submit = async () => {
    setError(null);
    try {
      if (mode === 'login') {
        await onLogin(email, password);
        onClose();
        return;
      }
      await onRegister(name, email, password);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="font-bold text-gray-900 text-lg">{title}</div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Minimum 6 characters"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          <button
            disabled={loading}
            onClick={submit}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div className="text-sm text-gray-600 text-center">
            {mode === 'login' ? (
              <button
                onClick={() => setMode('register')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Create an account
              </button>
            ) : (
              <button
                onClick={() => setMode('login')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
