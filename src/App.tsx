import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import Index from "./pages/Index";
import Components from "./pages/Components";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Consultants from "./pages/Consultants";
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
          {/* Public routes (no sidebar) */}
          <Route path="/" element={<Index />} />
          <Route path="/components" element={<Components />} />
          
          {/* Dashboard routes (with sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/jobs" replace />} />
            <Route path="/dashboard/:type" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/consultants" element={<Consultants />} />
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
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
