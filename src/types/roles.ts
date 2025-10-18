export type UserRole = 
  | 'hrm8_admin'           // Full platform access - HRM8 administrators
  | 'hrm8_finance'         // Financial reporting & billing access
  | 'hrm8_support'         // Support team with limited access
  | 'employer_admin'       // Single employer, full module access
  | 'employer_recruiter'   // Single employer, ATS only
  | 'employer_hr_manager'  // Single employer, HRMS only
  | 'employer_viewer'      // Single employer, read-only access
  | 'consultant';          // HRM8 consultant with limited task access

export type Permission = 
  // Platform Management (HRM8 Admin only)
  | 'platform.manage_employers'
  | 'platform.manage_users'
  | 'platform.view_all_data'
  | 'platform.manage_billing'
  | 'platform.view_analytics'
  | 'platform.manage_settings'
  | 'platform.manage_integrations'
  
  // Financial (HRM8 Admin & Finance)
  | 'finance.view_revenue'
  | 'finance.manage_invoices'
  | 'finance.view_commissions'
  | 'finance.process_payments'
  
  // ATS Module
  | 'ats.manage_jobs'
  | 'ats.view_jobs'
  | 'ats.manage_applications'
  | 'ats.view_applications'
  | 'ats.manage_candidates'
  | 'ats.view_candidates'
  | 'ats.manage_clients'
  | 'ats.view_clients'
  
  // HRMS Module
  | 'hrms.manage_employees'
  | 'hrms.view_employees'
  | 'hrms.manage_attendance'
  | 'hrms.view_attendance'
  | 'hrms.process_payroll'
  | 'hrms.view_payroll'
  | 'hrms.manage_performance'
  | 'hrms.view_performance'
  
  // Recruitment Services
  | 'services.manage_requests'
  | 'services.view_requests'
  | 'services.manage_consultants'
  | 'services.view_consultants'
  | 'services.view_own_tasks'
  | 'services.update_task_status'
  
  // Public Facing
  | 'public.manage_job_board'
  | 'public.manage_career_pages'
  | 'public.view_analytics'
  
  // Add-ons
  | 'addons.manage_video_interviews'
  | 'addons.manage_reference_checks'
  | 'addons.manage_assessments'
  | 'addons.manage_job_distribution';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  hrm8_admin: [
    // Full platform access
    'platform.manage_employers',
    'platform.manage_users',
    'platform.view_all_data',
    'platform.manage_billing',
    'platform.view_analytics',
    'platform.manage_settings',
    'platform.manage_integrations',
    'finance.view_revenue',
    'finance.manage_invoices',
    'finance.view_commissions',
    'finance.process_payments',
    'ats.manage_jobs',
    'ats.view_jobs',
    'ats.manage_applications',
    'ats.view_applications',
    'ats.manage_candidates',
    'ats.view_candidates',
    'ats.manage_clients',
    'ats.view_clients',
    'hrms.manage_employees',
    'hrms.view_employees',
    'hrms.manage_attendance',
    'hrms.view_attendance',
    'hrms.process_payroll',
    'hrms.view_payroll',
    'hrms.manage_performance',
    'hrms.view_performance',
    'services.manage_requests',
    'services.view_requests',
    'services.manage_consultants',
    'services.view_consultants',
    'public.manage_job_board',
    'public.manage_career_pages',
    'public.view_analytics',
    'addons.manage_video_interviews',
    'addons.manage_reference_checks',
    'addons.manage_assessments',
    'addons.manage_job_distribution',
  ],
  
  hrm8_finance: [
    'platform.view_all_data',
    'finance.view_revenue',
    'finance.manage_invoices',
    'finance.view_commissions',
    'finance.process_payments',
    'ats.view_jobs',
    'ats.view_applications',
    'hrms.view_employees',
    'hrms.view_payroll',
    'services.view_requests',
  ],
  
  hrm8_support: [
    'platform.view_all_data',
    'ats.view_jobs',
    'ats.view_applications',
    'ats.view_candidates',
    'services.view_requests',
  ],
  
  employer_admin: [
    'ats.manage_jobs',
    'ats.view_jobs',
    'ats.manage_applications',
    'ats.view_applications',
    'ats.manage_candidates',
    'ats.view_candidates',
    'hrms.manage_employees',
    'hrms.view_employees',
    'hrms.manage_attendance',
    'hrms.view_attendance',
    'hrms.process_payroll',
    'hrms.view_payroll',
    'hrms.manage_performance',
    'hrms.view_performance',
    'services.view_requests',
    'public.manage_career_pages',
    'public.view_analytics',
  ],
  
  employer_recruiter: [
    'ats.manage_jobs',
    'ats.view_jobs',
    'ats.manage_applications',
    'ats.view_applications',
    'ats.view_candidates',
    'services.view_requests',
  ],
  
  employer_hr_manager: [
    'hrms.manage_employees',
    'hrms.view_employees',
    'hrms.manage_attendance',
    'hrms.view_attendance',
    'hrms.view_payroll',
    'hrms.manage_performance',
    'hrms.view_performance',
  ],
  
  employer_viewer: [
    'ats.view_jobs',
    'ats.view_applications',
    'ats.view_candidates',
    'hrms.view_employees',
    'hrms.view_attendance',
    'hrms.view_performance',
  ],
  
  consultant: [
    'services.view_own_tasks',
    'services.update_task_status',
    'ats.view_candidates',
  ],
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employerId?: string; // For employer users
  consultantId?: string; // For consultant users
  avatar?: string;
}
