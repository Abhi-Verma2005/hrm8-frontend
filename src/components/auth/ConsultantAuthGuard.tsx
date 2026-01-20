/**
 * Consultant Auth Guard
 * Protects consultant routes and redirects to login if not authenticated
 */

import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { Loader2 } from 'lucide-react';

interface ConsultantAuthGuardProps {
  children: ReactNode;
}

export function ConsultantAuthGuard({ children }: ConsultantAuthGuardProps) {
  const { isAuthenticated, isLoading, consultant } = useConsultantAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('[AuthGuard] Not authenticated. Redirecting to login. Path:', location.pathname);
        // Redirect to appropriate login based on path
        if (location.pathname.startsWith('/sales-agent')) {
          navigate('/sales-agent/login', { replace: true });
        } else {
          navigate('/consultant/login', { replace: true });
        }
        return;
      }

      // Check for role mismatch
      const isSalesRoute = location.pathname.startsWith('/sales-agent');
      const isSalesAgent = consultant?.role === 'SALES_AGENT';

      console.log('[AuthGuard] Auth check:', {
        path: location.pathname,
        role: consultant?.role,
        isSalesRoute,
        isSalesAgent
      });

      // CONSULTANT_360 has access to everything
      if (consultant?.role === 'CONSULTANT_360') {
        return;
      }

      if (isSalesRoute && !isSalesAgent) {
        console.warn('[AuthGuard] Role mismatch: Non-sales agent accessing sales route. Redirecting.');
        // Non-sales agent trying to access sales dashboard
        navigate('/consultant/dashboard', { replace: true });
      } else if (!isSalesRoute && isSalesAgent) {
        console.warn('[AuthGuard] Role mismatch: Sales agent accessing consultant route. Redirecting.');
        // Sales agent trying to access consultant dashboard
        navigate('/sales-agent/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, consultant]);

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

