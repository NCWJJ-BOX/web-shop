import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch, setToken as persistToken } from '../api/client';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'CUSTOMER' | 'ADMIN';
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type RegisterResponse = LoginResponse;

function readToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => readToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setBootstrapped(true);
      return;
    }
    try {
      const me = await apiFetch<AuthUser>('/api/auth/me');
      setUser(me);
    } catch {
      persistToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setBootstrapped(true);
    }
  }, [token]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      persistToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiFetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      persistToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    loading,
    bootstrapped,
    isAuthenticated,
    login,
    register,
    logout,
    refreshMe,
  };
}
