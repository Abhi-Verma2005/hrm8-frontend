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
import ConsultantsPage from "@/pages/hrm8/ConsultantsPage";
import JobAllocationPage from "@/pages/hrm8/JobAllocationPage";
import UnassignedJobsPage from "@/pages/hrm8/UnassignedJobsPage";
import CommissionsPage from "@/pages/hrm8/CommissionsPage";
import RevenuePage from "@/pages/hrm8/RevenuePage";
import ReportsPage from "@/pages/hrm8/ReportsPage";
import LeadsPage from "@/pages/hrm8/LeadsPage";
import LeadDetailPage from "@/pages/hrm8/LeadDetailPage";
import LeadCreatePage from "@/pages/hrm8/LeadCreatePage";

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
    <Route path="regions" element={<RegionsPage />} />
    <Route path="licensees" element={<LicenseesPage />} />
    <Route path="consultants" element={<ConsultantsPage />} />
    <Route path="jobs" element={<JobAllocationPage />} />
    <Route path="jobs/unassigned" element={<UnassignedJobsPage />} />
    <Route path="commissions" element={<CommissionsPage />} />
    <Route path="revenue" element={<RevenuePage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="leads" element={<LeadsPage />} />
    <Route path="leads/new" element={<LeadCreatePage />} />
    <Route path="leads/:id" element={<LeadDetailPage />} />
  </Route>
);

