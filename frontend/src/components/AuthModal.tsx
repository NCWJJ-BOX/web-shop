import { useMemo, useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

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

  const title = useMemo(() => (mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'), [mode]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 p-6 text-center text-white">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User size={24} />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm opacity-80 mt-1">
            {mode === 'login' ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-orange-500"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-orange-500"
              placeholder="อีเมล"
              type="email"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-orange-500"
              placeholder="รหัสผ่าน"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            disabled={loading}
            onClick={submit}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 shadow-sm"
          >
            {loading ? 'กรุณารอสักครู่...' : title}
          </button>

          <div className="text-sm text-gray-500 text-center">
            {mode === 'login' ? (
              <button onClick={() => setMode('register')} className="text-orange-500 hover:text-orange-600 font-medium">
                ยังไม่มีบัญชี? สมัครสมาชิก
              </button>
            ) : (
              <button onClick={() => setMode('login')} className="text-orange-500 hover:text-orange-600 font-medium">
                มีบัญชีแล้ว? เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
