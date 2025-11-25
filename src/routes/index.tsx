import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthGuard } from "@/components/common/AuthGuard";
import { dashboardRoutes } from "./dashboard.routes";
import { atsRoutes } from "./ats.routes";
import { hrmsRoutes } from "./hrms.routes";
import { salesRoutes } from "./sales.routes";
import { rpoRoutes } from "./rpo.routes";
import { sharedRoutes } from "./shared.routes";
import { publicRoutes } from "./public.routes";
import { candidateRoutes } from "./candidate.routes";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import EmployeeSignup from "@/pages/EmployeeSignup";
import AcceptInvitation from "@/pages/AcceptInvitation";
import NotFound from "@/pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes (public, no sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<EmployeeSignup />} />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      
      {/* Redirect root to home page (protected) */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Protected dashboard routes (with sidebar) */}
      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        {dashboardRoutes}
        
        {/* ATS Module Routes */}
        {atsRoutes}
        
        {/* Sales Module Routes */}
        {salesRoutes}
        
        {/* RPO Module Routes */}
        {rpoRoutes}
        
        {/* HRMS Module Routes */}
        {hrmsRoutes}
        
        {/* Shared/General Routes */}
        {sharedRoutes}
      </Route>
      
      {/* Candidate routes (separate auth, separate layout) */}
      {candidateRoutes}
      
      {/* Public routes (no sidebar, no auth required) */}
      {publicRoutes}
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

