/**
 * Unified Dashboard Layout
 * Standardized layout component for all dashboard types (HRM8, Consultant, Candidate, Company)
 * Ensures consistent design across all dashboards
 */

import { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogOut, LucideIcon } from 'lucide-react';

export interface DashboardMenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  badge?: ReactNode;
}

interface UnifiedDashboardLayoutProps {
  title: string;
  subtitle?: string;
  menuItems: DashboardMenuItem[];
  user?: {
    name?: string;
    role?: string;
    email?: string;
  };
  onLogout: () => void;
  children?: ReactNode;
  breadcrumbActions?: ReactNode;
  dashboardActions?: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
}

export function UnifiedDashboardLayout({
  title,
  subtitle,
  menuItems,
  user,
  onLogout,
  children,
  breadcrumbActions,
  dashboardActions,
  showHeader = true,
  showSidebar = true,
}: UnifiedDashboardLayoutProps) {
  const location = useLocation();

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === 'GLOBAL_ADMIN'
  );

  const sidebarContent = (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6 border-b">
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        {user?.name && (
          <p className="text-sm text-muted-foreground mt-1">
            {user.name}
            {user.role && ` • ${user.role}`}
          </p>
        )}
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           location.pathname.startsWith(item.path + '/');
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Link to={item.path}>
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && <span className="ml-auto">{item.badge}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );

  if (!showSidebar && !showHeader) {
    // Simple layout without sidebar/header (for embedded views)
    return (
      <div className="min-h-screen bg-background">
        <div className="p-8">
          {children || <Outlet />}
        </div>
      </div>
    );
  }

  if (!showSidebar) {
    // Header only layout
    return (
      <div className="min-h-screen bg-background">
        {showHeader && <DashboardHeader breadcrumbActions={breadcrumbActions} />}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    );
  }

  // Full layout with sidebar and header
  // Note: DashboardHeader is NOT included here because DashboardPageLayout handles it
  // This prevents duplicate headers when using DashboardPageLayout inside
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        {sidebarContent}
        <SidebarInset className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto">
            {children || <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

