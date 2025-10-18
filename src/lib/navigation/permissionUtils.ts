import type { UserRole, Permission, User } from "@/types/roles";
import { ROLE_PERMISSIONS } from "@/types/roles";

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if a user is an HRM8 admin
 */
export function isHRM8Admin(user: User): boolean {
  return user.role === 'hrm8_admin' || user.role === 'hrm8_finance';
}

/**
 * Check if a user is an employer user
 */
export function isEmployerUser(user: User): boolean {
  return ['employer_admin', 'employer_recruiter', 'employer_hr_manager', 'employer_viewer'].includes(user.role);
}

/**
 * Check if a user is a consultant
 */
export function isConsultant(user: User): boolean {
  return user.role === 'consultant';
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: User): Permission[] {
  return ROLE_PERMISSIONS[user.role];
}

/**
 * Filter items based on user permissions
 */
export function filterByPermissions<T extends { requiredPermissions?: Permission[] }>(
  items: T[],
  user: User
): T[] {
  return items.filter(item => {
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }
    return hasAnyPermission(user, item.requiredPermissions);
  });
}
