import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignShowcase } from "@/components/DesignShowcase";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { LayoutDashboard, Palette, Trello } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<"showcase" | "dashboard" | "kanban">("showcase");

  return (
    <div className="min-h-screen">
      {/* View Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-xl border">
        <Button
          variant={activeView === "showcase" ? "gradient" : "ghost"}
          size="sm"
          onClick={() => setActiveView("showcase")}
        >
          <Palette className="h-4 w-4" />
          Design Kit
        </Button>
        <Button
          variant={activeView === "dashboard" ? "gradient" : "ghost"}
          size="sm"
          onClick={() => setActiveView("dashboard")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeView === "kanban" ? "gradient" : "ghost"}
          size="sm"
          onClick={() => setActiveView("kanban")}
        >
          <Trello className="h-4 w-4" />
          Kanban
        </Button>
      </div>

      {/* Views */}
      {activeView === "showcase" && <DesignShowcase />}
      {activeView === "dashboard" && <DashboardLayout />}
      {activeView === "kanban" && <KanbanBoard />}
    </div>
  );
};

export default Index;