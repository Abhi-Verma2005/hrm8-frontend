/**
 * Consultant Routes
 * Routes for consultants
 */

import { Route } from "react-router-dom";
import { ConsultantAuthGuard } from "@/components/auth/ConsultantAuthGuard";
import ConsultantDashboard from "@/pages/consultant/ConsultantDashboard";
import ConsultantOverview from "@/pages/consultant/ConsultantOverview";
import ConsultantJobsPage from "@/pages/consultant/ConsultantJobsPage";
import ConsultantCommissionsPage from "@/pages/consultant/ConsultantCommissionsPage";
import ConsultantProfilePage from "@/pages/consultant/ConsultantProfilePage";
import ConsultantWalletPage from "@/pages/consultant/ConsultantWalletPage";
import ConsultantJobDetailPage from "@/pages/consultant/ConsultantJobDetailPage";
import ConsultantMessagesPage from "@/pages/consultant/ConsultantMessagesPage";
import SettingsPage from "@/pages/shared/SettingsPage";

export const consultantRoutes = (
  <Route
    path="/consultant"
    element={
      <ConsultantAuthGuard>
        <ConsultantDashboard />
      </ConsultantAuthGuard>
    }
  >
    <Route index element={<ConsultantOverview />} />
    <Route path="dashboard" element={<ConsultantOverview />} />
    <Route path="jobs" element={<ConsultantJobsPage />} />
    <Route path="jobs/:id" element={<ConsultantJobDetailPage />} />
    <Route path="messages" element={<ConsultantMessagesPage />} />
    <Route path="messages/:conversationId" element={<ConsultantMessagesPage />} />
    <Route path="commissions" element={<ConsultantCommissionsPage />} />
    <Route path="wallet" element={<ConsultantWalletPage />} />
    <Route path="profile" element={<ConsultantProfilePage />} />
    <Route path="settings" element={<SettingsPage portalType="consultant" />} />
  </Route>
);
