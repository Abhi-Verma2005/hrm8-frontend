import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Calendar, Settings, HelpCircle, Clock, Building, UserCog, Mail, DollarSign, FileBarChart, Shield, Ticket, Heart, UsersRound, UserCheck, Target, Plug, CalendarDays, ClipboardList, Wallet, Gift, Receipt, FolderOpen, DollarSignIcon, UserMinus, GraduationCap, TrendingUp, User, Crown, CalendarClock, BarChart2, MessageSquare } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { FeedbackNotificationBadge } from "@/components/feedback/FeedbackNotificationBadge";
import { formatDistanceToNow } from "date-fns";
import { usePermissions } from "@/hooks/usePermissions";
// CORE Section
const coreNavItems = [
  { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
];

// ATS (Applicant Tracking System) Section
const atsNavItems = [
  { 
    title: "Jobs", 
    url: "/jobs", 
    icon: Briefcase,
    subItems: [
      { title: "All Jobs", url: "/jobs" },
      { title: "Templates", url: "/jobs/templates" },
      { title: "Automation", url: "/jobs/automation" },
      { title: "Analytics", url: "/jobs/analytics" },
    ]
  },
  { 
    title: "Candidates", 
    url: "/candidates", 
    icon: Users,
    subItems: [
      { title: "All Candidates", url: "/candidates" },
      { title: "Pipeline Board", url: "/candidates/pipeline" },
    ]
  },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Requisitions", url: "/requisitions", icon: ClipboardList },
  { 
    title: "Interviews", 
    url: "/interviews", 
    icon: CalendarClock,
    badge: FeedbackNotificationBadge,
    subItems: [
      { title: "All Interviews", url: "/interviews" },
      { title: "Schedule", url: "/interviews/schedule" },
      { title: "Collaborative Feedback", url: "/collaborative-feedback" },
    ]
  },
  { 
    title: "Offers", 
    url: "/offers", 
    icon: Mail,
    subItems: [
      { title: "All Offers", url: "/offers" },
      { title: "Management", url: "/offers/manage" },
    ]
  },
  { title: "Background Checks", url: "/background-checks", icon: Shield },
];

// OPERATIONS Section
const operationsNavItems = [
  { title: "Employers", url: "/employers", icon: Building },
  { title: "Consultants", url: "/consultants", icon: UserCog },
  { title: "Recruitment Services", url: "/recruitment-services", icon: Target },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Internal Jobs", url: "/internal-jobs", icon: Building },
  { title: "Email Templates", url: "/email-templates", icon: Mail },
  { title: "Import/Export", url: "/import-export", icon: FileBarChart },
  { title: "Inbox", url: "/inbox", icon: Mail },
];

// HR MANAGEMENT Section
const hrManagementNavItems = [
  { 
    title: "Employees", 
    url: "/hrms", 
    icon: Heart,
    subItems: [
      { title: "Employees", url: "/hrms" },
      { title: "Analytics", url: "/hrms/analytics" },
      { title: "Org Chart", url: "/hrms/org-chart" },
    ]
  },
  { title: "Onboarding", url: "/onboarding", icon: UserCheck },
  { title: "Performance", url: "/performance", icon: TrendingUp },
  { title: "Talent Development", url: "/talent-development", icon: GraduationCap },
  { title: "Leave Management", url: "/leave", icon: CalendarDays },
  { title: "Time & Attendance", url: "/attendance", icon: Clock },
  { title: "Payroll", url: "/payroll", icon: Wallet },
  { title: "Benefits", url: "/benefits", icon: Gift },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Compensation", url: "/compensation", icon: DollarSignIcon },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Offboarding", url: "/offboarding", icon: UserMinus },
  { title: "Self-Service", url: "/ess", icon: User },
  { title: "Compliance", url: "/compliance", icon: Shield },
  { title: "Employee Relations", url: "/employee-relations", icon: Shield },
  { title: "Role Management", url: "/role-management", icon: Crown },
  { title: "Accrual Policies", url: "/accrual-policies", icon: CalendarClock },
  { title: "Workforce Planning", url: "/workforce-planning", icon: BarChart2 },
  { title: "Benefits Admin", url: "/benefits-admin", icon: Heart },
];

// MANAGEMENT Section
const managementNavItems = [
  { title: "Users", url: "/users", icon: UsersRound },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Reports", url: "/reports", icon: FileBarChart },
];

