/**
 * Consultant 360 Routes
 * Unified routes for Consultant 360 users with access to both
 * recruiter and sales agent functionality
 */

import { Route } from "react-router-dom";
import { ConsultantAuthGuard } from "@/components/auth/ConsultantAuthGuard";
import { Consultant360Layout } from "@/components/layouts/Consultant360Layout";

// Pages
import Consultant360Dashboard from "@/pages/consultant360/Consultant360Dashboard";
import Consultant360EarningsPage from "@/pages/consultant360/Consultant360EarningsPage";

// Reuse existing pages for jobs, leads, messages, etc.
import ConsultantJobsPage from "@/pages/consultant/ConsultantJobsPage";
import ConsultantJobDetailPage from "@/pages/consultant/ConsultantJobDetailPage";
import ConsultantProfilePage from "@/pages/consultant/ConsultantProfilePage";
import ConsultantMessagesPage from "@/pages/consultant/ConsultantMessagesPage";

// Sales pages - reuse for leads and pipeline
import OpportunitiesPage from "@/pages/sales/OpportunitiesPage";
import SalesPipelinePage from "@/pages/sales/SalesPipelinePage";

export const consultant360Routes = (
    <Route
        path="/consultant360"
        element={
            <ConsultantAuthGuard>
                <Consultant360Layout />
            </ConsultantAuthGuard>
        }
    >
        {/* Dashboard */}
        <Route index element={<Consultant360Dashboard />} />
        <Route path="dashboard" element={<Consultant360Dashboard />} />

        {/* Unified Earnings */}
        <Route path="earnings" element={<Consultant360EarningsPage />} />

        {/* Recruitment Features */}
        <Route path="jobs" element={<ConsultantJobsPage />} />
        <Route path="jobs/:id" element={<ConsultantJobDetailPage />} />

        {/* Sales Features */}
        <Route path="leads" element={<OpportunitiesPage />} />
        <Route path="pipeline" element={<SalesPipelinePage />} />

        {/* Shared Features */}
        <Route path="messages" element={<ConsultantMessagesPage />} />
        <Route path="messages/:conversationId" element={<ConsultantMessagesPage />} />
        <Route path="profile" element={<ConsultantProfilePage />} />
    </Route>
);
