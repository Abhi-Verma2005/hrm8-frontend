/**
 * Consultant Authentication Context
 * Manages consultant authentication state
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantAuthService } from '@/lib/consultantAuthService';
import { useToast } from '@/hooks/use-toast';

export interface ConsultantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'RECRUITER' | 'SALES_AGENT' | 'CONSULTANT_360';
  status: string;
}

interface ConsultantAuthContextType {
  consultant: ConsultantUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshConsultant: () => Promise<void>;
}

const ConsultantAuthContext = createContext<ConsultantAuthContextType | undefined>(undefined);

export function ConsultantAuthProvider({ children }: { children: ReactNode }) {
  const [consultant, setConsultant] = useState<ConsultantUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if consultant is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await consultantAuthService.getCurrentConsultant();
      if (response.success && response.data?.consultant) {
        setConsultant(response.data.consultant);
      } else {
        setConsultant(null);
      }
    } catch (error) {
      setConsultant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await consultantAuthService.login({ email, password });
      if (response.success && response.data?.consultant) {
        setConsultant(response.data.consultant);
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${response.data.consultant.firstName} ${response.data.consultant.lastName}`,
        });
        navigate('/consultant/dashboard');
        return { success: true };
      }
      const errorMessage = response.error || 'Login failed';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await consultantAuthService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setConsultant(null);
      navigate('/consultant/login');
    }
  };

  const refreshConsultant = async (): Promise<void> => {
    try {
      const response = await consultantAuthService.getCurrentConsultant();
      if (response.success && response.data?.consultant) {
        setConsultant(response.data.consultant);
      } else {
        setConsultant(null);
      }
    } catch (error) {
      setConsultant(null);
    }
  };

  return (
    <ConsultantAuthContext.Provider
      value={{
        consultant,
        isLoading,
        isAuthenticated: !!consultant,
        login,
        logout,
        refreshConsultant,
      }}
    >
      {children}
    </ConsultantAuthContext.Provider>
  );
}

export function useConsultantAuth() {
  const context = useContext(ConsultantAuthContext);
  if (context === undefined) {
    throw new Error('useConsultantAuth must be used within a ConsultantAuthProvider');
  }
  return context;
}

