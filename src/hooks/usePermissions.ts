import { Permission } from "@/types/employerUser";

// Mock current user - in production, this would come from auth context
const mockCurrentUser = {
  id: 'user-1',
  role: 'admin' as const,
  permissions: [
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
  ] as Permission[],
};

export function usePermissions() {
  const hasPermission = (permission: Permission): boolean => {
    return mockCurrentUser.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    user: mockCurrentUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
