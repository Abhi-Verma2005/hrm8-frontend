import { NavLink } from "react-router-dom";
import { UserCheck, UserCog, Award, GraduationCap, CalendarDays, Clock, Wallet, Gift, Receipt, DollarSignIcon, FolderOpen, UserMinus, User, ScrollText, MessageSquare, Crown, CalendarClock, BarChart2, HeartHandshake } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const hrManagementNavItems = [
  { 
    title: "Employees", 
    url: "/hrms", 
    icon: UserCheck,
    subItems: [
      { title: "Employees", url: "/hrms" },
      { title: "Analytics", url: "/hrms/analytics" },
      { title: "Org Chart", url: "/hrms/org-chart" },
    ]
  },
  { title: "Onboarding", url: "/onboarding", icon: UserCog },
  { title: "Performance", url: "/performance", icon: Award },
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
  { title: "Compliance", url: "/compliance", icon: ScrollText },
  { title: "Employee Relations", url: "/employee-relations", icon: MessageSquare },
  { title: "Role Management", url: "/role-management", icon: Crown },
  { title: "Accrual Policies", url: "/accrual-policies", icon: CalendarClock },
  { title: "Workforce Planning", url: "/workforce-planning", icon: BarChart2 },
  { title: "Benefits Admin", url: "/benefits-admin", icon: HeartHandshake },
];

interface HRManagementSectionProps {
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  sectionOpen: boolean;
  onToggleSection: () => void;
}

export function HRManagementSection({ isExpanded, isActive, sectionOpen, onToggleSection }: HRManagementSectionProps) {
  return (
    <>
      <Collapsible open={sectionOpen} onOpenChange={onToggleSection}>
        <SidebarGroup>
          {isExpanded && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/30 rounded-sm transition-colors flex items-center justify-between group">
                <span>HR Management (HRMS)</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
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
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <SidebarSeparator />
    </>
  );
}
