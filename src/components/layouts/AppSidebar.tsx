import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Calendar, Settings, HelpCircle, Clock, Building, UserCog, Mail, DollarSign, FileBarChart, Shield, Ticket, Heart, UsersRound, UserCheck, Target, Plug } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { formatDistanceToNow } from "date-fns";
// CORE Section
const coreNavItems = [
  { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Candidates", url: "/candidates", icon: Users },
];

// OPERATIONS Section
const operationsNavItems = [
  { title: "Employers", url: "/employers", icon: Building },
  { title: "Consultants", url: "/consultants", icon: UserCog },
  { title: "Recruitment Services", url: "/recruitment-services", icon: Target },
  { title: "HRMS", url: "/hrms", icon: UserCheck },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Inbox", url: "/inbox", icon: Mail },
];

// MANAGEMENT Section
const managementNavItems = [
  { title: "Users", url: "/users", icon: UsersRound },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Reports", url: "/reports", icon: FileBarChart },
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
  const [isHovering, setIsHovering] = useState(false);
  
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