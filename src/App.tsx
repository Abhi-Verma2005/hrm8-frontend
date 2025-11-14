import { lazy, Suspense } from 'react';
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
import { PageLoader } from "./components/common/PageLoader";
import { DashboardErrorBoundary } from "./components/common/DashboardErrorBoundary";
import { AIInterviewErrorBoundary } from "./components/common/AIInterviewErrorBoundary";
import { FormsErrorBoundary } from "./components/common/FormsErrorBoundary";

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CandidatesDashboard = lazy(() => import("./pages/CandidatesDashboard"));
const AssessmentsDashboard = lazy(() => import("./pages/dashboard/AssessmentsDashboard"));
const BackgroundChecksDashboard = lazy(() => import("./pages/dashboard/BackgroundChecksDashboard"));
const OverviewDashboardPage = lazy(() => import("./pages/OverviewDashboardPage"));
const FinancialDashboardPage = lazy(() => import("./pages/FinancialDashboardPage"));
const HRMSDashboardPage = lazy(() => import("./pages/HRMSDashboardPage"));
const ConsultingDashboardPage = lazy(() => import("./pages/ConsultingDashboardPage"));
const RecruitmentServicesDashboardPage = lazy(() => import("./pages/RecruitmentServicesDashboardPage"));
const EmployersDashboardPage = lazy(() => import("./pages/EmployersDashboardPage"));
const JobsDashboard = lazy(() => import("./pages/JobsDashboard"));
const PerformanceDashboard = lazy(() => import("./pages/PerformanceDashboard"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const JobCreate = lazy(() => import("./pages/JobCreate"));
const JobEdit = lazy(() => import("./pages/JobEdit"));
const JobTemplates = lazy(() => import("./pages/JobTemplates"));
const JobAutomationSettings = lazy(() => import("./pages/JobAutomationSettings"));
const JobAnalytics = lazy(() => import("./pages/JobAnalytics"));
const InterviewScheduling = lazy(() => import("./pages/InterviewScheduling"));
const OfferManagement = lazy(() => import("./pages/OfferManagement"));
const PipelineKanban = lazy(() => import("./pages/PipelineKanban"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const EmailCenter = lazy(() => import("./pages/EmailCenter"));
const ImportExport = lazy(() => import("./pages/ImportExport"));
const Applications = lazy(() => import("./pages/Applications"));
const ApplicationAnalyticsDashboard = lazy(() => import("./pages/ApplicationAnalyticsDashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Employers = lazy(() => import("./pages/Employers"));
const EmployerDetail = lazy(() => import("./pages/EmployerDetail"));
const Consultants = lazy(() => import("./pages/Consultants"));
const ConsultantDetail = lazy(() => import("./pages/ConsultantDetail"));
const ConsultantWorkloadPage = lazy(() => import("./pages/ConsultantWorkloadPage"));
const RPODashboardPage = lazy(() => import("./pages/RPODashboardPage"));
const RPOOverviewPage = lazy(() => import("./pages/rpo/RPOOverviewPage"));
const RPOContractsPage = lazy(() => import("./pages/rpo/RPOContractsPage"));
const RPOContractDetailPage = lazy(() => import("./pages/rpo/RPOContractDetailPage"));
const RPOConsultantsPage = lazy(() => import("./pages/rpo/RPOConsultantsPage"));
const RPOPerformancePage = lazy(() => import("./pages/rpo/RPOPerformancePage"));
const RPORenewalsPage = lazy(() => import("./pages/rpo/RPORenewalsPage"));
const RPOTasksPage = lazy(() => import("./pages/rpo/RPOTasksPage"));
const RPOForecastPage = lazy(() => import("./pages/rpo/RPOForecastPage"));
const RPOManagementPage = lazy(() => import("./pages/rpo/RPOManagementPage"));
const RecruitmentServices = lazy(() => import("./pages/RecruitmentServices"));
const ServiceProjectDetail = lazy(() => import("./pages/ServiceProjectDetail"));
const HRMS = lazy(() => import("./pages/HRMS"));
const EmployeeDetail = lazy(() => import("./pages/EmployeeDetail"));
const HRAnalytics = lazy(() => import("./pages/HRAnalytics"));
const OrgChart = lazy(() => import("./pages/OrgChart"));
const LeaveManagement = lazy(() => import("./pages/LeaveManagement"));
const Performance = lazy(() => import("./pages/Performance"));
const GoalDetail = lazy(() => import("./pages/GoalDetail"));
const GoalCreate = lazy(() => import("./pages/GoalCreate"));
const ReviewDetail = lazy(() => import("./pages/ReviewDetail"));
const ReviewCreate = lazy(() => import("./pages/ReviewCreate"));
const FeedbackDetail = lazy(() => import("./pages/FeedbackDetail"));
const FeedbackRequestCreate = lazy(() => import("./pages/FeedbackRequestCreate"));
const PublicFeedbackForm = lazy(() => import("./pages/PublicFeedbackForm"));
const TalentDevelopment = lazy(() => import("./pages/TalentDevelopment"));
const LearningPathDetail = lazy(() => import("./pages/LearningPathDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const HomePage = lazy(() => import("./pages/HomePage"));
const NotificationCenterPage = lazy(() => import("./pages/NotificationCenterPage"));
const EmployeeCreate = lazy(() => import("./pages/EmployeeCreate"));
const LeaveRequestCreate = lazy(() => import("./pages/LeaveRequestCreate"));
const TimeAttendance = lazy(() => import("./pages/TimeAttendance"));
const Payroll = lazy(() => import("./pages/Payroll"));
const Benefits = lazy(() => import("./pages/Benefits"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Documents = lazy(() => import("./pages/Documents"));
const Compensation = lazy(() => import("./pages/Compensation"));
const Offboarding = lazy(() => import("./pages/Offboarding"));
const OffboardingDetail = lazy(() => import("./pages/OffboardingDetail"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Users = lazy(() => import("./pages/Users"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EmployeeSelfService = lazy(() => import("./pages/EmployeeSelfService"));
const Compliance = lazy(() => import("./pages/Compliance"));
const EmployeeRelations = lazy(() => import("./pages/EmployeeRelations"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const AccrualPolicies = lazy(() => import("./pages/AccrualPolicies"));
const WorkforcePlanning = lazy(() => import("./pages/WorkforcePlanning"));
const BenefitsAdmin = lazy(() => import("./pages/BenefitsAdmin"));
const Finance = lazy(() => import("./pages/Finance"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Reports = lazy(() => import("./pages/Reports"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const SupportTickets = lazy(() => import("./pages/SupportTickets"));
const SystemMonitoring = lazy(() => import("./pages/SystemMonitoring"));
const NotificationPreferences = lazy(() => import("./pages/NotificationPreferences"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const ConsentForm = lazy(() => import("./pages/ConsentForm"));
const ReferenceQuestionnaire = lazy(() => import("./pages/ReferenceQuestionnaire"));
const AIReferenceSession = lazy(() => import("./pages/AIReferenceSession"));
const AIInterviewComplete = lazy(() => import("./pages/AIInterviewComplete"));
const TakeAssessment = lazy(() => import("./pages/public/TakeAssessment"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const RecruitmentIntegration = lazy(() => import("./pages/RecruitmentIntegration"));
const EnhancedLearning = lazy(() => import("./pages/EnhancedLearning"));
const PivotDemo = lazy(() => import("./pages/PivotDemo"));
const Requisitions = lazy(() => import("./pages/Requisitions"));
const RequisitionDetail = lazy(() => import("./pages/RequisitionDetail"));
const Interviews = lazy(() => import("./pages/Interviews"));
const Offers = lazy(() => import("./pages/Offers"));
const Assessments = lazy(() => import("./pages/Assessments"));
const AssessmentDetail = lazy(() => import("./pages/AssessmentDetail"));
const AssessmentTemplates = lazy(() => import("./pages/AssessmentTemplates"));
const QuestionnaireBuilder = lazy(() => import("./pages/QuestionnaireBuilder"));
const AssessmentComparisonPage = lazy(() => import("./pages/AssessmentComparisonPage"));
const ScheduledAssessments = lazy(() => import("./pages/ScheduledAssessments"));
const QuestionBank = lazy(() => import("./pages/QuestionBank"));
const AssessmentPreview = lazy(() => import("./pages/AssessmentPreview"));
const AssessmentAnalytics = lazy(() => import("./pages/AssessmentAnalytics"));
const BackgroundChecks = lazy(() => import("./pages/BackgroundChecks"));
const BackgroundCheckDetail = lazy(() => import("./pages/BackgroundCheckDetail"));
const DigestSettingsPage = lazy(() => import("./pages/DigestSettingsPage"));
const EscalationRulesPage = lazy(() => import("./pages/EscalationRulesPage"));
const SLASettingsPage = lazy(() => import("./pages/SLASettingsPage"));
const BackgroundChecksAnalytics = lazy(() => import("./pages/BackgroundChecksAnalytics"));
const RecruiterAnalyticsDashboard = lazy(() => import("./pages/RecruiterAnalyticsDashboard"));
const InternalJobs = lazy(() => import("./pages/InternalJobs"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CollaborativeFeedback = lazy(() => import("./pages/CollaborativeFeedback"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter"));
const FeedbackTemplates = lazy(() => import("./pages/FeedbackTemplates"));
const QuestionnaireTemplates = lazy(() => import("./pages/QuestionnaireTemplates"));
const FeedbackDashboard = lazy(() => import("./pages/FeedbackDashboard"));
const SkillsManagement = lazy(() => import("./pages/SkillsManagement"));
const NotificationsCenter = lazy(() => import("./pages/NotificationsCenter"));
const SavedSearches = lazy(() => import("./pages/SavedSearches"));
const CompensationManagement = lazy(() => import("./pages/CompensationManagement"));
const TrainingDevelopment = lazy(() => import("./pages/TrainingDevelopment"));
const OnboardingOffboardingDashboard = lazy(() => import("./pages/OnboardingOffboardingDashboard"));
const SalesDashboardPage = lazy(() => import("./pages/sales/SalesDashboardPage"));
const SalesTeamPage = lazy(() => import("./pages/sales/SalesTeamPage"));
const SalesPipelinePage = lazy(() => import("./pages/sales/SalesPipelinePage"));
const OpportunitiesPage = lazy(() => import("./pages/sales/OpportunitiesPage"));
const SalesActivitiesPage = lazy(() => import("./pages/sales/SalesActivitiesPage"));
const CommissionsPage = lazy(() => import("./pages/sales/CommissionsPage"));
const TerritoriesPage = lazy(() => import("./pages/sales/TerritoriesPage"));
const SalesForecastPage = lazy(() => import("./pages/sales/SalesForecastPage"));
const AIInterviews = lazy(() => import("./pages/AIInterviews"));
const AIInterviewDetail = lazy(() => import("./pages/AIInterviewDetail"));
const AIInterviewSession = lazy(() => import("./pages/AIInterviewSession"));
const AIInterviewReports = lazy(() => import("./pages/AIInterviewReports"));
const AIInterviewReportDetail = lazy(() => import("./pages/AIInterviewReportDetail"));
const AIInterviewAnalytics = lazy(() => import("./pages/AIInterviewAnalytics"));

import { AIInterviewWizard } from "./components/aiInterview/wizard/AIInterviewWizard";
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirect root to home page */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Dashboard routes (with sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
            
            {/* Standalone Dashboard Pages */}
            <Route path="/dashboard/overview" element={<DashboardErrorBoundary><OverviewDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/financial" element={<DashboardErrorBoundary><FinancialDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/consulting" element={<DashboardErrorBoundary><ConsultingDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/recruitment-services" element={<DashboardErrorBoundary><RecruitmentServicesDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/employers" element={<DashboardErrorBoundary><EmployersDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/candidates" element={<DashboardErrorBoundary><CandidatesDashboard /></DashboardErrorBoundary>} />
            
            {/* HRMS Dashboard - Protected */}
            <Route element={<ProtectedRoutes requiredModule="hrms" moduleName="HRMS Dashboard" />}>
              <Route path="/dashboard/hrms" element={<DashboardErrorBoundary><HRMSDashboardPage /></DashboardErrorBoundary>} />
            </Route>
            
            <Route path="/dashboard/jobs" element={<DashboardErrorBoundary><JobsDashboard /></DashboardErrorBoundary>} />
            <Route path="/dashboard/performance" element={<DashboardErrorBoundary><PerformanceDashboard /></DashboardErrorBoundary>} />
            <Route path="/dashboard/sales" element={<DashboardErrorBoundary><SalesDashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/rpo" element={<DashboardErrorBoundary><RPODashboardPage /></DashboardErrorBoundary>} />
            <Route path="/dashboard/assessments" element={<DashboardErrorBoundary><AssessmentsDashboard /></DashboardErrorBoundary>} />
            <Route path="/dashboard/background-checks" element={<DashboardErrorBoundary><BackgroundChecksDashboard /></DashboardErrorBoundary>} />
            <Route path="/dashboard/applications" element={<DashboardErrorBoundary><ApplicationAnalyticsDashboard /></DashboardErrorBoundary>} />
            <Route path="/notifications" element={<NotificationCenterPage />} />
            {/* ATS Module Routes */}
            <Route element={<ProtectedRoutes requiredModule="ats" moduleName="ATS (Applicant Tracking System)" />}>
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:candidateId" element={<Candidates />} />
              <Route path="/candidates/:candidateId/edit" element={<FormsErrorBoundary><Candidates /></FormsErrorBoundary>} />
              <Route path="/candidates/pipeline" element={<PipelineKanban />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/new" element={<FormsErrorBoundary><JobCreate /></FormsErrorBoundary>} />
              <Route path="/jobs/templates" element={<JobTemplates />} />
              <Route path="/jobs/automation" element={<JobAutomationSettings />} />
              <Route path="/jobs/analytics" element={<JobAnalytics />} />
              <Route path="/jobs/:jobId" element={<JobDetail />} />
              <Route path="/jobs/:jobId/edit" element={<FormsErrorBoundary><JobEdit /></FormsErrorBoundary>} />
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
          <Route path="/assessment-templates/builder/:id" element={<FormsErrorBoundary><QuestionnaireBuilder /></FormsErrorBoundary>} />
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
              <Route path="/ai-interviews" element={<AIInterviewErrorBoundary><AIInterviews /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/schedule" element={<AIInterviewErrorBoundary><AIInterviewWizard /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/:id" element={<AIInterviewErrorBoundary><AIInterviewDetail /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/session/:token" element={<AIInterviewErrorBoundary><AIInterviewSession /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/reports" element={<AIInterviewErrorBoundary><AIInterviewReports /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/reports/:id" element={<AIInterviewErrorBoundary><AIInterviewReportDetail /></AIInterviewErrorBoundary>} />
              <Route path="/ai-interviews/analytics" element={<AIInterviewErrorBoundary><AIInterviewAnalytics /></AIInterviewErrorBoundary>} />
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
              <Route path="/hrms/employees/new" element={<FormsErrorBoundary><EmployeeCreate /></FormsErrorBoundary>} />
              <Route path="/hrms/employees/:id" element={<EmployeeDetail />} />
              <Route path="/hrms/analytics" element={<HRAnalytics />} />
              <Route path="/hrms/org-chart" element={<OrgChart />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/leave/new" element={<FormsErrorBoundary><LeaveRequestCreate /></FormsErrorBoundary>} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/performance/goals/new" element={<FormsErrorBoundary><GoalCreate /></FormsErrorBoundary>} />
              <Route path="/performance/goals/:id" element={<GoalDetail />} />
              <Route path="/performance/reviews/new" element={<FormsErrorBoundary><ReviewCreate /></FormsErrorBoundary>} />
              <Route path="/performance/reviews/:id" element={<ReviewDetail />} />
              <Route path="/performance/feedback/new" element={<FormsErrorBoundary><FeedbackRequestCreate /></FormsErrorBoundary>} />
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
          <Route path="/ai-reference/:token/complete" element={<AIInterviewComplete />} />
          <Route path="/assessment/:token" element={<TakeAssessment />} />
      
      {/* Public 360 Feedback Form - No authentication required */}
      <Route path="/feedback/:feedbackId/:providerId" element={<PublicFeedbackForm />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
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
