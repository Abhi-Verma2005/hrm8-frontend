import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ScrollToTop } from "./components/ScrollToTop";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobCreate from "./pages/JobCreate";
import JobEdit from "./pages/JobEdit";
import JobTemplates from "./pages/JobTemplates";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Employers from "./pages/Employers";
import EmployerDetail from "./pages/EmployerDetail";
import Consultants from "./pages/Consultants";
import ConsultantDetail from "./pages/ConsultantDetail";
import RecruitmentServices from "./pages/RecruitmentServices";
import HRMS from "./pages/HRMS";
import Inbox from "./pages/Inbox";
import Users from "./pages/Users";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import AdminSettings from "./pages/AdminSettings";
import SupportTickets from "./pages/SupportTickets";

const queryClient = new QueryClient();

function AppContent() {
  const globalShortcuts = useGlobalKeyboardShortcuts();
  useKeyboardShortcuts(globalShortcuts);

  return (
    <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          
          {/* Dashboard routes (with sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="/dashboard/:type" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/new" element={<Candidates />} />
            <Route path="/candidates/:candidateId" element={<Candidates />} />
            <Route path="/candidates/:candidateId/edit" element={<Candidates />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<JobCreate />} />
            <Route path="/jobs/templates" element={<JobTemplates />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/jobs/:jobId/edit" element={<JobEdit />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/employers/:employerId" element={<EmployerDetail />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/consultants/:id" element={<ConsultantDetail />} />
            <Route path="/recruitment-services" element={<RecruitmentServices />} />
            <Route path="/hrms" element={<HRMS />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/users" element={<Users />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
