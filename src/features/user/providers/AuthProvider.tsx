'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data, error: userError }) => {
        if (userError) {
          setError(userError);
          return;
        }
        setUser(data.user ?? null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError);
      throw signOutError;
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const { data, error: refreshError } = await supabase.auth.getUser();
      if (refreshError) {
        setError(refreshError);
        return;
      }
      setUser(data.user ?? null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signOut,
      refreshUser,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  return ctx;
}
