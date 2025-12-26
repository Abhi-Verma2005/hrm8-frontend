import { Route } from "react-router-dom";
import SalesDashboardPage from "@/pages/sales/SalesDashboardPage";
import SalesTeamPage from "@/pages/sales/SalesTeamPage";
import SalesPipelinePage from "@/pages/sales/SalesPipelinePage";
import OpportunitiesPage from "@/pages/sales/OpportunitiesPage";
import OpportunityDetailPage from "@/pages/sales/OpportunityDetailPage";
import OpportunityCreatePage from "@/pages/sales/OpportunityCreatePage";
import SalesActivitiesPage from "@/pages/sales/SalesActivitiesPage";
import CommissionsPage from "@/pages/sales/CommissionsPage";
import TerritoriesPage from "@/pages/sales/TerritoriesPage";
import SalesForecastPage from "@/pages/sales/SalesForecastPage";

export const salesRoutes = (
  <>
    <Route path="/sales/dashboard" element={<SalesDashboardPage />} />
    <Route path="/sales/team" element={<SalesTeamPage />} />
    <Route path="/sales/pipeline" element={<SalesPipelinePage />} />
    <Route path="/sales/opportunities" element={<OpportunitiesPage />} />
    <Route path="/sales/opportunities/new" element={<OpportunityCreatePage />} />
    <Route path="/sales/opportunities/:id" element={<OpportunityDetailPage />} />
    <Route path="/sales/activities" element={<SalesActivitiesPage />} />
    <Route path="/sales/commissions" element={<CommissionsPage />} />
    <Route path="/sales/territories" element={<TerritoriesPage />} />
    <Route path="/sales/forecast" element={<SalesForecastPage />} />
  </>
);

