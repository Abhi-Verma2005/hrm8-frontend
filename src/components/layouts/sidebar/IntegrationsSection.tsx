import { NavLink } from "react-router-dom";
import { BarChart2, Users, GraduationCap, Heart, Server, Bell } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const integrationsNavItems = [
  { title: "Advanced Analytics", url: "/advanced-analytics", icon: BarChart2 },
  { title: "Recruitment Integration", url: "/recruitment-integration", icon: Users },
  { title: "Enhanced Learning", url: "/enhanced-learning", icon: GraduationCap },
  { title: "Wellness Hub", url: "/wellness-hub", icon: Heart },
  { title: "API Access", url: "/api-access", icon: Server },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

interface IntegrationsSectionProps {
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  sectionOpen: boolean;
  onToggleSection: () => void;
}

export function IntegrationsSection({ isExpanded, isActive, sectionOpen, onToggleSection }: IntegrationsSectionProps) {
  return (
    <>
      <Collapsible open={sectionOpen} onOpenChange={onToggleSection}>
        <SidebarGroup>
          {isExpanded && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/30 rounded-sm transition-colors flex items-center justify-between group">
                <span>Integration & Intelligence</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
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
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <SidebarSeparator />
    </>
  );
}
