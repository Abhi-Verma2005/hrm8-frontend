import { Plus, UserPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export function HeaderQuickActions() {
  const quickActions = [
    { icon: Plus, label: "New Job", onClick: () => console.log("New Job") },
    { icon: UserPlus, label: "Add Candidate", onClick: () => console.log("Add Candidate") },
    { icon: Calendar, label: "Schedule", onClick: () => console.log("Schedule") },
  ];

  return (
    <>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <div className="hidden md:flex items-center gap-1">
        {quickActions.map((action, index) => (
          <Tooltip key={action.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                className="relative group h-9 w-9 hover:bg-primary/10 transition-all duration-300"
              >
                <action.icon className="h-4 w-4 transition-all group-hover:scale-110 group-hover:text-primary" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
              <p className="font-medium">{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </>
  );
}
