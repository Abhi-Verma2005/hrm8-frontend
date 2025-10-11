import { Plus, UserPlus, Calendar } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarQuickActions() {
  const { open } = useSidebar();

  const quickActions = [
    { icon: Plus, label: "New Job", onClick: () => console.log("New Job") },
    { icon: UserPlus, label: "Add Candidate", onClick: () => console.log("Add Candidate") },
    { icon: Calendar, label: "Schedule", onClick: () => console.log("Schedule") },
  ];

  return (
    <div className="px-4 py-3 border-t border-sidebar-border">
      <div className={cn("grid gap-2", open ? "grid-cols-3" : "grid-cols-1")}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-sidebar-accent transition-all group"
          >
            <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            {open && <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{action.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
