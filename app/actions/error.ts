'use server';

type SupabaseError = {
  code?: string;
  message?: string;
  status?: number;
};

const isPermissionError = (error: SupabaseError) => {
  const code = typeof error.code === 'string' ? error.code : '';
  const status = typeof error.status === 'number' ? error.status : null;
  const message = typeof error.message === 'string' ? error.message : '';

  return (
    code === '42501' ||
    code === 'PGRST301' ||
    code === 'PGRST302' ||
    status === 401 ||
    status === 403 ||
    /permission denied/i.test(message) ||
    /row-level security/i.test(message)
  );
};

export const handleSupabaseError = (error: SupabaseError) => {
  if (!error) return;
  if (isPermissionError(error)) {
    throw new Error('権限がありません。');
  }
  throw error;
};
