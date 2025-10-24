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
  | 'manage_settings';

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  owner: [
    'manage_jobs',
    'view_jobs',
    'manage_candidates',
    'view_candidates',
    'manage_billing',
    'view_billing',
    'manage_users',
    'manage_settings',
  ],
  admin: [
    'manage_jobs',
    'view_jobs',
    'manage_candidates',
    'view_candidates',
    'view_billing',
    'manage_users',
    'manage_settings',
  ],
  recruiter: [
    'manage_jobs',
    'view_jobs',
    'manage_candidates',
    'view_candidates',
  ],
  'hiring-manager': [
    'view_jobs',
    'view_candidates',
  ],
  viewer: [
    'view_jobs',
    'view_candidates',
  ],
};
