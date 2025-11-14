import { NavLink } from "react-router-dom";
import { Briefcase, Users, FileCheck, ClipboardList, CalendarClock, FileSignature, MessageSquare, ClipboardCheck, ShieldCheck } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackNotificationBadge } from "@/components/feedback/FeedbackNotificationBadge";

const atsNavItems = [
  { 
    title: "Jobs", 
    url: "/jobs", 
    icon: Briefcase,
    subItems: [
      { title: "All Jobs", url: "/jobs" },
      { title: "Templates", url: "/jobs/templates" },
      { title: "Automation", url: "/jobs/automation" },
      { title: "Analytics", url: "/jobs/analytics" },
    ]
  },
  { 
    title: "Candidates", 
    url: "/candidates", 
    icon: Users,
    subItems: [
      { title: "All Candidates", url: "/candidates" },
      { title: "Pipeline Board", url: "/candidates/pipeline" },
    ]
  },
  { title: "Applications", url: "/applications", icon: FileCheck },
  { title: "Requisitions", url: "/requisitions", icon: ClipboardList },
  { 
    title: "Interviews", 
    url: "/interviews", 
    icon: CalendarClock,
    badge: FeedbackNotificationBadge,
    subItems: [
      { title: "All Interviews", url: "/interviews" },
      { title: "Schedule", url: "/interviews/schedule" },
      { title: "Collaborative Feedback", url: "/collaborative-feedback" },
    ]
  },
  { 
    title: "Offers", 
    url: "/offers", 
    icon: FileSignature,
    subItems: [
      { title: "All Offers", url: "/offers" },
      { title: "Management", url: "/offers/manage" },
    ]
  },
  { 
    title: "AI Interviews", 
    url: "/ai-interviews", 
    icon: MessageSquare,
    subItems: [
      { title: "All Interviews", url: "/ai-interviews" },
      { title: "Schedule New", url: "/ai-interviews/schedule" },
      { title: "Reports", url: "/ai-interviews/reports" },
      { title: "Analytics", url: "/ai-interviews/analytics" },
    ]
  },
  { 
    title: "Assessments",
    url: "/assessments", 
    icon: ClipboardCheck,
    subItems: [
      { title: "All Assessments", url: "/assessments" },
      { title: "Templates", url: "/assessment-templates" },
      { title: "Question Bank", url: "/question-bank" },
      { title: "Analytics", url: "/assessment-analytics" },
    ]
  },
  { title: "Background Checks", url: "/background-checks", icon: ShieldCheck },
];

interface ATSSectionProps {
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  sectionOpen: boolean;
  onToggleSection: () => void;
}

export function ATSSection({ isExpanded, isActive, sectionOpen, onToggleSection }: ATSSectionProps) {
  return (
    <>
      <Collapsible open={sectionOpen} onOpenChange={onToggleSection}>
        <SidebarGroup>
          {isExpanded && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/30 rounded-sm transition-colors flex items-center justify-between group">
                <span>Recruitment (ATS)</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {atsNavItems.map(item => (
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
