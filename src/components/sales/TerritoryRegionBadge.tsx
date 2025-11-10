import { Badge } from '@/components/ui/badge';
import type { TerritoryRegion } from '@/types/salesTerritory';

interface TerritoryRegionBadgeProps {
  region: TerritoryRegion;
}

export function TerritoryRegionBadge({ region }: TerritoryRegionBadgeProps) {
  const config: Record<TerritoryRegion, { label: string; variant: "default" | "teal" | "purple" | "coral" | "outline" }> = {
    'north-america': { label: 'North America', variant: 'default' },
    'emea': { label: 'EMEA', variant: 'teal' },
    'apac': { label: 'APAC', variant: 'purple' },
    'latam': { label: 'LATAM', variant: 'coral' },
    'other': { label: 'Other', variant: 'outline' },
  };

  const { label, variant } = config[region];

  return <Badge variant={variant}>{label}</Badge>;
}
