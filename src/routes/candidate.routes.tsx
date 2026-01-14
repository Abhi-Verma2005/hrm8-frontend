/**
 * Candidate Routes
 */

import { Route, Navigate } from "react-router-dom";
import CandidateDashboard from "@/pages/candidate/CandidateDashboard";
import CandidateDashboardHome from "@/pages/candidate/CandidateDashboardHome";
import ProfilePage from "@/pages/candidate/ProfilePage";
import ApplicationsPage from "@/pages/candidate/ApplicationsPage";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import ApplicationConfirmation from "@/pages/candidate/ApplicationConfirmation";
import MessagesPage from "@/pages/candidate/MessagesPage";
import ConversationPage from "@/pages/candidate/ConversationPage";
import WorkHistoryPage from "@/pages/candidate/WorkHistoryPage";
import QualificationsPage from "@/pages/candidate/QualificationsPage";
import NotificationsPage from "@/pages/candidate/NotificationsPage";
import DocumentsPage from "@/pages/candidate/DocumentsPage";
import { SettingsPage } from "@/pages/candidate/SettingsPage";
import AssessmentListPage from "@/pages/candidate/AssessmentListPage";
import AssessmentPage from "@/pages/candidate/AssessmentPage";
import { RoleIsolationGate } from "@/components/common/RoleIsolationGate";
import { useParams } from "react-router-dom";
import CareersPage from "@/pages/candidate/CareersPage";

// Helper components for redirects
const RedirectToJobDetail = () => {
  const { id } = useParams();
  return <Navigate to={`/jobs/${id}`} replace />;
};

const RedirectToJobApply = () => {
  const { id } = useParams();
  return <Navigate to={`/jobs/${id}/apply`} replace />;
};

export const candidateRoutes = (
  <>
    {/* Careers page - shows companies and their job listings */}
    <Route path="/candidate/careers" element={
      <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
        <CareersPage />
      </RoleIsolationGate>
    } />

    {/* Redirect old job routes to new public routes */}
    <Route path="/candidate/jobs" element={<Navigate to="/jobs" replace />} />
    <Route path="/candidate/jobs/:id" element={<RedirectToJobDetail />} />
    <Route path="/candidate/jobs/:id/apply" element={<RedirectToJobApply />} />

    {/* Assessment Routes - Full Screen */}
    <Route path="/candidate/assessments/:id" element={
      <RoleIsolationGate blockRole="recruiter" redirectTo="/home">
        <AssessmentPage />
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
      <Route path="assessments" element={<AssessmentListPage />} />
      <Route path="applications" element={<ApplicationsPage />} />
      <Route path="applications/confirmation" element={<ApplicationConfirmation />} />
      <Route path="applications/:id/confirmation" element={<ApplicationConfirmation />} />
      <Route path="saved-jobs" element={<SavedJobsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="messages/:conversationId" element={<ConversationPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </>
);
