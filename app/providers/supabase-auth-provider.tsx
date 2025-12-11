'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/libs/supabase/client';

type SupabaseAuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(undefined);

type SupabaseAuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
};

export function SupabaseAuthProvider({ children, initialUser }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      signOut,
    }),
    [user],
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  return useContext(SupabaseAuthContext);
}
