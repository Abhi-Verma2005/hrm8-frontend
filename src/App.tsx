import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyFormatProvider } from "@/contexts/CurrencyFormatContext";
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ScrollToTop } from "./components/ScrollToTop";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { GlobalSearch } from "./components/common/GlobalSearch";
import Dashboard from "./pages/Dashboard";
import CandidatesDashboard from "./pages/CandidatesDashboard";
import AssessmentsDashboard from "./pages/dashboard/AssessmentsDashboard";
import BackgroundChecksDashboard from "./pages/dashboard/BackgroundChecksDashboard";
import OverviewDashboardPage from "./pages/OverviewDashboardPage";
import FinancialDashboardPage from "./pages/FinancialDashboardPage";
import HRMSDashboardPage from "./pages/HRMSDashboardPage";
import ConsultingDashboardPage from "./pages/ConsultingDashboardPage";
import RecruitmentServicesDashboardPage from "./pages/RecruitmentServicesDashboardPage";
import EmployersDashboardPage from "./pages/EmployersDashboardPage";
import JobsDashboard from "./pages/JobsDashboard";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobCreate from "./pages/JobCreate";
import JobEdit from "./pages/JobEdit";
import JobTemplates from "./pages/JobTemplates";
import JobAutomationSettings from "./pages/JobAutomationSettings";
import JobAnalytics from "./pages/JobAnalytics";
import InterviewScheduling from "./pages/InterviewScheduling";
import OfferManagement from "./pages/OfferManagement";
import PipelineKanban from "./pages/PipelineKanban";
import EmailTemplates from "./pages/EmailTemplates";
import EmailCenter from "./pages/EmailCenter";
import ImportExport from "./pages/ImportExport";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Employers from "./pages/Employers";
import EmployerDetail from "./pages/EmployerDetail";
import Consultants from "./pages/Consultants";
import ConsultantDetail from "./pages/ConsultantDetail";
import ConsultantWorkloadPage from "./pages/ConsultantWorkloadPage";
import RPODashboardPage from "./pages/RPODashboardPage";
import RPOOverviewPage from "./pages/rpo/RPOOverviewPage";
import RPOContractsPage from "./pages/rpo/RPOContractsPage";
import RPOContractDetailPage from "./pages/rpo/RPOContractDetailPage";
import RPOConsultantsPage from "./pages/rpo/RPOConsultantsPage";
import RPOPerformancePage from "./pages/rpo/RPOPerformancePage";
import RPORenewalsPage from "./pages/rpo/RPORenewalsPage";
import RPOTasksPage from "./pages/rpo/RPOTasksPage";
import RPOForecastPage from "./pages/rpo/RPOForecastPage";
import RPOManagementPage from "./pages/rpo/RPOManagementPage";
import RecruitmentServices from "./pages/RecruitmentServices";
import ServiceProjectDetail from "./pages/ServiceProjectDetail";
import HRMS from "./pages/HRMS";
import EmployeeDetail from "./pages/EmployeeDetail";
import HRAnalytics from "./pages/HRAnalytics";
import OrgChart from "./pages/OrgChart";
import LeaveManagement from "./pages/LeaveManagement";
import Performance from "./pages/Performance";
import GoalDetail from "./pages/GoalDetail";
import GoalCreate from "./pages/GoalCreate";
import ReviewDetail from "./pages/ReviewDetail";
import ReviewCreate from "./pages/ReviewCreate";
import FeedbackDetail from "./pages/FeedbackDetail";
import FeedbackRequestCreate from "./pages/FeedbackRequestCreate";
import PublicFeedbackForm from "./pages/PublicFeedbackForm";
import TalentDevelopment from "./pages/TalentDevelopment";
import LearningPathDetail from "./pages/LearningPathDetail";
import CourseDetail from "./pages/CourseDetail";
import HomePage from "./pages/HomePage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import EmployeeCreate from "./pages/EmployeeCreate";
import LeaveRequestCreate from "./pages/LeaveRequestCreate";
import TimeAttendance from "./pages/TimeAttendance";
import Payroll from "./pages/Payroll";
import Benefits from "./pages/Benefits";
import Expenses from "./pages/Expenses";
import Documents from "./pages/Documents";
import Compensation from "./pages/Compensation";
import Offboarding from "./pages/Offboarding";
import OffboardingDetail from "./pages/OffboardingDetail";
import Inbox from "./pages/Inbox";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import EmployeeSelfService from "./pages/EmployeeSelfService";
import Compliance from "./pages/Compliance";
import EmployeeRelations from "./pages/EmployeeRelations";
import RoleManagement from "./pages/RoleManagement";
import AccrualPolicies from "./pages/AccrualPolicies";
import WorkforcePlanning from "./pages/WorkforcePlanning";
import BenefitsAdmin from "./pages/BenefitsAdmin";
import Finance from "./pages/Finance";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";
import AdminSettings from "./pages/AdminSettings";
import SupportTickets from "./pages/SupportTickets";
import SystemMonitoring from "./pages/SystemMonitoring";
import NotificationPreferences from "./pages/NotificationPreferences";
import VerifyCertificate from "./pages/VerifyCertificate";
import ConsentForm from "./pages/ConsentForm";
import ReferenceQuestionnaire from "./pages/ReferenceQuestionnaire";
import AIReferenceSession from "./pages/AIReferenceSession";
import VideoInterviewInterface from "./pages/VideoInterviewInterface";
import PhoneInterviewInterface from "./pages/PhoneInterviewInterface";
import AIInterviewComplete from "./pages/AIInterviewComplete";
import TakeAssessment from "./pages/public/TakeAssessment";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import RecruitmentIntegration from "./pages/RecruitmentIntegration";
import EnhancedLearning from "./pages/EnhancedLearning";
import PivotDemo from "./pages/PivotDemo";
import Requisitions from "./pages/Requisitions";
import RequisitionDetail from "./pages/RequisitionDetail";
import Interviews from "./pages/Interviews";
import Offers from "./pages/Offers";
import Assessments from "./pages/Assessments";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentTemplates from "./pages/AssessmentTemplates";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import AssessmentComparisonPage from "./pages/AssessmentComparisonPage";
import ScheduledAssessments from "./pages/ScheduledAssessments";
import QuestionBank from "./pages/QuestionBank";
import AssessmentPreview from "./pages/AssessmentPreview";
import AssessmentAnalytics from "./pages/AssessmentAnalytics";
import BackgroundChecks from "./pages/BackgroundChecks";
import BackgroundCheckDetail from "./pages/BackgroundCheckDetail";
import DigestSettingsPage from "./pages/DigestSettingsPage";
import InternalJobs from "./pages/InternalJobs";
import Calendar from "./pages/Calendar";
import CollaborativeFeedback from "./pages/CollaborativeFeedback";
import NotificationCenter from "./pages/NotificationCenter";
import FeedbackTemplates from "./pages/FeedbackTemplates";
import QuestionnaireTemplates from "./pages/QuestionnaireTemplates";
import FeedbackDashboard from "./pages/FeedbackDashboard";
import SkillsManagement from "./pages/SkillsManagement";
import NotificationsCenter from "./pages/NotificationsCenter";
import SavedSearches from "./pages/SavedSearches";
import CompensationManagement from "./pages/CompensationManagement";
import TrainingDevelopment from "./pages/TrainingDevelopment";
import OnboardingOffboardingDashboard from "./pages/OnboardingOffboardingDashboard";
import SalesDashboardPage from "./pages/sales/SalesDashboardPage";
import SalesTeamPage from "./pages/sales/SalesTeamPage";
import SalesPipelinePage from "./pages/sales/SalesPipelinePage";
import OpportunitiesPage from "./pages/sales/OpportunitiesPage";
import SalesActivitiesPage from "./pages/sales/SalesActivitiesPage";
import CommissionsPage from "./pages/sales/CommissionsPage";
import TerritoriesPage from "./pages/sales/TerritoriesPage";
import SalesForecastPage from "./pages/sales/SalesForecastPage";
import { initializeMockFeedbackData } from './lib/mockFeedbackData';
import { initializeMockTeamData } from './lib/mockTeamData';
import { initializeMockTemplates } from './lib/mockTemplateData';
import { initializeMockAutomationRules } from './lib/mockAutomationData';
import { initializeMockAlertRules } from './data/mockAlertRules';
import { initializeAISessionTestData } from './lib/backgroundChecks/initializeAISessionData';
import { useEffect } from 'react';
import { ProtectedRoutes } from './components/common/ProtectedRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient();

