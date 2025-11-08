import { Permission, UserRole } from "@/types/employerUser";
import { getEffectivePermissions } from "@/lib/employerUserPermissions";
import { useMemo } from "react";

// Mock current user - in production, this would come from auth context
const mockCurrentUser = {
  id: 'user-1',
  role: 'admin' as UserRole,
  // Mock employer context - in production, would come from context/auth
  employerId: 'employer-1',
  modules: {
    atsEnabled: true,
    hrmsEnabled: true,
  },
};

export function usePermissions() {
  // Calculate effective permissions based on enabled modules
  const effectivePermissions = useMemo(() => {
    return getEffectivePermissions(mockCurrentUser.role, {
      atsEnabled: mockCurrentUser.modules.atsEnabled,
      hrmsEnabled: mockCurrentUser.modules.hrmsEnabled,
    });
  }, [mockCurrentUser.role, mockCurrentUser.modules.atsEnabled, mockCurrentUser.modules.hrmsEnabled]);

  const hasPermission = (permission: Permission): boolean => {
    return effectivePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    user: mockCurrentUser,
    permissions: effectivePermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
