import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Calendar, Settings, HelpCircle } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserProfileDropdown } from "./UserProfileDropdown";
const mainNavItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard
}, {
  title: "Candidates",
  url: "/candidates",
  icon: Users,
  badge: 12
}, {
  title: "Jobs",
  url: "/jobs",
  icon: Briefcase,
  badge: 3
}, {
  title: "Applications",
  url: "/applications",
  icon: FileText,
  badge: 5
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
  const {
    open
  } = useSidebar();
  const isActive = (path: string) => location.pathname === path;
  return <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-6 bg-gradient-to-b from-sidebar-accent/30 to-transparent">
        <div className="flex items-center gap-3">
          {open ? (
            <div className="flex-1">
              <img src={logoDark} alt="HRM8" className="h-7 mb-1" />
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                Recruitment Platform
              </p>
            </div>
          ) : (
            <img src={iconMark} alt="HRM8" className="h-8 w-8" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span>Main Menu</span>
            <div className="h-px flex-1 bg-border" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={cn(
                      "relative group transition-all duration-300",
                      "hover:bg-sidebar-accent/50 rounded-lg",
                      isActive(item.url) && [
                        "bg-gradient-to-r from-primary/10 to-primary/5",
                        "border-l-4 border-primary",
                        "shadow-sm",
                        "font-semibold"
                      ]
                    )}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                        isActive(item.url) 
                          ? "bg-primary/10 text-primary" 
                          : "bg-transparent text-muted-foreground group-hover:bg-muted group-hover:scale-110"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.title}</span>
                      
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span>Support</span>
            <div className="h-px flex-1 bg-border" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={cn(
                      "relative group transition-all duration-300",
                      "hover:bg-sidebar-accent/50 rounded-lg",
                      isActive(item.url) && [
                        "bg-gradient-to-r from-primary/10 to-primary/5",
                        "border-l-4 border-primary",
                        "shadow-sm",
                        "font-semibold"
                      ]
                    )}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                        isActive(item.url) 
                          ? "bg-primary/10 text-primary" 
                          : "bg-transparent text-muted-foreground group-hover:bg-muted group-hover:scale-110"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4 bg-gradient-to-t from-sidebar-accent/30 to-transparent">
        <UserProfileDropdown />
      </SidebarFooter>
    </Sidebar>;
}