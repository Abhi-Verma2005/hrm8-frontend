import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { User, LogOut, Settings, HelpCircle, ChevronUp } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SidebarFooterContent() {
  const { open } = useSidebar();

  return (
    <div className="space-y-2">
      {/* Quick action buttons - Settings & Help */}
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

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 px-2 py-6 h-auto hover:bg-sidebar-accent",
              !open && "justify-center px-2"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" alt="John Doe" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                JD
              </AvatarFallback>
            </Avatar>
            {open && (
              <>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">John Doe</span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
