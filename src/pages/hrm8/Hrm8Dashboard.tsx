/**
 * HRM8 Dashboard Layout
 * Main layout for HRM8 Global Admin and Regional Licensees
 */

import { Outlet, Link, useLocation } from 'react-router-dom';
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
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
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
  const location = useLocation();
  const { hrm8User, logout } = useHrm8Auth();
  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || isGlobalAdmin
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold">HRM8 Admin</h1>
              {hrm8User && (
                <p className="text-sm text-muted-foreground mt-1">
                  {hrm8User.role === 'GLOBAL_ADMIN' ? 'Global Admin' : 'Regional Licensee'}
                </p>
              )}
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

