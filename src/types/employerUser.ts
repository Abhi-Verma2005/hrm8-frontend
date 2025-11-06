/**
 * Types for Employer User Management
 */

export interface EmployerUser {
  id: string;
  employerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  role: UserRole;
  status: UserStatus;
  permissions: UserPermission[];
  lastLoginAt?: string;
  invitedAt?: string;
  invitedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'owner' | 'admin' | 'recruiter' | 'hiring-manager' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended';

export type UserPermission = 
  | 'manage_jobs' 
  | 'view_jobs' 
  | 'manage_candidates' 
  | 'view_candidates'
  | 'manage_billing' 
  | 'view_billing'
  | 'manage_users'
  | 'manage_settings'
  // HRMS Permissions
  | 'employees.view' | 'employees.create' | 'employees.edit' | 'employees.delete'
  | 'payroll.view' | 'payroll.process' | 'payroll.approve'
  | 'attendance.view' | 'attendance.manage' | 'attendance.approve'
  | 'leave.view' | 'leave.apply' | 'leave.approve'
  | 'documents.view' | 'documents.upload' | 'documents.delete'
  | 'benefits.view' | 'benefits.manage' | 'benefits.enroll'
  | 'expenses.view' | 'expenses.submit' | 'expenses.approve'
  | 'compensation.view' | 'compensation.manage' | 'compensation.approve'
  | 'onboarding.view' | 'onboarding.manage'
  | 'offboarding.view' | 'offboarding.manage'
  | 'recruitment.view' | 'recruitment.manage'
  | 'settings.view' | 'settings.manage'
  | 'reports.view' | 'reports.export';

export type Permission = UserPermission;

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  owner: [
    'manage_jobs', 'view_jobs', 'manage_candidates', 'view_candidates',
    'manage_billing', 'view_billing', 'manage_users', 'manage_settings',
    'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
    'payroll.view', 'payroll.process', 'payroll.approve',
    'attendance.view', 'attendance.manage', 'attendance.approve',
    'leave.view', 'leave.apply', 'leave.approve',
    'documents.view', 'documents.upload', 'documents.delete',
    'benefits.view', 'benefits.manage', 'benefits.enroll',
    'expenses.view', 'expenses.submit', 'expenses.approve',
    'compensation.view', 'compensation.manage', 'compensation.approve',
    'onboarding.view', 'onboarding.manage',
    'offboarding.view', 'offboarding.manage',
    'recruitment.view', 'recruitment.manage',
    'settings.view', 'settings.manage',
    'reports.view', 'reports.export',
  ],
  admin: [
    'manage_jobs', 'view_jobs', 'manage_candidates', 'view_candidates',
    'view_billing', 'manage_users', 'manage_settings',
    'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
    'payroll.view', 'payroll.process', 'payroll.approve',
    'attendance.view', 'attendance.manage', 'attendance.approve',
    'leave.view', 'leave.apply', 'leave.approve',
    'documents.view', 'documents.upload', 'documents.delete',
    'benefits.view', 'benefits.manage', 'benefits.enroll',
    'expenses.view', 'expenses.submit', 'expenses.approve',
    'compensation.view', 'compensation.manage', 'compensation.approve',
    'onboarding.view', 'onboarding.manage',
    'offboarding.view', 'offboarding.manage',
    'recruitment.view', 'recruitment.manage',
    'reports.view', 'reports.export',
  ],
  recruiter: [
    'manage_jobs', 'view_jobs', 'manage_candidates', 'view_candidates',
    'employees.view', 'documents.view', 'documents.upload',
    'onboarding.view', 'onboarding.manage',
    'recruitment.view', 'recruitment.manage', 'reports.view',
  ],
  'hiring-manager': [
    'view_jobs', 'view_candidates',
    'employees.view', 'attendance.view', 'attendance.approve',
    'leave.view', 'leave.apply', 'leave.approve',
    'documents.view', 'expenses.view', 'expenses.approve',
    'reports.view',
  ],
  viewer: [
    'view_jobs', 'view_candidates',
    'employees.view', 'attendance.view', 'leave.view',
    'documents.view', 'benefits.view', 'compensation.view',
  ],
};