function AppContent() {
  const globalShortcuts = useGlobalKeyboardShortcuts();
  useKeyboardShortcuts(globalShortcuts);

  useEffect(() => {
    initializeMockFeedbackData();
    initializeMockTeamData();
    initializeMockTemplates();
    initializeMockAutomationRules();
    initializeMockAlertRules();
    initializeAISessionTestData();
  }, []);

  return (
    <>
      <GlobalSearch />
      <Routes>
          {/* Redirect root to home page */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Dashboard routes (with sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
            
            {/* Standalone Dashboard Pages */}
            <Route path="/dashboard/overview" element={<OverviewDashboardPage />} />
            <Route path="/dashboard/financial" element={<FinancialDashboardPage />} />
            <Route path="/dashboard/consulting" element={<ConsultingDashboardPage />} />
            <Route path="/dashboard/recruitment-services" element={<RecruitmentServicesDashboardPage />} />
            <Route path="/dashboard/employers" element={<EmployersDashboardPage />} />
            <Route path="/dashboard/candidates" element={<CandidatesDashboard />} />
            
            {/* HRMS Dashboard - Protected */}
            <Route element={<ProtectedRoutes requiredModule="hrms" moduleName="HRMS Dashboard" />}>
              <Route path="/dashboard/hrms" element={<HRMSDashboardPage />} />
            </Route>
            
            <Route path="/dashboard/jobs" element={<JobsDashboard />} />
            <Route path="/dashboard/performance" element={<PerformanceDashboard />} />
            <Route path="/dashboard/sales" element={<SalesDashboardPage />} />
            <Route path="/dashboard/rpo" element={<RPODashboardPage />} />
            <Route path="/dashboard/assessments" element={<AssessmentsDashboard />} />
            <Route path="/dashboard/background-checks" element={<BackgroundChecksDashboard />} />
            <Route path="/notifications" element={<NotificationCenterPage />} />
            {/* ATS Module Routes */}
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
              <Route path="/background-checks/digest-settings" element={<DigestSettingsPage />} />
              <Route path="/internal-jobs" element={<InternalJobs />} />
            </Route>
            {/* Sales Module Routes */}
            <Route path="/sales/dashboard" element={<SalesDashboardPage />} />
            <Route path="/sales/team" element={<SalesTeamPage />} />
            <Route path="/sales/pipeline" element={<SalesPipelinePage />} />
            <Route path="/sales/opportunities" element={<OpportunitiesPage />} />
            <Route path="/sales/activities" element={<SalesActivitiesPage />} />
            <Route path="/sales/commissions" element={<CommissionsPage />} />
            <Route path="/sales/territories" element={<TerritoriesPage />} />
            <Route path="/sales/forecast" element={<SalesForecastPage />} />
            
            <Route path="/employers" element={<Employers />} />
            <Route path="/employers/:employerId" element={<EmployerDetail />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/consultants/workload" element={<ConsultantWorkloadPage />} />
            <Route path="/consultants/:id" element={<ConsultantDetail />} />
            <Route path="/recruitment-services" element={<RecruitmentServices />} />
            <Route path="/recruitment-services/:id" element={<ServiceProjectDetail />} />
            
            {/* RPO Module Routes */}
            <Route path="/rpo" element={<RPOOverviewPage />} />
            <Route path="/rpo/contracts" element={<RPOContractsPage />} />
            <Route path="/rpo/contracts/:id" element={<RPOContractDetailPage />} />
            <Route path="/rpo/consultants" element={<RPOConsultantsPage />} />
            <Route path="/rpo/performance" element={<RPOPerformancePage />} />
            <Route path="/rpo/renewals" element={<RPORenewalsPage />} />
            <Route path="/rpo/tasks" element={<RPOTasksPage />} />
            <Route path="/rpo/forecast" element={<RPOForecastPage />} />
            <Route path="/rpo/management" element={<RPOManagementPage />} />
            
            {/* HRMS Module Routes */}
            <Route element={<ProtectedRoutes requiredModule="hrms" moduleName="HRMS (Human Resource Management System)" />}>
              <Route path="/hrms" element={<HRMS />} />
              <Route path="/hrms/employees/new" element={<EmployeeCreate />} />
              <Route path="/hrms/employees/:id" element={<EmployeeDetail />} />
              <Route path="/hrms/analytics" element={<HRAnalytics />} />
              <Route path="/hrms/org-chart" element={<OrgChart />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/leave/new" element={<LeaveRequestCreate />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/performance/goals/new" element={<GoalCreate />} />
              <Route path="/performance/goals/:id" element={<GoalDetail />} />
              <Route path="/performance/reviews/new" element={<ReviewCreate />} />
              <Route path="/performance/reviews/:id" element={<ReviewDetail />} />
              <Route path="/performance/feedback/new" element={<FeedbackRequestCreate />} />
              <Route path="/performance/feedback/:id" element={<FeedbackDetail />} />
              <Route path="/talent-development" element={<TalentDevelopment />} />
              <Route path="/talent-development/learning-paths/:id" element={<LearningPathDetail />} />
              <Route path="/talent-development/courses/:id" element={<CourseDetail />} />
              <Route path="/attendance" element={<TimeAttendance />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/compensation" element={<Compensation />} />
              <Route path="/offboarding" element={<Offboarding />} />
              <Route path="/offboarding/:id" element={<OffboardingDetail />} />
              <Route path="/ess" element={<EmployeeSelfService />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/employee-relations" element={<EmployeeRelations />} />
              <Route path="/accrual-policies" element={<AccrualPolicies />} />
              <Route path="/workforce-planning" element={<WorkforcePlanning />} />
            </Route>
            {/* Shared/General Routes */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/collaborative-feedback" element={<CollaborativeFeedback />} />
            <Route path="/feedback-notifications" element={<NotificationCenter />} />
          <Route path="/feedback-templates" element={<FeedbackTemplates />} />
          <Route path="/questionnaire-templates" element={<QuestionnaireTemplates />} />
            <Route path="/feedback-dashboard" element={<FeedbackDashboard />} />
            <Route path="/skills-management" element={<SkillsManagement />} />
            <Route path="/notifications-center" element={<NotificationsCenter />} />
            <Route path="/saved-searches" element={<SavedSearches />} />
            <Route path="/compensation-management" element={<CompensationManagement />} />
            <Route path="/training-development" element={<TrainingDevelopment />} />
            <Route path="/onboarding-offboarding-dashboard" element={<OnboardingOffboardingDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/role-management" element={<RoleManagement />} />
            <Route path="/benefits-admin" element={<BenefitsAdmin />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
            <Route path="/recruitment-integration" element={<RecruitmentIntegration />} />
            <Route path="/enhanced-learning" element={<EnhancedLearning />} />
            <Route path="/pivot-demo" element={<PivotDemo />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
              <Route path="/system-monitoring" element={<SystemMonitoring />} />
              <Route path="/notification-preferences" element={<NotificationPreferences />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
          {/* Public routes (no sidebar) */}
          <Route path="/verify/:code?" element={<VerifyCertificate />} />
          <Route path="/consent/:token" element={<ConsentForm />} />
          <Route path="/reference/:token" element={<ReferenceQuestionnaire />} />
          <Route path="/ai-reference/:token" element={<AIReferenceSession />} />
          <Route path="/ai-reference/:token/video" element={<VideoInterviewInterface />} />
          <Route path="/ai-reference/:token/phone" element={<PhoneInterviewInterface />} />
          <Route path="/ai-reference/:token/complete" element={<AIInterviewComplete />} />
          <Route path="/assessment/:token" element={<TakeAssessment />} />
      
      {/* Public 360 Feedback Form - No authentication required */}
      <Route path="/feedback/:feedbackId/:providerId" element={<PublicFeedbackForm />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyFormatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyFormatProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
