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
        } else if (location.pathname.startsWith('/consultant360')) {
          navigate('/consultant/login', { replace: true });
        } else {
          navigate('/consultant/login', { replace: true });
        }
        return;
      }

      // Check for role-based access
      const isSalesRoute = location.pathname.startsWith('/sales-agent');
      const isConsultant360Route = location.pathname.startsWith('/consultant360');
      const isSalesAgent = consultant?.role === 'SALES_AGENT';
      const isConsultant360 = consultant?.role === 'CONSULTANT_360';

      console.log('[AuthGuard] Auth check:', {
        path: location.pathname,
        role: consultant?.role,
        isSalesRoute,
        isConsultant360Route,
        isSalesAgent,
        isConsultant360
      });

      // CONSULTANT_360 can access ALL routes - no redirection needed
      if (isConsultant360) {
        console.log('[AuthGuard] CONSULTANT_360 user - full access granted');
        return;
      }

      // Regular role-based access control
      if (isConsultant360Route) {
        // Only CONSULTANT_360 can access consultant360 routes
        console.warn('[AuthGuard] Non-CONSULTANT_360 accessing consultant360 route. Redirecting.');
        if (isSalesAgent) {
          navigate('/sales-agent/dashboard', { replace: true });
        } else {
          navigate('/consultant/dashboard', { replace: true });
        }
      } else if (isSalesRoute && !isSalesAgent) {
        console.warn('[AuthGuard] Role mismatch: Non-sales agent accessing sales route. Redirecting.');
        navigate('/consultant/dashboard', { replace: true });
      } else if (!isSalesRoute && !isConsultant360Route && isSalesAgent) {
        console.warn('[AuthGuard] Role mismatch: Sales agent accessing consultant route. Redirecting.');
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

