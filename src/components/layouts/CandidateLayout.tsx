import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CandidateSidebar } from "./CandidateSidebar";
import { KeyboardShortcutsDialog } from "@/components/dialogs/KeyboardShortcutsDialog";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebarState } from "@/hooks/useSidebarState";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";


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


