// INTEGRATIONS Section
const integrationsNavItems = [
  { title: "Advanced Analytics", url: "/advanced-analytics", icon: BarChart2 },
  { title: "Recruitment Integration", url: "/recruitment-integration", icon: Users },
  { title: "Enhanced Learning", url: "/enhanced-learning", icon: GraduationCap },
  { title: "Integrations", url: "/integrations", icon: Plug },
];

// SYSTEM Section
const systemNavItems = [
  { title: "Admin Settings", url: "/admin-settings", icon: Shield },
  { title: "Support Tickets", url: "/support-tickets", icon: Ticket },
];
export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { records: recentRecords, clearRecentRecords } = useRecentRecords();
  const { user } = usePermissions();
  const [isHovering, setIsHovering] = useState(false);
  
  // Check module access
  const hasATS = user.modules.atsEnabled;
  const hasHRMS = user.modules.hrmsEnabled;
  
  // Compute visual state: show expanded when permanently open OR temporarily hovering
  const isExpanded = open || (!open && isHovering);
  
  const isActive = (path: string) => {
    // Exact match first
    if (location.pathname === path) return true;
    
    // For parent routes, check if current path starts with the route
    // But exclude dashboard routes from prefix matching to avoid conflicts
    if (!path.startsWith('/dashboard')) {
      return location.pathname.startsWith(path + '/');
    }
    
    return false;
  };
  
  return <Sidebar 
    collapsible="icon"
    data-hover-expand={!open && isHovering}
    onMouseEnter={() => !open && setIsHovering(true)}
    onMouseLeave={() => !open && setIsHovering(false)}
  >
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-b from-sidebar-accent/30 to-transparent">
        <div className={cn(
          "flex items-center transition-all duration-200",
          isExpanded ? "justify-start px-2" : "justify-center"
        )}>
          {isExpanded ? (
            <img src={logoDark} alt="HRM8" className="h-8" />
          ) : (
            <img src={iconMark} alt="HRM8" className="h-8 w-8" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* CORE Section */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Core
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {coreNavItems.map(item => (
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

        {/* ATS Section - Only show if ATS module is enabled */}
        {hasATS && (
          <>
            <SidebarGroup>
              {isExpanded && (
                <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recruitment (ATS)
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {atsNavItems.map(item => (
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
          </>
        )}

        {/* OPERATIONS Section */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Operations
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNavItems.map(item => (
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

        {/* HR MANAGEMENT Section - Only show if HRMS module is enabled */}
        {hasHRMS && (
          <>
            <SidebarGroup>
              {isExpanded && (
                <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  HR Management
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {hrManagementNavItems.map(item => (
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
          </>
        )}

        {/* MANAGEMENT Section */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map(item => (
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

        {/* INTEGRATIONS & INTELLIGENCE Section */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Integration & Intelligence
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {integrationsNavItems.map(item => (
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

        {/* SYSTEM Section */}
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map(item => (
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

      {/* Recent Records Section */}
      {recentRecords.length > 0 && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span className="transition-opacity duration-200">Recent</span>
              <button
                onClick={clearRecentRecords}
                className="ml-auto text-[10px] hover:text-foreground transition-colors"
                title="Clear recent items"
              >
                Clear
              </button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentRecords.map((record) => {
                  const Icon = 
                    record.type === 'candidate' ? Users :
                    record.type === 'job' ? Briefcase :
                    Building;
                  
                  const typeLabel = 
                    record.type === 'candidate' ? 'Candidate' :
                    record.type === 'job' ? 'Job' :
                    'Employer';

                  return (
                    <SidebarMenuItem key={`recent-${record.id}`}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === record.url}
                        className={cn(
                          "transition-all duration-200 hover:bg-sidebar-accent/40",
                          location.pathname === record.url && "bg-primary/10 text-primary"
                        )}
                      >
                        <NavLink to={record.url} className="flex items-center gap-2 w-full">
                          <Icon className={cn(
                            "h-4 w-4",
                            !isExpanded && "mx-auto"
                          )} />
                          {isExpanded && (
                            <div className="flex-1 min-w-0 transition-opacity duration-200">
                              <div className="text-sm font-medium truncate">
                                {record.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {typeLabel}
                              </div>
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}
    </SidebarContent>
      
    <SidebarFooter className="border-t border-sidebar-border p-3 bg-gradient-to-t from-sidebar-accent/30 to-transparent">
      <SidebarFooterContent />
    </SidebarFooter>
    </Sidebar>;
}