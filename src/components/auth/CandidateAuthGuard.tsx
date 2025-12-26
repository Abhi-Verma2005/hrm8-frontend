/**
 * Candidate Auth Guard
 * Protects candidate routes that require authentication
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { Loader2 } from 'lucide-react';

interface CandidateAuthGuardProps {
  children: ReactNode;
}

export function CandidateAuthGuard({ children }: CandidateAuthGuardProps) {
  const { isAuthenticated, isLoading } = useCandidateAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/candidate/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

