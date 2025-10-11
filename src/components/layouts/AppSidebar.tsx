import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import iconMark from "@/assets/icon-mark.png";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Calendar, Settings, HelpCircle, Clock, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { records: recentRecords } = useRecentRecords();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className={cn(
          "flex items-center h-12 px-3",
          "border-b border-sidebar-border/50"
        )}>
          {open ? (
            <img
              src={logoDark}
              alt="Logo"
              className="h-8 w-auto"
            />
          ) : (
            <img
              src={iconMark}
              alt="Logo"
              className="h-8 w-auto"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wide">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <NavLink
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                              "hover:bg-sidebar-accent group",
                              isActive 
                                ? "bg-primary text-primary-foreground shadow-sm font-medium" 
                                : "text-sidebar-foreground"
                            )}
                          >
                            <item.icon className={cn(
                              "h-[18px] w-[18px] transition-transform duration-200",
                              "group-hover:scale-105",
                              isActive ? "text-primary-foreground" : "text-sidebar-foreground/70"
                            )} />
                            {open && <span className="flex-1 text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      {/* Recent Records */}
      {recentRecords.length > 0 && (
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 mb-2 text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wide">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentRecords.map((record) => {
                const Icon = 
                  record.type === 'candidate' ? Users :
                  record.type === 'job' ? Briefcase :
                  Building2;

                return (
                  <SidebarMenuItem key={record.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={record.url}
                            className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-all duration-200 border border-transparent hover:border-sidebar-border/50 group"
                          >
                            <div className="flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon className="h-[15px] w-[15px] text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors" />
                            </div>
                            {open && (
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {record.name}
                                </div>
                                <div className="text-[11px] text-sidebar-foreground/40">
                                  {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                                </div>
                              </div>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right">
                          <div className="font-medium">{record.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {record.type}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
      
    <SidebarFooter className="border-t border-sidebar-border/50 p-2">
      <SidebarFooterContent />
    </SidebarFooter>
    </Sidebar>;
}