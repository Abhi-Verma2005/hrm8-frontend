import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Calendar, Settings, HelpCircle, Clock, Building } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { formatDistanceToNow } from "date-fns";
const mainNavItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard
}, {
  title: "Candidates",
  url: "/candidates",
  icon: Users
}, {
  title: "Jobs",
  url: "/jobs",
  icon: Briefcase
}, {
  title: "Applications",
  url: "/applications",
  icon: FileText
}, {
  title: "Analytics",
  url: "/analytics",
  icon: BarChart3
}, {
  title: "Calendar",
  url: "/calendar",
  icon: Calendar
}];
const secondaryNavItems = [{
  title: "Settings",
  url: "/settings",
  icon: Settings
}, {
  title: "Help Center",
  url: "/help",
  icon: HelpCircle
}];
export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { records: recentRecords, clearRecentRecords } = useRecentRecords();
  const [isHovering, setIsHovering] = useState(false);
  
  // Compute visual state: show expanded when permanently open OR temporarily hovering
  const isExpanded = open || (!open && isHovering);
  
  const isActive = (path: string) => location.pathname === path;
  
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
        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="transition-opacity duration-200">Main Menu</span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    {!isExpanded && (
                      <TooltipContent side="right">
                        <span>{item.title}</span>
                      </TooltipContent>
                    )}
                  </Tooltip>
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
              {isExpanded ? (
                <>
                  <span className="transition-opacity duration-200">Recent</span>
                  <button
                    onClick={clearRecentRecords}
                    className="ml-auto text-[10px] hover:text-foreground transition-colors"
                    title="Clear recent items"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <span className="sr-only">Recent</span>
              )}
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
                    'Customer';

                  return (
                    <SidebarMenuItem key={`recent-${record.id}`}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        {!isExpanded && (
                          <TooltipContent side="right" className="flex flex-col gap-1">
                            <span className="font-medium">{record.name}</span>
                            <span className="text-xs text-muted-foreground">{typeLabel}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                            </span>
                          </TooltipContent>
                        )}
                      </Tooltip>
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