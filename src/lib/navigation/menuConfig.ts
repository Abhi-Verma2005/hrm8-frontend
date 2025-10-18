import { 
  LayoutDashboard, 
  CheckSquare, 
  Mail, 
  Calendar,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Briefcase,
  FileText,
  UserCheck,
  Building,
  Clock,
  DollarSign,
  Target,
  Boxes,
  ClipboardList,
  UserCog,
  TrendingUp,
  PieChart,
  FileBarChart,
  Zap,
  Video,
  Search,
  ClipboardCheck,
  Globe,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Activity,
  Star,
  History,
  type LucideIcon
} from "lucide-react";
import type { UserRole, Permission } from "@/types/roles";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number | string;
  isNew?: boolean;
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
  collapsible: boolean;
  defaultOpen: boolean;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole[];
  isAdminOnly?: boolean;
}

// Dashboard options for dropdown selector
export const DASHBOARD_OPTIONS = [
  { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard, url: '/dashboard/overview' },
  { id: 'financial', label: 'Financial Dashboard', icon: DollarSign, url: '/dashboard/financial', isNew: true },
  { id: 'activity', label: 'Activity Dashboard', icon: Activity, url: '/dashboard/activity', isNew: true },
  { id: 'ats', label: 'ATS Dashboard', icon: Briefcase, url: '/dashboard/ats' },
  { id: 'hrms', label: 'HRMS Dashboard', icon: UserCheck, url: '/dashboard/hrms' },
  { id: 'services', label: 'Services Dashboard', icon: UserCog, url: '/dashboard/services', isNew: true },
];

// Main menu configuration for HRM8 Admin
export const ADMIN_MENU_SECTIONS: MenuSection[] = [
  // WORKSPACE
  {
    id: 'workspace',
    label: 'WORKSPACE',
    collapsible: false,
    defaultOpen: true,
    items: [
      { title: 'Dashboard', url: '/dashboard/overview', icon: LayoutDashboard },
      { title: 'My Tasks', url: '/dashboard/overview', icon: CheckSquare, badge: 0 },
      { title: 'Inbox', url: '/inbox', icon: Mail, badge: 0 },
      { title: 'Calendar', url: '/dashboard/overview', icon: Calendar },
    ],
  },
  
  // PLATFORM MANAGEMENT
  {
    id: 'platform-management',
    label: 'PLATFORM MANAGEMENT',
    collapsible: true,
    defaultOpen: true,
    isAdminOnly: true,
    requiredPermissions: ['platform.view_all_data'],
    items: [
      { title: 'Employers', url: '/employers', icon: Building2 },
      { title: 'Users', url: '/users', icon: Users },
      { title: 'Billing & Revenue', url: '/dashboard/overview', icon: CreditCard, isNew: true },
      { title: 'Platform Analytics', url: '/analytics', icon: BarChart3 },
    ],
  },
  
  // ATS MODULE
  {
    id: 'ats-module',
    label: 'ATS MODULE',
    collapsible: true,
    defaultOpen: true,
    requiredPermissions: ['ats.view_jobs'],
    items: [
      { title: 'Jobs', url: '/jobs', icon: Briefcase },
      { title: 'Applications', url: '/applications', icon: FileText },
      { title: 'Candidates', url: '/candidates', icon: Users },
      { title: 'Clients', url: '/employers', icon: Building },
    ],
  },
  
  // HRMS MODULE
  {
    id: 'hrms-module',
    label: 'HRMS MODULE',
    collapsible: true,
    defaultOpen: false,
    requiredPermissions: ['hrms.view_employees'],
    items: [
      { title: 'Employees', url: '/hrms', icon: UserCheck },
      { title: 'Attendance & Leave', url: '/hrms', icon: Clock },
      { title: 'Payroll & Compensation', url: '/hrms', icon: DollarSign },
      { title: 'Performance Management', url: '/hrms', icon: Target },
      { title: 'Organizational Structure', url: '/hrms', icon: Boxes },
    ],
  },
  
  // RECRUITMENT SERVICES
  {
    id: 'recruitment-services',
    label: 'RECRUITMENT SERVICES',
    collapsible: true,
    defaultOpen: true,
    isAdminOnly: true,
    requiredPermissions: ['services.view_requests'],
    items: [
      { title: 'Service Requests', url: '/dashboard/overview', icon: ClipboardList, isNew: true },
      { title: 'Consultants', url: '/consultants', icon: UserCog },
      { title: 'Service Analytics', url: '/dashboard/overview', icon: TrendingUp, isNew: true },
      { title: 'Active Assignments', url: '/dashboard/overview', icon: Target, isNew: true },
    ],
  },
  
  // PUBLIC FACING
  {
    id: 'public-facing',
    label: 'PUBLIC FACING',
    collapsible: true,
    defaultOpen: false,
    requiredPermissions: ['public.manage_job_board'],
    items: [
      { title: 'HRM8 Job Board', url: '/dashboard/overview', icon: Globe, isNew: true },
      { title: 'Corporate Careers Pages', url: '/dashboard/overview', icon: Building, isNew: true },
      { title: 'Job Seeker Portal', url: '/dashboard/overview', icon: Users, isNew: true },
    ],
  },
  
  // ANALYTICS & REPORTS
  {
    id: 'analytics-reports',
    label: 'ANALYTICS & REPORTS',
    collapsible: true,
    defaultOpen: false,
    items: [
      { title: 'Financial Dashboard', url: '/dashboard/financial', icon: DollarSign, isNew: true },
      { title: 'Activity Dashboard', url: '/dashboard/activity', icon: Activity, isNew: true },
      { title: 'Custom Reports', url: '/reports', icon: FileBarChart },
      { title: 'Forecasting', url: '/dashboard/overview', icon: TrendingUp, isNew: true },
    ],
  },
  
  // ADD-ONS & INTEGRATIONS
  {
    id: 'addons-integrations',
    label: 'ADD-ONS & INTEGRATIONS',
    collapsible: true,
    defaultOpen: false,
    requiredPermissions: ['addons.manage_video_interviews'],
    items: [
      { title: 'Video Interviewing', url: '/dashboard/overview', icon: Video, isNew: true },
      { title: 'Reference Checks', url: '/dashboard/overview', icon: Search, isNew: true },
      { title: 'Assessments', url: '/dashboard/overview', icon: ClipboardCheck, isNew: true },
      { title: 'JobTarget Integration', url: '/dashboard/overview', icon: Zap, isNew: true },
      { title: 'Other Integrations', url: '/dashboard/overview', icon: Globe },
    ],
  },
  
  // ADMINISTRATION
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    collapsible: true,
    defaultOpen: false,
    isAdminOnly: true,
    requiredPermissions: ['platform.manage_settings'],
    items: [
      { title: 'Platform Settings', url: '/admin/settings', icon: Settings },
      { title: 'Security & Compliance', url: '/dashboard/overview', icon: Shield, isNew: true },
      { title: 'Notifications & Alerts', url: '/dashboard/overview', icon: Bell, isNew: true },
      { title: 'Support Tickets', url: '/support-tickets', icon: HelpCircle },
      { title: 'System Health', url: '/dashboard/overview', icon: Activity, isNew: true },
    ],
  },
];

// Quick Access section (always visible at bottom)
export const QUICK_ACCESS_ITEMS = [
  { title: 'Favorites', icon: Star, items: [] as MenuItem[] },
  { title: 'Recent', icon: History, items: [] as MenuItem[] },
];
