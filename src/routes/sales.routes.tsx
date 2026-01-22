import { Route } from "react-router-dom";
import SalesDashboardPage from "@/pages/sales/SalesDashboardPage";
import SalesTeamPage from "@/pages/sales/SalesTeamPage";
import SalesPipelinePage from "@/pages/sales/SalesPipelinePage";
import OpportunitiesPage from "@/pages/sales/OpportunitiesPage";
import SalesActivitiesPage from "@/pages/sales/SalesActivitiesPage";
import CommissionsPage from "@/pages/sales/CommissionsPage";
import TerritoriesPage from "@/pages/sales/TerritoriesPage";
import SalesForecastPage from "@/pages/sales/SalesForecastPage";
import ClientCompaniesPage from "@/pages/sales/ClientCompaniesPage";
import { SalesLayout } from "@/components/layouts/SalesLayout";
import { ConsultantAuthGuard } from "@/components/auth/ConsultantAuthGuard";
import SettingsPage from "@/pages/shared/SettingsPage";

export const salesRoutes = (
  <Route
    path="/sales-agent"
    element={
      <ConsultantAuthGuard>
        <SalesLayout />
      </ConsultantAuthGuard>
    }
  >
    <Route index element={<SalesDashboardPage />} />
    <Route path="dashboard" element={<SalesDashboardPage />} />
    <Route path="team" element={<SalesTeamPage />} />
    <Route path="pipeline" element={<SalesPipelinePage />} />
    <Route path="leads" element={<OpportunitiesPage />} /> {/* Renaming/Mapping Opportunities to Leads route */}
    <Route path="companies" element={<ClientCompaniesPage />} />
    <Route path="activities" element={<SalesActivitiesPage />} />
    <Route path="commissions" element={<CommissionsPage />} />
    <Route path="territories" element={<TerritoriesPage />} />
    <Route path="forecast" element={<SalesForecastPage />} />
    <Route path="settings" element={<SettingsPage portalType="sales" />} />
  </Route>
);
