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
      "flex gap-2",
      !open && "flex-col"
    )}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={open ? "sm" : "icon"}
            asChild
            className="flex-1"
          >
            <NavLink to="/settings">
              <Settings className="h-4 w-4" />
              {open && <span className="ml-2">Settings</span>}
            </NavLink>
          </Button>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">Settings</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={open ? "sm" : "icon"}
            asChild
            className="flex-1"
          >
            <NavLink to="/help">
              <HelpCircle className="h-4 w-4" />
              {open && <span className="ml-2">Help Center</span>}
            </NavLink>
          </Button>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">Help Center</TooltipContent>}
      </Tooltip>
    </div>
  );
}
