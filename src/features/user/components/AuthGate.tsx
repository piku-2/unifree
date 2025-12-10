import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthGateProps = {
  children: ReactNode;
  fallback: ReactNode; // Force fallback to handle redirect or login prompt explicitly
};

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
