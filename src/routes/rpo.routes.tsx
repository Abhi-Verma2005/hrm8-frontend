import { Route } from "react-router-dom";
import RPOOverviewPage from "@/pages/rpo/RPOOverviewPage";
import RPOContractsPage from "@/pages/rpo/RPOContractsPage";
import RPOContractDetailPage from "@/pages/rpo/RPOContractDetailPage";
import RPOConsultantsPage from "@/pages/rpo/RPOConsultantsPage";
import RPOPerformancePage from "@/pages/rpo/RPOPerformancePage";
import RPORenewalsPage from "@/pages/rpo/RPORenewalsPage";
import RPOTasksPage from "@/pages/rpo/RPOTasksPage";
import RPOForecastPage from "@/pages/rpo/RPOForecastPage";
import RPOManagementPage from "@/pages/rpo/RPOManagementPage";

export const rpoRoutes = (
  <>
    <Route path="/rpo" element={<RPOOverviewPage />} />
    <Route path="/rpo/contracts" element={<RPOContractsPage />} />
    <Route path="/rpo/contracts/:id" element={<RPOContractDetailPage />} />
    <Route path="/rpo/consultants" element={<RPOConsultantsPage />} />
    <Route path="/rpo/performance" element={<RPOPerformancePage />} />
    <Route path="/rpo/renewals" element={<RPORenewalsPage />} />
    <Route path="/rpo/tasks" element={<RPOTasksPage />} />
    <Route path="/rpo/forecast" element={<RPOForecastPage />} />
    <Route path="/rpo/management" element={<RPOManagementPage />} />
  </>
);

