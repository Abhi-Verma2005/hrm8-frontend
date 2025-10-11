import { User, Settings, LogOut, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export function UserProfileDropdown() {
  const { open } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-all group">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarImage src="/avatar.jpg" alt="John Doe" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-sidebar-background rounded-full" />
          </div>

          {open && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Online
              </p>
            </div>
          )}

          {open && <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
