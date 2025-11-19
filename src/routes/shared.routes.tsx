import { Route } from "react-router-dom";
import Employers from "@/pages/Employers";
import EmployerDetail from "@/pages/EmployerDetail";
import Consultants from "@/pages/Consultants";
import ConsultantDetail from "@/pages/ConsultantDetail";
import ConsultantWorkloadPage from "@/pages/ConsultantWorkloadPage";
import RecruitmentServices from "@/pages/RecruitmentServices";
import ServiceProjectDetail from "@/pages/ServiceProjectDetail";
import Calendar from "@/pages/Calendar";
import CollaborativeFeedback from "@/pages/CollaborativeFeedback";
import NotificationCenter from "@/pages/NotificationCenter";
import FeedbackTemplates from "@/pages/FeedbackTemplates";
import QuestionnaireTemplates from "@/pages/QuestionnaireTemplates";
import FeedbackDashboard from "@/pages/FeedbackDashboard";
import SkillsManagement from "@/pages/SkillsManagement";
import NotificationsCenter from "@/pages/NotificationsCenter";
import SavedSearches from "@/pages/SavedSearches";
import CompensationManagement from "@/pages/CompensationManagement";
import TrainingDevelopment from "@/pages/TrainingDevelopment";
import OnboardingOffboardingDashboard from "@/pages/OnboardingOffboardingDashboard";
import Analytics from "@/pages/Analytics";
import Inbox from "@/pages/Inbox";
import Users from "@/pages/Users";
import UserProfile from "@/pages/UserProfile";
import RoleManagement from "@/pages/RoleManagement";
import BenefitsAdmin from "@/pages/BenefitsAdmin";
import Finance from "@/pages/Finance";
import Integrations from "@/pages/Integrations";
import AdvancedAnalytics from "@/pages/AdvancedAnalytics";
import RecruitmentIntegration from "@/pages/RecruitmentIntegration";
import EnhancedLearning from "@/pages/EnhancedLearning";
import PivotDemo from "@/pages/PivotDemo";
import Reports from "@/pages/Reports";
import AdminSettings from "@/pages/AdminSettings";
import SupportTickets from "@/pages/SupportTickets";
import SystemMonitoring from "@/pages/SystemMonitoring";
import NotificationPreferences from "@/pages/NotificationPreferences";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import SignupRequests from "@/pages/SignupRequests";
import InviteEmployees from "@/pages/InviteEmployees";
import OnboardingWizard from "@/pages/OnboardingWizard";

export const sharedRoutes = (
  <>
    <Route path="/employers" element={<Employers />} />
    <Route path="/employers/:employerId" element={<EmployerDetail />} />
    <Route path="/consultants" element={<Consultants />} />
    <Route path="/consultants/workload" element={<ConsultantWorkloadPage />} />
    <Route path="/consultants/:id" element={<ConsultantDetail />} />
    <Route path="/recruitment-services" element={<RecruitmentServices />} />
    <Route path="/recruitment-services/:id" element={<ServiceProjectDetail />} />
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
    <Route path="/signup-requests" element={<SignupRequests />} />
    <Route path="/invite-employees" element={<InviteEmployees />} />
    <Route path="/onboarding" element={<OnboardingWizard />} />
  </>
);

