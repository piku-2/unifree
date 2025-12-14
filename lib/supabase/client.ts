"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient<Database>>;

const globalForSupabase = globalThis as typeof globalThis & {
  __supabaseBrowserClient?: SupabaseBrowserClient;
};

const supabaseBrowserClient =
  globalForSupabase.__supabaseBrowserClient ??
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    isSingleton: true,
  });

if (!globalForSupabase.__supabaseBrowserClient) {
  globalForSupabase.__supabaseBrowserClient = supabaseBrowserClient;
}

export const getSupabaseBrowserClient = () => supabaseBrowserClient;

// PKCE + cookie-based auth flow
export const supabase = supabaseBrowserClient;
