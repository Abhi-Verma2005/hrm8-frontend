/**
 * Simple CrmAuth Hook
 * Provides role-based permissions for CRM features
 */

import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';

export function useCrmAuth() {
    const { hrm8User } = useHrm8Auth();

    const isHrm8Admin = () => {
        return hrm8User?.role === 'GLOBAL_ADMIN';
    };

    const isLicenseeAdmin = () => {
        return hrm8User?.role === 'REGIONAL_LICENSEE';
    };

    const canValidateLeads = () => {
        return isHrm8Admin() || isLicenseeAdmin();
    };

    const canOverrideAttribution = () => {
        return isHrm8Admin();
    };

    return {
        user: hrm8User,
        roleContext: { role: hrm8User?.role || null },
        isHrm8Admin,
        isLicenseeAdmin,
        canValidateLeads,
        canOverrideAttribution,
    };
}
