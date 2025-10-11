import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { Settings, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SidebarFooterContent() {
  const { open } = useSidebar();

  return (
    <div className={cn(
      "flex gap-1",
      !open && "flex-col"
    )}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "flex-1 justify-start gap-2 px-3 py-2 h-9",
              "hover:bg-sidebar-accent transition-colors duration-200",
              !open && "justify-center px-2"
            )}
          >
            <NavLink to="/settings" className="flex items-center gap-2">
              <Settings className="h-[16px] w-[16px] text-sidebar-foreground/70" />
              {open && <span className="text-sm">Settings</span>}
            </NavLink>
          </Button>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">Settings</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "flex-1 justify-start gap-2 px-3 py-2 h-9",
              "hover:bg-sidebar-accent transition-colors duration-200",
              !open && "justify-center px-2"
            )}
          >
            <NavLink to="/help" className="flex items-center gap-2">
              <HelpCircle className="h-[16px] w-[16px] text-sidebar-foreground/70" />
              {open && <span className="text-sm">Help Center</span>}
            </NavLink>
          </Button>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">Help Center</TooltipContent>}
      </Tooltip>
    </div>
  );
}
