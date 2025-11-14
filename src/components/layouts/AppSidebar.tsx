import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { Home, LayoutGrid, Clock } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { useSidebarSections } from "@/hooks/useSidebarSections";
import { formatDistanceToNow } from "date-fns";
import { usePermissions } from "@/hooks/usePermissions";
import { PerformanceMonitor } from "./sidebar/PerformanceMonitor";

// Lazy load section components for better performance
const ATSSection = lazy(() => import("./sidebar/ATSSection").then(m => ({ default: m.ATSSection })));
const SalesSection = lazy(() => import("./sidebar/SalesSection").then(m => ({ default: m.SalesSection })));
const OperationsSection = lazy(() => import("./sidebar/OperationsSection").then(m => ({ default: m.OperationsSection })));
const HRManagementSection = lazy(() => import("./sidebar/HRManagementSection").then(m => ({ default: m.HRManagementSection })));
const ManagementSection = lazy(() => import("./sidebar/ManagementSection").then(m => ({ default: m.ManagementSection })));
const IntegrationsSection = lazy(() => import("./sidebar/IntegrationsSection").then(m => ({ default: m.IntegrationsSection })));
const SystemSection = lazy(() => import("./sidebar/SystemSection").then(m => ({ default: m.SystemSection })));

// MAIN NAVIGATION
const mainNavItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Dashboards", url: "/dashboard/overview", icon: LayoutGrid },
];

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { user } = usePermissions();
  const { records: recentRecords } = useRecentRecords();
  const { sections, toggleSection } = useSidebarSections();
  const [isHovering, setIsHovering] = useState(false);
  
  // Check module access (memoized to prevent unnecessary recalculations)
  const hasATS = useMemo(() => user.modules.atsEnabled, [user.modules.atsEnabled]);
  const hasHRMS = useMemo(() => user.modules.hrmsEnabled, [user.modules.hrmsEnabled]);
  
  // Compute visual state: show expanded when permanently open OR temporarily hovering
  const isExpanded = open || (!open && isHovering);
  
  // Memoized isActive function to prevent recreation on every render
  const isActive = useCallback((path: string) => {
    // Exact match first
    if (location.pathname === path) return true;
    
    // For dashboard routes, only match if it's a dashboard path
    if (path === '/dashboard/overview') {
      return location.pathname.startsWith('/dashboard');
    }
    
    return false;
  }, [location.pathname]);
  
  // Memoize formatted recent records to prevent recalculating on every render
  const formattedRecentRecords = useMemo(() => {
    return recentRecords.map(record => ({
      ...record,
      timeAgo: formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })
    }));
  }, [recentRecords]);
  
  // Memoized hover handlers
  const handleMouseEnter = useCallback(() => {
    if (!open) setIsHovering(true);
  }, [open]);
  
  const handleMouseLeave = useCallback(() => {
    if (!open) setIsHovering(false);
  }, [open]);

  // Loading fallback for lazy-loaded sections
  const SectionSkeleton = () => (
    <SidebarGroup>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-10 w-full mb-1" />
      <Skeleton className="h-10 w-full mb-1" />
      <Skeleton className="h-10 w-full" />
    </SidebarGroup>
  );
  
  return <Sidebar 
    collapsible="icon"
    data-hover-expand={!open && isHovering}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-b from-sidebar-accent/30 to-transparent">
          <NavLink 
            to="/home" 
            className="flex items-center gap-3 transition-all duration-200 hover:scale-105"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-sm">
              <img 
                src={iconMark} 
                alt="SpectraRecruit" 
                className="h-6 w-6 transition-transform"
              />
            </div>
            {isExpanded && (
              <img 
                src={logoDark} 
                alt="SpectraRecruit" 
                className="h-6 transition-opacity duration-200 dark:invert"
              />
            )}
          </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={cn(
                      "relative transition-all duration-200",
                      "hover:bg-sidebar-accent/50",
                      isActive(item.url) && [
                        "bg-primary/10",
                        "text-primary",
                        "font-medium",
                        isExpanded && "border-l-4 border-primary"
                      ]
                    )}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className={cn(
                        "h-5 w-5 transition-all",
                        !isExpanded && "mx-auto"
                      )} />
                      {isExpanded && <span className="transition-opacity duration-200">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Recent Records */}
        {isExpanded && formattedRecentRecords.length > 0 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Recent</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {formattedRecentRecords.slice(0, 3).map((record) => (
                    <SidebarMenuItem key={record.id}>
                      <SidebarMenuButton 
                        asChild
                        className="hover:bg-sidebar-accent/50 transition-all duration-200"
                      >
                        <NavLink to={record.url} className="flex flex-col items-start gap-1 w-full py-2">
                          <span className="text-sm font-medium line-clamp-1">{record.name}</span>
                          <span className="text-xs text-muted-foreground">{record.timeAgo}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* ATS Section - Only show if ATS module is enabled */}
        {hasATS && (
          <PerformanceMonitor id="ATSSection">
            <Suspense fallback={<SectionSkeleton />}>
              <ATSSection 
                isExpanded={isExpanded}
                isActive={isActive}
                sectionOpen={sections.ats}
                onToggleSection={() => toggleSection('ats')}
              />
            </Suspense>
          </PerformanceMonitor>
        )}

        {/* SALES Section */}
        <PerformanceMonitor id="SalesSection">
          <Suspense fallback={<SectionSkeleton />}>
            <SalesSection 
              isExpanded={isExpanded}
              isActive={isActive}
              sectionOpen={sections.sales}
              onToggleSection={() => toggleSection('sales')}
            />
          </Suspense>
        </PerformanceMonitor>

        {/* OPERATIONS Section */}
        <PerformanceMonitor id="OperationsSection">
          <Suspense fallback={<SectionSkeleton />}>
            <OperationsSection 
              isExpanded={isExpanded}
              isActive={isActive}
              sectionOpen={sections.operations}
              onToggleSection={() => toggleSection('operations')}
            />
          </Suspense>
        </PerformanceMonitor>

        {/* HR MANAGEMENT Section - Only show if HRMS module is enabled */}
        {hasHRMS && (
          <PerformanceMonitor id="HRManagementSection">
            <Suspense fallback={<SectionSkeleton />}>
              <HRManagementSection 
                isExpanded={isExpanded}
                isActive={isActive}
                sectionOpen={sections.hrManagement}
                onToggleSection={() => toggleSection('hrManagement')}
              />
            </Suspense>
          </PerformanceMonitor>
        )}

        {/* MANAGEMENT Section */}
        <PerformanceMonitor id="ManagementSection">
          <Suspense fallback={<SectionSkeleton />}>
            <ManagementSection 
              isExpanded={isExpanded}
              isActive={isActive}
              sectionOpen={sections.management}
              onToggleSection={() => toggleSection('management')}
            />
          </Suspense>
        </PerformanceMonitor>

        {/* INTEGRATIONS Section */}
        <PerformanceMonitor id="IntegrationsSection">
          <Suspense fallback={<SectionSkeleton />}>
            <IntegrationsSection 
              isExpanded={isExpanded}
              isActive={isActive}
              sectionOpen={sections.integrations}
              onToggleSection={() => toggleSection('integrations')}
            />
          </Suspense>
        </PerformanceMonitor>

        {/* SYSTEM Section */}
        <PerformanceMonitor id="SystemSection">
          <Suspense fallback={<SectionSkeleton />}>
            <SystemSection 
              isExpanded={isExpanded}
              isActive={isActive}
              sectionOpen={sections.system}
              onToggleSection={() => toggleSection('system')}
            />
          </Suspense>
        </PerformanceMonitor>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-gradient-to-t from-sidebar-accent/30 to-transparent">
        <SidebarFooterContent />
      </SidebarFooter>
  </Sidebar>;
}
