import { Plus, UserPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function HeaderQuickActions() {
  return (
    <>
      <Separator orientation="vertical" className="h-6 mx-2" />
      
      {/* Primary Action - Post Job */}
      <div className="hidden md:flex items-center">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              onClick={() => console.log("Post Job")}
              className={cn(
                "relative group",
                "gradient-primary",
                "shadow-md hover:shadow-lg hover:shadow-primary/25",
                "transition-all duration-300",
                "hover:scale-105",
                // Show text on large screens, icon-only on medium
                "lg:px-4 lg:gap-2",
                "md:h-9 md:w-9 md:p-0 lg:h-10 lg:w-auto"
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline font-semibold">Post Job</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Post a New Job</p>
              <p className="text-xs text-muted-foreground">⌘ + J</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-2 hidden lg:block" />
      
      {/* Secondary Quick Actions */}
      <div className="hidden md:flex items-center gap-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Add Candidate")}
              className="relative group h-9 w-9 hover:bg-primary/10 transition-all duration-300"
            >
              <UserPlus className="h-4 w-4 transition-all group-hover:scale-110 group-hover:text-primary" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
            <p className="font-medium">Add Candidate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Schedule Interview")}
              className="relative group h-9 w-9 hover:bg-primary/10 transition-all duration-300"
            >
              <Calendar className="h-4 w-4 transition-all group-hover:scale-110 group-hover:text-primary" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
            <p className="font-medium">Schedule Interview</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
