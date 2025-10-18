import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const widthClasses = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl lg:max-w-4xl",
  xl: "sm:max-w-3xl lg:max-w-5xl",
  full: "sm:max-w-full",
};

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = "lg",
  showCloseButton = true,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("w-full p-0 flex flex-col", widthClasses[width])}
      >
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle>{title}</SheetTitle>
                {description && (
                  <SheetDescription className="mt-1">{description}</SheetDescription>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              )}
            </div>
          </SheetHeader>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
