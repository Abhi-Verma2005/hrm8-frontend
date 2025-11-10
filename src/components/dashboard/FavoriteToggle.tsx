import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DashboardType } from '@/lib/dashboard/dashboardTypes';
import { useDashboardFavorites } from '@/hooks/useDashboardFavorites';

interface FavoriteToggleProps {
  dashboardType: DashboardType;
  className?: string;
}

export function FavoriteToggle({ dashboardType, className }: FavoriteToggleProps) {
  const { isFavorite, toggleFavorite } = useDashboardFavorites();
  const favorited = isFavorite(dashboardType);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(dashboardType);
      }}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star 
        className={cn(
          "h-3.5 w-3.5 transition-colors",
          favorited && "fill-yellow-500 text-yellow-500"
        )} 
      />
    </Button>
  );
}
