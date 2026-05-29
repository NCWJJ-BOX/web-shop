import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'CUSTOMER' | 'ADMIN';
};

// Rate limiting: track failed login attempts per email
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 60_000; // 1 minute

function checkRateLimit(email: string): void {
  const entry = loginAttempts.get(email);
  if (!entry) return;
  if (entry.blockedUntil > Date.now()) {
    const secs = Math.ceil((entry.blockedUntil - Date.now()) / 1000);
    throw new Error(`Too many attempts. Try again in ${secs}s.`);
  }
  if (entry.blockedUntil <= Date.now()) {
    loginAttempts.delete(email);
  }
}

function recordFailure(email: string): void {
  const entry = loginAttempts.get(email) || { count: 0, blockedUntil: 0 };
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = Date.now() + BLOCK_DURATION;
    entry.count = 0;
  }
  loginAttempts.set(email, entry);
}

function clearRateLimit(email: string): void {
  loginAttempts.delete(email);
}

function mapUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: u.id,
    name: (u.user_metadata?.name as string) || u.email?.split('@')[0] || 'User',
    email: u.email || '',
    role: (u.app_metadata?.role as AuthUser['role']) || 'CUSTOMER',
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const mountedRef = useRef(true);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    mountedRef.current = true;

    // Validate existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      if (session?.user) {
        // Verify token is still valid by making a lightweight API call
        supabase.auth.getUser().then(({ data: { user: freshUser }, error }) => {
          if (!mountedRef.current) return;
          if (error || !freshUser) {
            // Token invalid or expired — sign out
            supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(mapUser(freshUser));
          }
          setBootstrapped(true);
        });
      } else {
        setBootstrapped(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mountedRef.current) return;
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
      // Force refresh on token refresh to get latest app_metadata
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(mapUser(session.user));
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    checkRateLimit(email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        recordFailure(email);
        throw error;
      }
      clearRateLimit(email);
      if (data.user) {
        const authUser = mapUser(data.user);
        setUser(authUser);
        return authUser;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      if (data.user) {
        const authUser = mapUser(data.user);
        setUser(authUser);
        return authUser;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // signOut() revokes the refresh token on Supabase side
    await supabase.auth.signOut({ scope: 'global' });
    setUser(null);
  }, []);

  return {
    user,
    loading,
    bootstrapped,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
