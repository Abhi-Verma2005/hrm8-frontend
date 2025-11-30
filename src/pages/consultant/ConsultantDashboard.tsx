/**
 * Consultant Dashboard Layout
 * Main layout for consultants
 */

import { Outlet, Link, useLocation } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  DollarSign,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/consultant/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/consultant/jobs', label: 'My Jobs', icon: Briefcase },
  { path: '/consultant/candidates', label: 'Candidates', icon: Users },
  { path: '/consultant/commissions', label: 'Commissions', icon: DollarSign },
  { path: '/consultant/profile', label: 'Profile', icon: User },
];

export default function ConsultantDashboard() {
  const location = useLocation();
  const { consultant, logout } = useConsultantAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold">Consultant Portal</h1>
              {consultant && (
                <p className="text-sm text-muted-foreground mt-1">
                  {consultant.firstName} {consultant.lastName}
                </p>
              )}
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
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

