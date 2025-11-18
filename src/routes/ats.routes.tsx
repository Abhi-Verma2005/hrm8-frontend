import { Route } from "react-router-dom";
import { ProtectedRoutes } from "@/components/common/ProtectedRoutes";
import { AIInterviewWizard } from "@/components/aiInterview/wizard/AIInterviewWizard";
import Candidates from "@/pages/ats/Candidates";
import PipelineKanban from "@/pages/ats/PipelineKanban";
import Jobs from "@/pages/ats/Jobs";
import JobCreate from "@/pages/ats/JobCreate";
import JobEdit from "@/pages/ats/JobEdit";
import JobDetail from "@/pages/ats/JobDetail";
import JobTemplates from "@/pages/ats/JobTemplates";
import JobAutomationSettings from "@/pages/ats/JobAutomationSettings";
import JobAnalytics from "@/pages/ats/JobAnalytics";
import InterviewScheduling from "@/pages/ats/InterviewScheduling";
import OfferManagement from "@/pages/ats/OfferManagement";
import EmailTemplates from "@/pages/ats/EmailTemplates";
import EmailCenter from "@/pages/ats/EmailCenter";
import ImportExport from "@/pages/ats/ImportExport";
import Applications from "@/pages/ats/Applications";
import Requisitions from "@/pages/ats/Requisitions";
import RequisitionDetail from "@/pages/ats/RequisitionDetail";
import Interviews from "@/pages/ats/Interviews";
import Offers from "@/pages/ats/Offers";
import Assessments from "@/pages/ats/Assessments";
import AssessmentDetail from "@/pages/ats/AssessmentDetail";
import AssessmentComparisonPage from "@/pages/ats/AssessmentComparisonPage";
import AssessmentTemplates from "@/pages/ats/AssessmentTemplates";
import QuestionnaireBuilder from "@/pages/ats/QuestionnaireBuilder";
import QuestionBank from "@/pages/ats/QuestionBank";
import AssessmentPreview from "@/pages/ats/AssessmentPreview";
import AssessmentAnalytics from "@/pages/ats/AssessmentAnalytics";
import ScheduledAssessments from "@/pages/ats/ScheduledAssessments";
import BackgroundChecks from "@/pages/ats/BackgroundChecks";
import BackgroundCheckDetail from "@/pages/ats/BackgroundCheckDetail";
import RecruiterAnalyticsDashboard from "@/pages/ats/RecruiterAnalyticsDashboard";
import DigestSettingsPage from "@/pages/ats/DigestSettingsPage";
import EscalationRulesPage from "@/pages/ats/EscalationRulesPage";
import SLASettingsPage from "@/pages/ats/SLASettingsPage";
import BackgroundChecksAnalytics from "@/pages/ats/BackgroundChecksAnalytics";
import InternalJobs from "@/pages/ats/InternalJobs";
import AIInterviews from "@/pages/ats/AIInterviews";
import AIInterviewDetail from "@/pages/ats/AIInterviewDetail";
import AIInterviewSession from "@/pages/ats/AIInterviewSession";
import AIInterviewReports from "@/pages/ats/AIInterviewReports";
import AIInterviewReportDetail from "@/pages/ats/AIInterviewReportDetail";
import AIInterviewAnalytics from "@/pages/ats/AIInterviewAnalytics";

export const atsRoutes = (
  <Route element={<ProtectedRoutes requiredModule="ats" moduleName="ATS (Applicant Tracking System)" />}>
    <Route path="/candidates" element={<Candidates />} />
    <Route path="/candidates/:candidateId" element={<Candidates />} />
    <Route path="/candidates/:candidateId/edit" element={<Candidates />} />
    <Route path="/candidates/pipeline" element={<PipelineKanban />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/jobs/new" element={<JobCreate />} />
    <Route path="/jobs/templates" element={<JobTemplates />} />
    <Route path="/jobs/automation" element={<JobAutomationSettings />} />
    <Route path="/jobs/analytics" element={<JobAnalytics />} />
    <Route path="/jobs/:jobId" element={<JobDetail />} />
    <Route path="/jobs/:jobId/edit" element={<JobEdit />} />
    <Route path="/email-templates" element={<EmailTemplates />} />
    <Route path="/email-center" element={<EmailCenter />} />
    <Route path="/import-export" element={<ImportExport />} />
    <Route path="/interviews/schedule" element={<InterviewScheduling />} />
    <Route path="/offers/manage" element={<OfferManagement />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/requisitions" element={<Requisitions />} />
    <Route path="/requisitions/:id" element={<RequisitionDetail />} />
    <Route path="/interviews" element={<Interviews />} />
    <Route path="/offers" element={<Offers />} />
    <Route path="/assessments" element={<Assessments />} />
    <Route path="/assessments/:id" element={<AssessmentDetail />} />
    <Route path="/assessments/compare" element={<AssessmentComparisonPage />} />
    <Route path="/assessment-templates" element={<AssessmentTemplates />} />
    <Route path="/assessment-templates/builder/:id" element={<QuestionnaireBuilder />} />
    <Route path="/question-bank" element={<QuestionBank />} />
    <Route path="/assessment-preview" element={<AssessmentPreview />} />
    <Route path="/assessment-analytics" element={<AssessmentAnalytics />} />
    <Route path="/scheduled-assessments" element={<ScheduledAssessments />} />
    <Route path="/background-checks" element={<BackgroundChecks />} />
    <Route path="/background-checks/:id" element={<BackgroundCheckDetail />} />
    <Route path="/background-checks/recruiter/:recruiterId" element={<RecruiterAnalyticsDashboard />} />
    <Route path="/background-checks/digest-settings" element={<DigestSettingsPage />} />
    <Route path="/background-checks/escalation-rules" element={<EscalationRulesPage />} />
    <Route path="/background-checks/sla-settings" element={<SLASettingsPage />} />
    <Route path="/background-checks/analytics" element={<BackgroundChecksAnalytics />} />
    <Route path="/internal-jobs" element={<InternalJobs />} />
    
    {/* AI Interview Routes */}
    <Route path="/ai-interviews" element={<AIInterviews />} />
    <Route path="/ai-interviews/schedule" element={<AIInterviewWizard />} />
    <Route path="/ai-interviews/:id" element={<AIInterviewDetail />} />
    <Route path="/ai-interviews/session/:token" element={<AIInterviewSession />} />
    <Route path="/ai-interviews/reports" element={<AIInterviewReports />} />
    <Route path="/ai-interviews/reports/:id" element={<AIInterviewReportDetail />} />
    <Route path="/ai-interviews/analytics" element={<AIInterviewAnalytics />} />
  </Route>
);

