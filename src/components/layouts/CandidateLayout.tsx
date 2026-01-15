import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CandidateSidebar } from "./CandidateSidebar";
import { KeyboardShortcutsDialog } from "@/components/dialogs/KeyboardShortcutsDialog";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebarState } from "@/hooks/useSidebarState";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function CandidateLayout() {
  const { open, setOpen } = useSidebarState("candidate");
  useNavigationShortcuts();
  const { isAuthenticated, candidate } = useCandidateAuth();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <WebSocketProvider
        isAuthenticated={isAuthenticated}
        userEmail={candidate?.email}
      >
        <div className="min-h-screen flex w-full">
          <CandidateSidebar />
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
        <KeyboardShortcutsDialog />
      </WebSocketProvider>
    </SidebarProvider>
  );
}


































