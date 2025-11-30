/**
 * HRM8 Dashboard Layout
 * Main layout for HRM8 Global Admin and Regional Licensees
 * Uses unified dashboard layout for consistent design
 */

import { Outlet } from 'react-router-dom';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Users,
  UserCog,
  Briefcase,
  DollarSign,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { UnifiedDashboardLayout } from '@/components/layouts/UnifiedDashboardLayout';
import type { DashboardMenuItem } from '@/components/layouts/UnifiedDashboardLayout';

const menuItems: DashboardMenuItem[] = [
  { path: '/hrm8/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/hrm8/regions', label: 'Regions', icon: MapPin, adminOnly: true },
  { path: '/hrm8/licensees', label: 'Licensees', icon: Users, adminOnly: true },
  { path: '/hrm8/consultants', label: 'Consultants', icon: UserCog },
  { path: '/hrm8/jobs', label: 'Job Allocation', icon: Briefcase },
  { path: '/hrm8/commissions', label: 'Commissions', icon: DollarSign },
  { path: '/hrm8/revenue', label: 'Revenue', icon: TrendingUp },
  { path: '/hrm8/reports', label: 'Reports', icon: FileText },
];

export default function Hrm8Dashboard() {
  const { hrm8User, logout } = useHrm8Auth();

  return (
    <UnifiedDashboardLayout
      title="HRM8 Admin"
      subtitle={hrm8User?.role === 'GLOBAL_ADMIN' ? 'Global Admin' : 'Regional Licensee'}
      menuItems={menuItems}
      user={{
        name: hrm8User ? `${hrm8User.firstName} ${hrm8User.lastName}` : undefined,
        role: hrm8User?.role === 'GLOBAL_ADMIN' ? 'Global Admin' : 'Regional Licensee',
        email: hrm8User?.email,
      }}
      onLogout={logout}
      showHeader={true}
      showSidebar={true}
    >
      <Outlet />
    </UnifiedDashboardLayout>
  );
}

