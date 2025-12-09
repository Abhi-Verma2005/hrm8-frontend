import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CandidateUserNav } from "./CandidateUserNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ReactNode } from "react";

interface CandidateHeaderProps {
  breadcrumbActions?: ReactNode;
}

export function CandidateHeader({ breadcrumbActions }: CandidateHeaderProps = {}) {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-5">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />

          <div className="flex-1 flex items-center gap-4">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CandidateUserNav />
          </div>
        </div>

        {/* Breadcrumbs Row */}
        <div className="px-6 h-10 border-t bg-muted/30 flex items-center justify-between gap-4">
          <Breadcrumbs />
          {breadcrumbActions && (
            <div className="flex items-center gap-2">{breadcrumbActions}</div>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}




















