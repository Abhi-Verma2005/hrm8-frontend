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
              variant="gradient"
              onClick={() => console.log("Post Job")}
              className={cn(
                // Show text on large screens, icon-only on medium
                "lg:px-4 lg:gap-2",
                "md:h-10 md:w-10 md:p-0 lg:h-10 lg:w-auto"
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline font-semibold">Post Job</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="lg:hidden">
            <p>Post Job</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-2 hidden lg:block" />
      
      {/* Secondary Quick Actions */}
      <div className="hidden md:flex items-center gap-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Add Candidate")}
              className="group"
            >
              <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add Candidate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Schedule Interview")}
              className="group"
            >
              <Calendar className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Schedule Interview</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
