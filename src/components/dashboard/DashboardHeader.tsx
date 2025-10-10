import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates, jobs..."
              className="pl-9 bg-muted border-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button className="bg-gradient-primary shadow-md hover:shadow-lg transition-shadow">
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>
    </header>
  );
}
