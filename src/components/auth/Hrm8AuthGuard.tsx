/**
 * HRM8 Auth Guard
 * Protects HRM8 routes and redirects to login if not authenticated
 */

import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { Loader2 } from 'lucide-react';

interface Hrm8AuthGuardProps {
  children: ReactNode;
}

export function Hrm8AuthGuard({ children }: Hrm8AuthGuardProps) {
  const { isAuthenticated, isLoading } = useHrm8Auth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/hrm8/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

