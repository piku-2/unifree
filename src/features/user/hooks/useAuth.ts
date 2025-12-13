import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '../providers/AuthProvider';

type FallbackAuthState = {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

function useAuthFallback(): FallbackAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (sessionError) {
        setError(sessionError);
      }
      setUser(data.session?.user ?? null);
      setHydrated(true);
      setLoading(false);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setUser(nextSession?.user ?? null);
      setHydrated(true);
      setLoading(false);
    });

    return () => {
      isMounted = false;
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
      const { data, error: refreshError } = await supabase.auth.getSession();
      if (refreshError) {
        setError(refreshError);
        return;
      }
      setUser(data.session?.user ?? null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, hydrated, error, signOut, refreshUser };
}

export function useAuth() {
  const ctx = useAuthContext();
  if (ctx) return ctx;
  return useAuthFallback();
}
