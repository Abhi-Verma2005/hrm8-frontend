/**
 * Consultant Auth Guard
 * Protects consultant routes and redirects to login if not authenticated
 */

import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { Loader2 } from 'lucide-react';

interface ConsultantAuthGuardProps {
  children: ReactNode;
}

export function ConsultantAuthGuard({ children }: ConsultantAuthGuardProps) {
  const { isAuthenticated, isLoading } = useConsultantAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/consultant/login', { replace: true });
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

