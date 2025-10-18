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
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarFooterContent } from "./SidebarFooterContent";
import { useRecentRecords } from "@/hooks/useRecentRecords";
import { ADMIN_MENU_SECTIONS, DASHBOARD_OPTIONS } from "@/lib/navigation/menuConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { records: recentRecords, clearRecentRecords } = useRecentRecords();
  const [isHovering, setIsHovering] = useState(false);
  
  // Compute visual state: show expanded when permanently open OR temporarily hovering
  const isExpanded = open || (!open && isHovering);
  
  // Get current dashboard from URL
  const currentDashboard = DASHBOARD_OPTIONS.find(d => 
    location.pathname.startsWith(d.url)
  ) || DASHBOARD_OPTIONS[0];
  
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
                      {/* Dashboard Dropdown */}
                      <SidebarMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                              className={cn(
                                "relative transition-all duration-200",
                                "hover:bg-sidebar-accent/50",
                                location.pathname.startsWith('/dashboard') && [
                                  "bg-primary/10",
                                  "text-primary",
                                  "font-medium",
                                  isExpanded && "border-l-4 border-primary"
                                ]
                              )}
                            >
                              <currentDashboard.icon className={cn(
                                "h-5 w-5 transition-all",
                                !isExpanded && "mx-auto"
                              )} />
                              {isExpanded && (
                                <>
                                  <span className="flex-1 text-left">Dashboard</span>
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </>
                              )}
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            {DASHBOARD_OPTIONS.map((dashboard) => {
                              const Icon = dashboard.icon;
                              return (
                                <DropdownMenuItem key={dashboard.id} asChild>
                                  <NavLink 
                                    to={dashboard.url}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Icon className="h-4 w-4" />
                                    <span>{dashboard.label}</span>
                                    {dashboard.isNew && (
                                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                                        NEW
                                      </Badge>
                                    )}
                                  </NavLink>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>

                      {/* Other workspace items */}
                      {section.items.slice(1).map(item => (
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
