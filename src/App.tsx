import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyFormatProvider } from "@/contexts/CurrencyFormatContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CandidateAuthProvider } from "@/contexts/CandidateAuthContext";
import { Hrm8AuthProvider } from "@/contexts/Hrm8AuthContext";
import { ConsultantAuthProvider } from "@/contexts/ConsultantAuthContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { GlobalSearch } from "./components/common/GlobalSearch";
import { AppRoutes } from "./routes";
import { initializeMockFeedbackData } from './lib/mockFeedbackData';
import { initializeMockTeamData } from './lib/mockTeamData';
import { initializeMockTemplates } from './lib/mockTemplateData';
import { initializeMockAutomationRules } from './lib/mockAutomationData';
import { initializeMockAlertRules } from './data/mockAlertRules';
import { initializeAISessionTestData } from './lib/backgroundChecks/initializeAISessionData';
import { useEffect, ReactNode } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";
import { useHrm8Auth } from "@/contexts/Hrm8AuthContext";
import { useConsultantAuth } from "@/contexts/ConsultantAuthContext";
import { ErrorBoundary } from './components/common/ErrorBoundary';
// Development utilities - only loaded in dev mode
import './lib/aiInterview/devUtils';

const queryClient = new QueryClient();

// WebSocket wrapper to aggregate auth state from all auth contexts
function WebSocketWrapper({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const candidateAuth = useCandidateAuth();
  const hrm8Auth = useHrm8Auth();
  const consultantAuth = useConsultantAuth();

  const isAuthenticated =
    auth.isAuthenticated ||
    candidateAuth.isAuthenticated ||
    hrm8Auth.isAuthenticated ||
    consultantAuth.isAuthenticated;

  const userEmail =
    auth.user?.email ||
    candidateAuth.candidate?.email ||
    hrm8Auth.hrm8User?.email ||
    consultantAuth.consultant?.email;

  return (
    <WebSocketProvider isAuthenticated={isAuthenticated} userEmail={userEmail}>
      {children}
    </WebSocketProvider>
  );
}

function AppContent() {
  const globalShortcuts = useGlobalKeyboardShortcuts();
  useKeyboardShortcuts(globalShortcuts);

  useEffect(() => {
    initializeMockFeedbackData();
    initializeMockTeamData();
    initializeMockTemplates();
    initializeMockAutomationRules();
    initializeMockAlertRules();
    initializeAISessionTestData();
  }, []);

  return (
    <>
      <GlobalSearch />
      <AppRoutes />
    </>
  );
}

const App = () => (
  <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyFormatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AuthProvider>
                <CandidateAuthProvider>
                  <Hrm8AuthProvider>
                    <ConsultantAuthProvider>
                      <WebSocketWrapper>
                        <ScrollToTop />
                        <AppContent />
                      </WebSocketWrapper>
                    </ConsultantAuthProvider>
                  </Hrm8AuthProvider>
                </CandidateAuthProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyFormatProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
