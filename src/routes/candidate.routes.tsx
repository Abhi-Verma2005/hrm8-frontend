/**
 * Candidate Routes
 */

import { Route } from "react-router-dom";
import CandidateDashboard from "@/pages/candidate/CandidateDashboard";
import ProfilePage from "@/pages/candidate/ProfilePage";
import ApplicationsPage from "@/pages/candidate/ApplicationsPage";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import ApplicationConfirmation from "@/pages/candidate/ApplicationConfirmation";
import JobSearchPage from "@/pages/candidate/JobSearchPage";
import JobDetailPage from "@/pages/candidate/JobDetailPage";
import ApplyPage from "@/pages/candidate/ApplyPage";

export const candidateRoutes = (
  <>
    <Route path="/candidate" element={<CandidateDashboard />}>
      <Route path="dashboard" element={null} />
      <Route path="jobs" element={<JobSearchPage />} />
      <Route path="jobs/:id" element={<JobDetailPage />} />
      <Route path="jobs/:id/apply" element={<ApplyPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="applications" element={<ApplicationsPage />} />
      <Route path="applications/:id/confirmation" element={<ApplicationConfirmation />} />
      <Route path="saved-jobs" element={<SavedJobsPage />} />
      <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Settings page coming soon</p></div>} />
    </Route>
  </>
);

