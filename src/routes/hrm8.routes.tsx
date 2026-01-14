/**
 * HRM8 Global Admin Routes
 * Routes for HRM8 Global Admin and Regional Licensees
 */

import { Route } from "react-router-dom";
import { Hrm8AuthGuard } from "@/components/auth/Hrm8AuthGuard";
import Hrm8Dashboard from "@/pages/hrm8/Hrm8Dashboard";
import Hrm8Overview from "@/pages/hrm8/Hrm8Overview";
import RegionsPage from "@/pages/hrm8/RegionsPage";
import LicenseesPage from "@/pages/hrm8/LicenseesPage";
import StaffPage from "@/pages/hrm8/StaffPage";
import JobAllocationPage from "@/pages/hrm8/JobAllocationPage";
import UnassignedJobsPage from "@/pages/hrm8/UnassignedJobsPage";
import CommissionsPage from "@/pages/hrm8/CommissionsPage";
import RevenuePage from "@/pages/hrm8/RevenuePage";
import ReportsPage from "@/pages/hrm8/ReportsPage";
import PricingPage from "@/pages/hrm8/PricingPage";
import RegionalSalesDashboard from "@/pages/hrm8/RegionalSalesDashboard";
import RegionalLeadsPage from "@/pages/hrm8/RegionalLeadsPage";
import SettlementsPage from "@/pages/hrm8/SettlementsPage";
import SettingsPage from "@/pages/hrm8/SettingsPage";
import AttributionPage from "@/pages/hrm8/AttributionPage";
import Hrm8SettingsPage from "@/pages/hrm8/Hrm8SettingsPage";
import Hrm8JobBoardPage from "@/pages/hrm8/Hrm8JobBoardPage";
import Hrm8CompanyJobsPage from "@/pages/hrm8/Hrm8CompanyJobsPage";
import Hrm8JobDetailPage from "@/pages/hrm8/Hrm8JobDetailPage";
import WithdrawalsPage from "@/pages/admin/WithdrawalsPage";
import { RefundRequestsPage } from "@/pages/hrm8/RefundRequestsPage";
import { ConversionRequestsPage } from "@/pages/hrm8/ConversionRequestsPage";
import { RevenueDashboardPage } from "@/pages/hrm8/RevenueDashboardPage";
import CareersRequestsPage from "@/pages/hrm8/CareersRequestsPage";
import Hrm8WalletPage from "@/pages/hrm8/Hrm8WalletPage";

export const hrm8Routes = (
  <Route
    path="/hrm8"
    element={
      <Hrm8AuthGuard>
        <Hrm8Dashboard />
      </Hrm8AuthGuard>
    }
  >
    <Route index element={<Hrm8Overview />} />
    <Route path="dashboard" element={<Hrm8Overview />} />
    <Route path="sales-pipeline" element={<RegionalSalesDashboard />} />
    <Route path="leads" element={<RegionalLeadsPage />} />
    <Route path="regions" element={<RegionsPage />} />
    <Route path="licensees" element={<LicenseesPage />} />
    <Route path="staff" element={<StaffPage />} />
    <Route path="jobs" element={<JobAllocationPage />} />
    <Route path="jobs/unassigned" element={<UnassignedJobsPage />} />
    <Route path="job-board" element={<Hrm8JobBoardPage />} />
    <Route path="job-board/:companyId" element={<Hrm8CompanyJobsPage />} />
    <Route path="job-board/job/:jobId" element={<Hrm8JobDetailPage />} />
    <Route path="commissions" element={<CommissionsPage />} />
    <Route path="billing/withdrawals" element={<WithdrawalsPage />} />
    <Route path="billing/refund-requests" element={<RefundRequestsPage />} />
    <Route path="billing/conversion-requests" element={<ConversionRequestsPage />} />
    <Route path="settlements" element={<SettlementsPage />} />
    <Route path="revenue" element={<RevenuePage />} />
    <Route path="attribution" element={<AttributionPage />} />
    <Route path="pricing" element={<PricingPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="careers-requests" element={<CareersRequestsPage />} />
    <Route path="conversion-requests" element={<ConversionRequestsPage />} />
    <Route path="revenue-analytics" element={<RevenueDashboardPage />} />
    <Route path="system-settings" element={<Hrm8SettingsPage />} />
  </Route>
);
