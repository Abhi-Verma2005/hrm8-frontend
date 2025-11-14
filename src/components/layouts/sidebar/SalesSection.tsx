import { NavLink } from "react-router-dom";
import { TrendingUp, UserCog, Target, CircleDollarSign, BarChart3, DollarSign, Map, LineChart } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const salesNavItems = [
  { title: "Sales Dashboard", url: "/sales/dashboard", icon: TrendingUp },
  { title: "Sales Team", url: "/sales/team", icon: UserCog },
  { title: "Pipeline", url: "/sales/pipeline", icon: Target },
  { title: "Opportunities", url: "/sales/opportunities", icon: CircleDollarSign },
  { title: "Activities", url: "/sales/activities", icon: BarChart3 },
  { title: "Commissions", url: "/sales/commissions", icon: DollarSign },
  { title: "Territories", url: "/sales/territories", icon: Map },
  { title: "Forecast", url: "/sales/forecast", icon: LineChart },
];

interface SalesSectionProps {
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  sectionOpen: boolean;
  onToggleSection: () => void;
}

export function SalesSection({ isExpanded, isActive, sectionOpen, onToggleSection }: SalesSectionProps) {
  return (
    <>
      <Collapsible open={sectionOpen} onOpenChange={onToggleSection}>
        <SidebarGroup>
          {isExpanded && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/30 rounded-sm transition-colors flex items-center justify-between group">
                <span>Sales</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {salesNavItems.map(item => (
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
