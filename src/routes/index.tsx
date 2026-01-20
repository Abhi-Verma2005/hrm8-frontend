import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AnyAuthRedirectGate } from "@/components/common/AnyAuthRedirectGate";
import { dashboardRoutes } from "./dashboard.routes";
import { atsRoutes } from "./ats.routes";
import { hrmsRoutes } from "./hrms.routes";
import { salesRoutes } from "./sales.routes";
import { rpoRoutes } from "./rpo.routes";
import { sharedRoutes } from "./shared.routes";
import { publicRoutes } from "./public.routes";
import { candidateRoutes } from "./candidate.routes";
import { hrm8Routes } from "./hrm8.routes";
import { employerRoutes } from "./employer.routes";
import { consultantRoutes } from "./consultant.routes";
import { consultant360Routes } from "./consultant360.routes";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import EmployeeSignup from "@/pages/EmployeeSignup";
import AcceptInvitation from "@/pages/AcceptInvitation";
import Hrm8Login from "@/pages/Hrm8Login";
import ConsultantLogin from "@/pages/ConsultantLogin";
import SalesLogin from "@/pages/sales/SalesLogin";
import NotFound from "@/pages/NotFound";
import StripeMockOnboarding from "@/pages/dev/StripeMockOnboarding";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes (public, no sidebar) */}
      <Route
        path="/login"
        element={
          <AnyAuthRedirectGate>
            <Login />
          </AnyAuthRedirectGate>
        }
      />
      <Route
        path="/register"
        element={
          <AnyAuthRedirectGate>
            <Register />
          </AnyAuthRedirectGate>
        }
      />
      <Route
        path="/signup"
        element={
          <AnyAuthRedirectGate>
            <EmployeeSignup />
          </AnyAuthRedirectGate>
        }
      />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route
        path="/consultant/login"
        element={
          <AnyAuthRedirectGate>
            <ConsultantLogin />
          </AnyAuthRedirectGate>
        }
      />
      <Route
        path="/hrm8/login"
        element={
          <AnyAuthRedirectGate>
            <Hrm8Login />
          </AnyAuthRedirectGate>
        }
      />
      <Route
        path="/sales-agent/login"
        element={
          <AnyAuthRedirectGate>
            <SalesLogin />
          </AnyAuthRedirectGate>
        }
      />

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

        {/* RPO Module Routes */}
        {rpoRoutes}

        {/* HRMS Module Routes */}
        {hrmsRoutes}

        {/* Employer/Company Routes */}
        {employerRoutes}

        {/* Shared/General Routes */}
        {sharedRoutes}
      </Route>

      {/* Candidate routes (separate auth, separate layout) */}
      {candidateRoutes}

      {/* HRM8 routes (separate auth, separate layout) */}
      {hrm8Routes}

      {/* Consultant routes (separate auth, separate layout) */}
      {consultantRoutes}

      {/* Consultant 360 routes (unified dashboard with both recruiter and sales) */}
      {consultant360Routes}

      {/* Sales Agent routes (separate auth, separate layout) */}
      {salesRoutes}

      {/* Public routes (no sidebar, no auth required) */}
      {publicRoutes}

      {/* Dev routes (development mode only) */}
      <Route path="/dev/stripe-mock-onboarding" element={<StripeMockOnboarding />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

