import { NavLink } from "react-router-dom";
import { Building2, Handshake, Target, UserRound, PieChart, Calendar, UserSquare, MailPlus, FileBarChart, Inbox } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const operationsNavItems = [
  { title: "Employers", url: "/employers", icon: Building2 },
  { title: "Consultants", url: "/consultants", icon: Handshake },
  { title: "Recruitment Services", url: "/recruitment-services", icon: Target },
  { 
    title: "RPO", 
    url: "/rpo", 
    icon: UserRound,
    subItems: [
      { title: "Overview", url: "/rpo" },
      { title: "Contracts", url: "/rpo/contracts" },
      { title: "Consultants", url: "/rpo/consultants" },
      { title: "Performance", url: "/rpo/performance" },
      { title: "Renewals", url: "/rpo/renewals" },
      { title: "Tasks & Allocation", url: "/rpo/tasks" },
      { title: "Revenue Forecast", url: "/rpo/forecast" },
    ]
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: PieChart,
    subItems: [
      { title: "Overview", url: "/analytics" },
      { title: "Recruitment Analytics", url: "/recruitment-analytics" },
    ]
  },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Internal Jobs", url: "/internal-jobs", icon: UserSquare },
  { title: "Email Templates", url: "/email-templates", icon: MailPlus },
  { title: "Import/Export", url: "/import-export", icon: FileBarChart },
  { title: "Inbox", url: "/inbox", icon: Inbox },
];

interface OperationsSectionProps {
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  sectionOpen: boolean;
  onToggleSection: () => void;
}

export function OperationsSection({ isExpanded, isActive, sectionOpen, onToggleSection }: OperationsSectionProps) {
  return (
    <>
      <Collapsible open={sectionOpen} onOpenChange={onToggleSection}>
        <SidebarGroup>
          {isExpanded && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/30 rounded-sm transition-colors flex items-center justify-between group">
                <span>Operations</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
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
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <SidebarSeparator />
    </>
  );
}
