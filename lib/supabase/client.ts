import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let _supabase: any = null; // 型衝突を避けるため実インスタンスで推論させる

// PKCE + cookie-based auth flow
export const supabase = (() => {
  if (!_supabase) {
    _supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _supabase;
})();
