import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserNav } from "./UserNav";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { HeaderQuickActions } from "./HeaderQuickActions";
import { TooltipProvider } from "@/components/ui/tooltip";

export function DashboardHeader() {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex-1 flex items-center gap-4">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          <HeaderQuickActions />

          <div className="flex items-center gap-2">
            <NotificationsDropdown />
            <UserNav />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
