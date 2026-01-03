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
import SettlementsPage from "@/pages/hrm8/SettlementsPage";
import Hrm8SettingsPage from "@/pages/hrm8/Hrm8SettingsPage";

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
    <Route path="regions" element={<RegionsPage />} />
    <Route path="licensees" element={<LicenseesPage />} />
    <Route path="staff" element={<StaffPage />} />
    <Route path="jobs" element={<JobAllocationPage />} />
    <Route path="jobs/unassigned" element={<UnassignedJobsPage />} />
    <Route path="commissions" element={<CommissionsPage />} />
    <Route path="settlements" element={<SettlementsPage />} />
    <Route path="revenue" element={<RevenuePage />} />
    <Route path="pricing" element={<PricingPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="settings" element={<Hrm8SettingsPage />} />
  </Route>
);
