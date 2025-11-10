import { DASHBOARD_METADATA } from "@/lib/dashboard/dashboardTypes";
import type { DashboardType } from "@/lib/dashboard/dashboardTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useDashboardFavorites } from "@/hooks/useDashboardFavorites";
import { FavoriteToggle } from "./FavoriteToggle";
import { Separator } from "@/components/ui/separator";

interface DashboardSelectorProps {
  currentDashboard: DashboardType;
}

export function DashboardSelector({ currentDashboard }: DashboardSelectorProps) {
  const navigate = useNavigate();
  const { favorites } = useDashboardFavorites();
  
  // Sort dashboards: favorites first, then the rest
  const allDashboards = Object.values(DASHBOARD_METADATA);
  const favoriteDashboards = allDashboards.filter(d => favorites.includes(d.id));
  const otherDashboards = allDashboards.filter(d => !favorites.includes(d.id));
  const showSeparator = favoriteDashboards.length > 0 && otherDashboards.length > 0;
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Favorite Dashboards */}
      {favoriteDashboards.map((dashboard) => {
        const Icon = dashboard.icon;
        const isActive = currentDashboard === dashboard.id;
        
        return (
          <div key={dashboard.id} className="relative group">
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => navigate(dashboard.defaultRoute)}
              className="pr-8"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{dashboard.name}</span>
            </Button>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FavoriteToggle dashboardType={dashboard.id} />
            </div>
          </div>
        );
      })}
      
      {/* Separator between favorites and others */}
      {showSeparator && (
        <Separator orientation="vertical" className="h-8" />
      )}
      
      {/* Other Dashboards */}
      {otherDashboards.map((dashboard) => {
        const Icon = dashboard.icon;
        const isActive = currentDashboard === dashboard.id;
        
        return (
          <div key={dashboard.id} className="relative group">
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => navigate(dashboard.defaultRoute)}
              className="pr-8"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{dashboard.name}</span>
            </Button>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FavoriteToggle dashboardType={dashboard.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
