/**
 * Authentication Context
 * Manages authentication state across the application
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '@/lib/authService';
import { useToast } from '@/hooks/use-toast';

const PENDING_VERIFICATION_KEY = 'hrm8PendingVerification';
const LAST_VERIFICATION_KEY = 'hrm8LastVerification';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; pendingVerification?: { email: string; companyId?: string } }>;
  logout: () => Promise<void>;
  registerCompany: (data: {
    companyName: string;
    companyWebsite: string;
    adminEmail: string;
    adminName: string;
    password: string;
  }) => Promise<{ success: boolean; verificationRequired?: boolean; email?: string }>;
  verifyCompany: (token: string, companyId: string, email?: string, password?: string) => Promise<{ success: boolean; email?: string; needsPassword?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; pendingVerification?: { email: string; companyId?: string } }> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${response.data.user.email}`,
        });
        navigate('/home');
        return { success: true };
      } else {
        const errorMessage =
          response.error?.toLowerCase().includes('invalid email or password')
            ? 'Invalid email or password'
            : response.error || 'Invalid email or password';
        const pendingDetails =
          response.details?.code === 'PENDING_VERIFICATION'
            ? {
                email: (response.details.email as string) || email,
                companyId: response.details.companyId as string | undefined,
              }
            : null;

        if (pendingDetails) {
          toast({
            title: 'Verify your email',
            description: 'Please check your inbox for the verification link we just sent.',
          });
          return { success: false, pendingVerification: pendingDetails };
        }

        toast({
          title: 'Login failed',
          description: errorMessage,
          variant: 'destructive',
        });
        return { success: false };
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      navigate('/login');
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      navigate('/login');
    }
  };

  const registerCompany = async (data: {
    companyName: string;
    companyWebsite: string;
    adminEmail: string;
    adminName: string;
    password: string;
  }): Promise<{ success: boolean; verificationRequired?: boolean; email?: string }> => {
    try {
      setIsLoading(true);
      const response = await authService.registerCompany(data);

      if (response.success && response.data) {
        // Check if verification is required
        if (response.data.verificationRequired) {
          // Store credentials temporarily for auto-login after verification
          const pendingPayload = JSON.stringify({
            email: data.adminEmail,
            password: data.password,
          });
          sessionStorage.setItem(PENDING_VERIFICATION_KEY, pendingPayload);
          localStorage.setItem(PENDING_VERIFICATION_KEY, pendingPayload);

          toast({
            title: 'Verification email sent!',
            description: `Please check your email (${data.adminEmail}) to verify your company.`,
          });

          return {
            success: true,
            verificationRequired: true,
            email: data.adminEmail,
          };
        } else {
          // Auto-verified (domain matched), auto-login
          toast({
            title: 'Company registered!',
            description: response.data.message || 'Company registered and verified successfully',
          });
          const loginResult = await login(data.adminEmail, data.password);
          return { success: loginResult.success };
        }
      } else {
        toast({
          title: 'Registration failed',
          description: response.error || 'Failed to register company',
          variant: 'destructive',
        });
        return { success: false };
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCompany = async (token: string, companyId: string, email?: string, password?: string): Promise<{ success: boolean; email?: string; needsPassword?: boolean }> => {
    try {
      setIsLoading(true);
      const response = await authService.verifyCompany({ token, companyId });

      if (response.success && response.data) {
        const verifiedEmail = response.data.email || email;
        
        if (!verifiedEmail) {
          return { success: false, needsPassword: false };
        }

        // If backend returned user data, it means a session was created automatically
        // Set the user in context and we're done
        if (response.data.user) {
          setUser(response.data.user);
          toast({
            title: 'Company verified!',
            description: response.data.message || 'Your company has been verified successfully',
          });
          
          // Clear stored credentials
          sessionStorage.removeItem('pendingVerification');
          
          return { success: true, email: verifiedEmail };
        }

        // If no user data returned, try to auto-login if we have credentials
        if (email && password) {
          const loginResult = await login(email, password);
          
          // Clear stored credentials
          sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
          localStorage.removeItem(PENDING_VERIFICATION_KEY);
          localStorage.setItem(
            LAST_VERIFICATION_KEY,
            JSON.stringify({
              email: verifiedEmail,
              timestamp: new Date().toISOString(),
            })
          );
          
          if (loginResult.success) {
            return { success: true, email: verifiedEmail };
          }

          return { success: true, email: verifiedEmail, needsPassword: true };
        } else {
          // No credentials available, return email for manual login
          sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
          localStorage.removeItem(PENDING_VERIFICATION_KEY);
          localStorage.setItem(
            LAST_VERIFICATION_KEY,
            JSON.stringify({
              email: verifiedEmail,
              timestamp: new Date().toISOString(),
            })
          );
          return { success: true, email: verifiedEmail, needsPassword: true };
        }
      } else {
        toast({
          title: 'Verification failed',
          description: response.error || 'Invalid or expired verification token',
          variant: 'destructive',
        });
        return { success: false, needsPassword: false };
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error instanceof Error ? error.message : 'An error occurred during verification',
        variant: 'destructive',
      });
      return { success: false, needsPassword: false };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        registerCompany,
        verifyCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

