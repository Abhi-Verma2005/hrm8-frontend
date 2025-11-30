/**
 * Consultant Dashboard Layout
 * Main layout for consultants
 * Uses unified dashboard layout for consistent design
 */

import { Outlet } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  DollarSign,
  User,
} from 'lucide-react';
import { UnifiedDashboardLayout } from '@/components/layouts/UnifiedDashboardLayout';
import type { DashboardMenuItem } from '@/components/layouts/UnifiedDashboardLayout';

const menuItems: DashboardMenuItem[] = [
  { path: '/consultant/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/consultant/jobs', label: 'My Jobs', icon: Briefcase },
  { path: '/consultant/candidates', label: 'Candidates', icon: Users },
  { path: '/consultant/commissions', label: 'Commissions', icon: DollarSign },
  { path: '/consultant/profile', label: 'Profile', icon: User },
];

export default function ConsultantDashboard() {
  const { consultant, logout } = useConsultantAuth();

  return (
    <UnifiedDashboardLayout
      title="Consultant Portal"
      subtitle={consultant ? `${consultant.firstName} ${consultant.lastName}` : undefined}
      menuItems={menuItems}
      user={{
        name: consultant ? `${consultant.firstName} ${consultant.lastName}` : undefined,
        role: consultant?.role,
        email: consultant?.email,
      }}
      onLogout={logout}
      showHeader={true}
      showSidebar={true}
    >
      <Outlet />
    </UnifiedDashboardLayout>
  );
}

