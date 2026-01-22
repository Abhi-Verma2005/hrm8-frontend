/**
 * Consultant Auth Guard
 * Protects consultant routes with STRICT role isolation
 * 
 * Access Matrix:
 * - RECRUITER → /consultant/* ONLY
 * - SALES_AGENT → /sales-agent/* ONLY
 * - CONSULTANT_360 → /consultant360/* ONLY
 */

import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { Loader2 } from 'lucide-react';

interface ConsultantAuthGuardProps {
  children: ReactNode;
}

// Strict role-to-route mapping
const ROLE_ROUTE_PREFIX: Record<string, string> = {
  'RECRUITER': '/consultant',
  'SALES_AGENT': '/sales-agent',
  'CONSULTANT_360': '/consultant360'
};

const ROLE_LOGIN_PATH: Record<string, string> = {
  'RECRUITER': '/consultant/login',
  'SALES_AGENT': '/sales-agent/login',
  'CONSULTANT_360': '/consultant/login' // 360 users login via consultant login
};

export function ConsultantAuthGuard({ children }: ConsultantAuthGuardProps) {
  const { isAuthenticated, isLoading, consultant, refreshConsultant } = useConsultantAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRefreshed = useRef(false);

  // Refresh consultant data on mount to catch any role changes made by admin
  useEffect(() => {
    if (isAuthenticated && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshConsultant();
    }
  }, [isAuthenticated, refreshConsultant]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('[AuthGuard] Not authenticated. Redirecting to login. Path:', location.pathname);
        // Redirect to appropriate login based on path
        // Redirect to appropriate login based on path
        if (location.pathname.startsWith('/sales-agent')) {
          navigate('/sales-agent/login', { replace: true });
        } else if (location.pathname.startsWith('/consultant360')) {
          navigate('/consultant360/login', { replace: true });
        } else {
          navigate('/consultant/login', { replace: true });
        }
        return;
      }

      const role = consultant?.role;
      if (!role) {
        console.warn('[AuthGuard] No role found. Redirecting to login.');
        navigate('/consultant/login', { replace: true });
        return;
      }

      // Get the route prefix this role is allowed to access
      const allowedRoutePrefix = ROLE_ROUTE_PREFIX[role];
      const isAccessingAllowedRoute = location.pathname.startsWith(allowedRoutePrefix);

      console.log('[AuthGuard] Strict role check:', {
        path: location.pathname,
        role,
        allowedRoutePrefix,
        isAccessingAllowedRoute
      });

      // If user is trying to access a route they shouldn't, redirect to their dashboard
      if (!isAccessingAllowedRoute) {
        console.warn(`[AuthGuard] Role ${role} cannot access ${location.pathname}. Redirecting to ${allowedRoutePrefix}/dashboard`);
        navigate(`${allowedRoutePrefix}/dashboard`, { replace: true });
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

