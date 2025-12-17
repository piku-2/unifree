import { createClient } from '@supabase/supabase-js';

function requireEnv(names: string[]) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `[supabase] Missing required environment variable(s): ${missing.join(', ')}`
    );
  }

  const values: Record<string, string> = {};
  names.forEach((name) => {
    values[name] = process.env[name] as string;
  });
  return values;
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = requireEnv([
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]);

export const supabaseAdmin = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
