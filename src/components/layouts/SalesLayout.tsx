import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SalesSidebar } from "./SalesSidebar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { KeyboardShortcutsDialog } from "@/components/dialogs/KeyboardShortcutsDialog";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebarState } from "@/hooks/useSidebarState";
import { ConsultantUserNav } from "./ConsultantUserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function SalesLayout() {
  const { open, setOpen } = useSidebarState("sales");
  useNavigationShortcuts();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="min-h-screen flex w-full">
        <SalesSidebar />
        <SidebarInset className="flex-1">
          {/* Global Navbar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
              <NotificationBell />
              <ConsultantUserNav />
            </div>
          </header>

          {/* Main Content */}
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
