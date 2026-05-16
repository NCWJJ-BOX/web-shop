import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'CUSTOMER' | 'ADMIN';
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: u.user_metadata?.role || 'CUSTOMER',
        });
      }
      setBootstrapped(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: u.user_metadata?.role || 'CUSTOMER',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const u = data.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: u.user_metadata?.role || 'CUSTOMER',
        };
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
        const u = data.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.user_metadata?.name || name || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: 'CUSTOMER',
        };
        setUser(authUser);
        return authUser;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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
