import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ScrollToTop } from "./components/ScrollToTop";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { GlobalSearch } from "./components/common/GlobalSearch";
import Dashboard from "./pages/Dashboard";
import CandidatesDashboard from "./pages/CandidatesDashboard";
import HRMSDashboard from "./pages/HRMSDashboard";
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
import TalentDevelopment from "./pages/TalentDevelopment";
import LearningPathDetail from "./pages/LearningPathDetail";
import CourseDetail from "./pages/CourseDetail";
import HomePage from "./pages/HomePage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import EmployeeCreate from "./pages/EmployeeCreate";
import LeaveRequestCreate from "./pages/LeaveRequestCreate";
import Onboarding from "./pages/Onboarding";
import OnboardingWorkflowDetail from "./pages/OnboardingWorkflowDetail";
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
import VerifyCertificate from "./pages/VerifyCertificate";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import RecruitmentIntegration from "./pages/RecruitmentIntegration";
import EnhancedLearning from "./pages/EnhancedLearning";
import PivotDemo from "./pages/PivotDemo";
import Requisitions from "./pages/Requisitions";
import RequisitionDetail from "./pages/RequisitionDetail";
import Interviews from "./pages/Interviews";
import Offers from "./pages/Offers";
import BackgroundChecks from "./pages/BackgroundChecks";
import InternalJobs from "./pages/InternalJobs";
import Calendar from "./pages/Calendar";
import CollaborativeFeedback from "./pages/CollaborativeFeedback";
import NotificationCenter from "./pages/NotificationCenter";
import FeedbackTemplates from "./pages/FeedbackTemplates";
import FeedbackDashboard from "./pages/FeedbackDashboard";
import SkillsManagement from "./pages/SkillsManagement";
import NotificationsCenter from "./pages/NotificationsCenter";
import SavedSearches from "./pages/SavedSearches";
import CompensationManagement from "./pages/CompensationManagement";
import TrainingDevelopment from "./pages/TrainingDevelopment";
import OnboardingOffboardingDashboard from "./pages/OnboardingOffboardingDashboard";
import { initializeMockFeedbackData } from './lib/mockFeedbackData';
import { initializeMockTeamData } from './lib/mockTeamData';
import { initializeMockTemplates } from './lib/mockTemplateData';
import { initializeMockAutomationRules } from './lib/mockAutomationData';
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
            <Route path="/dashboard/:type" element={<Dashboard />} />
            <Route path="/dashboard/candidates" element={<CandidatesDashboard />} />
            
            {/* HRMS Dashboard - Protected */}
            <Route element={<ProtectedRoutes requiredModule="hrms" moduleName="HRMS Dashboard" />}>
              <Route path="/dashboard/hrms" element={<HRMSDashboard />} />
            </Route>
            
            <Route path="/dashboard/jobs" element={<JobsDashboard />} />
            <Route path="/dashboard/performance" element={<PerformanceDashboard />} />
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
              <Route path="/background-checks" element={<BackgroundChecks />} />
              <Route path="/internal-jobs" element={<InternalJobs />} />
            </Route>
            <Route path="/employers" element={<Employers />} />
            <Route path="/employers/:employerId" element={<EmployerDetail />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/consultants/:id" element={<ConsultantDetail />} />
            <Route path="/recruitment-services" element={<RecruitmentServices />} />
            <Route path="/recruitment-services/:id" element={<ServiceProjectDetail />} />
            
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
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/:id" element={<OnboardingWorkflowDetail />} />
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
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/feedback-templates" element={<FeedbackTemplates />} />
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
          {/* Public routes (no sidebar) */}
          <Route path="/verify/:code?" element={<VerifyCertificate />} />
          
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
