import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Hrm8Sidebar } from "./Hrm8Sidebar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { KeyboardShortcutsDialog } from "@/components/dialogs/KeyboardShortcutsDialog";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebarState } from "@/hooks/useSidebarState";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Hrm8Layout() {
  const { open, setOpen } = useSidebarState("hrm8");
  useNavigationShortcuts();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="min-h-screen flex w-full">
        <Hrm8Sidebar />
        <SidebarInset className="flex-1">
          {/* Header with notification bell */}
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </header>
          <div className="min-w-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <CommandPalette />
      <KeyboardShortcutsDialog />
    </SidebarProvider>
  );
}


































