import { Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "@/components/common/ProtectedRoutes";
import HomePage from "@/pages/HomePage";
import OverviewDashboardPage from "@/pages/OverviewDashboardPage";
import FinancialDashboardPage from "@/pages/FinancialDashboardPage";
import HRMSDashboardPage from "@/pages/HRMSDashboardPage";
import ConsultingDashboardPage from "@/pages/ConsultingDashboardPage";
import RecruitmentServicesDashboardPage from "@/pages/RecruitmentServicesDashboardPage";
import EmployersDashboardPage from "@/pages/EmployersDashboardPage";
import CandidatesDashboard from "@/pages/ats/CandidatesDashboard";
import JobsDashboard from "@/pages/ats/JobsDashboard";
import PerformanceDashboard from "@/pages/PerformanceDashboard";
import SalesDashboardPage from "@/pages/sales/SalesDashboardPage";
import RPODashboardPage from "@/pages/RPODashboardPage";
import AddonsDashboard from "@/pages/dashboard/AddonsDashboard";
import ApplicationAnalyticsDashboard from "@/pages/ats/ApplicationAnalyticsDashboard";
import NotificationsPage from "@/pages/NotificationsPage";

export const dashboardRoutes = (
  <>
    <Route path="/home" element={<HomePage />} />
    <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />

    {/* Standalone Dashboard Pages */}
    <Route path="/dashboard/overview" element={<OverviewDashboardPage />} />
    <Route path="/dashboard/financial" element={<FinancialDashboardPage />} />
    <Route path="/dashboard/consulting" element={<ConsultingDashboardPage />} />
    <Route path="/dashboard/recruitment-services" element={<RecruitmentServicesDashboardPage />} />
    <Route path="/dashboard/employers" element={<EmployersDashboardPage />} />
    <Route path="/dashboard/candidates" element={<CandidatesDashboard />} />

    {/* HRMS Dashboard - Protected */}
    <Route element={<ProtectedRoutes requiredModule="hrms" moduleName="HRMS Dashboard" />}>
      <Route path="/dashboard/hrms" element={<HRMSDashboardPage />} />
    </Route>

    <Route path="/dashboard/jobs" element={<JobsDashboard />} />
    <Route path="/dashboard/performance" element={<PerformanceDashboard />} />
    <Route path="/dashboard/sales" element={<SalesDashboardPage />} />
    <Route path="/dashboard/rpo" element={<RPODashboardPage />} />
    <Route path="/dashboard/addons" element={<AddonsDashboard />} />
    <Route path="/dashboard/applications" element={<ApplicationAnalyticsDashboard />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </>
);

