import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ConsultantSidebar } from "./ConsultantSidebar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { KeyboardShortcutsDialog } from "@/components/dialogs/KeyboardShortcutsDialog";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebarState } from "@/hooks/useSidebarState";
import { ConsultantProfileCompletionDialog } from "@/components/consultants/ConsultantProfileCompletionDialog";


export function ConsultantLayout() {
  const { open, setOpen } = useSidebarState("consultant");
  useNavigationShortcuts();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="min-h-screen flex w-full">
        <ConsultantSidebar />
        <SidebarInset className="flex-1">

          <div className="min-w-0">
            <Outlet />
            <ConsultantProfileCompletionDialog />
          </div>
        </SidebarInset>
      </div>
      <CommandPalette />
      <KeyboardShortcutsDialog />
    </SidebarProvider>
  );
}





