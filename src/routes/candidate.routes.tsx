/**
 * Candidate Routes
 */

import { Route } from "react-router-dom";
import CandidateDashboard from "@/pages/candidate/CandidateDashboard";
import CandidateDashboardHome from "@/pages/candidate/CandidateDashboardHome";
import ProfilePage from "@/pages/candidate/ProfilePage";
import ApplicationsPage from "@/pages/candidate/ApplicationsPage";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import ApplicationConfirmation from "@/pages/candidate/ApplicationConfirmation";
import JobSearchPage from "@/pages/candidate/JobSearchPage";
import JobDetailPage from "@/pages/candidate/JobDetailPage";
import ApplyPage from "@/pages/candidate/ApplyPage";
import MessagesPage from "@/pages/candidate/MessagesPage";
import ConversationPage from "@/pages/candidate/ConversationPage";
import WorkHistoryPage from "@/pages/candidate/WorkHistoryPage";
import QualificationsPage from "@/pages/candidate/QualificationsPage";
import NotificationsPage from "@/pages/candidate/NotificationsPage";
import DocumentsPage from "@/pages/candidate/DocumentsPage";
import { RoleIsolationGate } from "@/components/common/RoleIsolationGate";

export const candidateRoutes = (
  <>
    {/* Public job browsing routes (no authentication required) */}
    <Route path="/candidate/jobs" element={
      <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
        <JobSearchPage />
      </RoleIsolationGate>
    } />
    <Route path="/candidate/jobs/:id" element={
      <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
        <JobDetailPage />
      </RoleIsolationGate>
    } />
    <Route path="/candidate/jobs/:id/apply" element={
      <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
        <ApplyPage />
      </RoleIsolationGate>
    } />

    {/* Protected candidate routes (authentication required) */}
    <Route
      path="/candidate"
      element={
        <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
          <CandidateDashboard />
        </RoleIsolationGate>
      }
    >
      <Route index element={<CandidateDashboardHome />} />
      <Route path="dashboard" element={<CandidateDashboardHome />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="work-history" element={<WorkHistoryPage />} />
      <Route path="qualifications" element={<QualificationsPage />} />
      <Route path="documents" element={<DocumentsPage />} />
      <Route path="applications" element={<ApplicationsPage />} />
      <Route path="applications/confirmation" element={<ApplicationConfirmation />} />
      <Route path="applications/:id/confirmation" element={<ApplicationConfirmation />} />
      <Route path="saved-jobs" element={<SavedJobsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="messages/:conversationId" element={<ConversationPage />} />
      <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Settings page coming soon</p></div>} />
    </Route>
  </>
);

