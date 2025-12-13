import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '../providers/AuthProvider';

type FallbackAuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

function useAuthFallback(): FallbackAuthState {
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

  return { user, loading, error, signOut, refreshUser };
}

export function useAuth() {
  const ctx = useAuthContext();
  if (ctx) return ctx;
  return useAuthFallback();
}
