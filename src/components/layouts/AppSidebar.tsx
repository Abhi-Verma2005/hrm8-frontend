import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import iconMark from "@/assets/icon-mark.png";
import { Clock } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { ADMIN_MENU_SECTIONS } from "@/lib/navigation/menuConfig";

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { records: recentRecords, clearRecentRecords } = useRecentRecords();
  const [isHovering, setIsHovering] = useState(false);
  
  // Compute visual state: show expanded when permanently open OR temporarily hovering
  const isExpanded = open || (!open && isHovering);
  
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Exact match first
    if (currentPath === path) return true;
    
    // For dashboard routes, only match child routes (with trailing slash)
    // This prevents /dashboard/overview from activating other dashboard items
    if (path.startsWith('/dashboard')) {
      return currentPath.startsWith(path + '/');
    }
    
    // For non-dashboard routes, match if current path is a child route
    // e.g., /jobs matches /jobs/123
    return currentPath.startsWith(path + '/');
  };

  const shouldShowAsActive = (itemUrl: string, itemTitle: string) => {
    // If this item uses a placeholder dashboard URL and is not the Dashboard item itself
    if (itemUrl === '/dashboard/overview' && itemTitle !== 'Dashboard') {
      return false; // Don't show placeholder items as active
    }
    
    return isActive(itemUrl);
  };

  const isDashboardActive = () => {
    // Only consider Dashboard active if we're on a dashboard route
    return location.pathname.startsWith('/dashboard');
  };
  
  return (
    <Sidebar 
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
        {/* Render menu sections from config */}
        {ADMIN_MENU_SECTIONS.map((section, index) => {
          // Handle WORKSPACE section specially for dashboard dropdown
          if (section.id === 'workspace') {
            return (
              <div key={section.id}>
                <SidebarGroup>
                  {isExpanded && (
                    <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.label}
                    </SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {/* Dashboard Link */}
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isDashboardActive()}
                          className={cn(
                            "relative transition-all duration-200",
                            "hover:bg-sidebar-accent/50",
                            isDashboardActive() && [
                              "bg-primary/10",
                              "text-primary",
                              "font-medium",
                              isExpanded && "border-l-4 border-primary"
                            ]
                          )}
                        >
                          <NavLink to="/dashboard/overview" className="flex items-center gap-3 w-full">
                            <LayoutDashboard className={cn(
                              "h-5 w-5 transition-all",
                              !isExpanded && "mx-auto"
                            )} />
                            {isExpanded && (
                              <span className="transition-opacity duration-200">Dashboard</span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Other workspace items */}
                      {section.items.slice(1).map(item => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={shouldShowAsActive(item.url, item.title)}
                            className={cn(
                              "relative transition-all duration-200",
                              "hover:bg-sidebar-accent/50",
                              shouldShowAsActive(item.url, item.title) && [
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
                              {isExpanded && (
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="transition-opacity duration-200">{item.title}</span>
                                  {typeof item.badge === 'number' && item.badge > 0 && (
                                    <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
              </div>
            );
          }

          // Regular collapsible sections
          return (
            <div key={section.id}>
              <Collapsible defaultOpen={section.defaultOpen}>
                <SidebarGroup>
                  {isExpanded && (
                    <CollapsibleTrigger className="w-full [&[data-state=open]>svg]:rotate-180">
                      <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                        <span>{section.label}</span>
                        {section.collapsible && (
                          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                        )}
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                  )}
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {section.items.map(item => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={shouldShowAsActive(item.url, item.title)}
                              className={cn(
                                "relative transition-all duration-200",
                                "hover:bg-sidebar-accent/50",
                                shouldShowAsActive(item.url, item.title) && [
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
                                {isExpanded && (
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="transition-opacity duration-200">{item.title}</span>
                                    {item.isNew && (
                                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                                        NEW
                                      </Badge>
                                    )}
                                    {typeof item.badge === 'number' && item.badge > 0 && (
                                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
              {index < ADMIN_MENU_SECTIONS.length - 1 && <SidebarSeparator />}
            </div>
          );
        })}

        {/* Recent Records Section */}
        {recentRecords.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              {isExpanded && (
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
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {recentRecords.map((record) => {
                    const typeLabel = 
                      record.type === 'candidate' ? 'Candidate' :
                      record.type === 'job' ? 'Job' :
                      'Employer';

                    // Find the appropriate icon from menu items
                    const Icon = ADMIN_MENU_SECTIONS
                      .flatMap(s => s.items)
                      .find(i => i.url === record.url.split('/').slice(0, 2).join('/'))?.icon || Clock;

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
    </Sidebar>
  );
}
