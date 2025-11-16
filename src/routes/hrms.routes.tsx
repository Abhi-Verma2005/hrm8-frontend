import { Route } from "react-router-dom";
import { ProtectedRoutes } from "@/components/common/ProtectedRoutes";
import HRMS from "@/pages/HRMS";
import EmployeeCreate from "@/pages/EmployeeCreate";
import EmployeeDetail from "@/pages/EmployeeDetail";
import HRAnalytics from "@/pages/HRAnalytics";
import OrgChart from "@/pages/OrgChart";
import LeaveManagement from "@/pages/LeaveManagement";
import LeaveRequestCreate from "@/pages/LeaveRequestCreate";
import Performance from "@/pages/Performance";
import GoalCreate from "@/pages/GoalCreate";
import GoalDetail from "@/pages/GoalDetail";
import ReviewCreate from "@/pages/ReviewCreate";
import ReviewDetail from "@/pages/ReviewDetail";
import FeedbackRequestCreate from "@/pages/FeedbackRequestCreate";
import FeedbackDetail from "@/pages/FeedbackDetail";
import TalentDevelopment from "@/pages/TalentDevelopment";
import LearningPathDetail from "@/pages/LearningPathDetail";
import CourseDetail from "@/pages/CourseDetail";
import TimeAttendance from "@/pages/TimeAttendance";
import Payroll from "@/pages/Payroll";
import Benefits from "@/pages/Benefits";
import Expenses from "@/pages/Expenses";
import Documents from "@/pages/Documents";
import Compensation from "@/pages/Compensation";
import Offboarding from "@/pages/Offboarding";
import OffboardingDetail from "@/pages/OffboardingDetail";
import EmployeeSelfService from "@/pages/EmployeeSelfService";
import Compliance from "@/pages/Compliance";
import EmployeeRelations from "@/pages/EmployeeRelations";
import AccrualPolicies from "@/pages/AccrualPolicies";
import WorkforcePlanning from "@/pages/WorkforcePlanning";

export const hrmsRoutes = (
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
);

