import { useNavigate } from 'react-router-dom';
import { getCardConfig } from '@/lib/dashboard/cardConfig';
import type { CardMenuItem } from '@/lib/dashboard/cardConfig';

interface UseCardConfigResult {
  icon: React.ReactElement | null;
  variant?: 'neutral' | 'primary' | 'success' | 'warning';
  showMenu: boolean;
  menuItems?: CardMenuItem[];
}

/**
 * Hook to get centralized card configuration with navigation support
 * Use this in any component that renders EnhancedStatCard to ensure consistent styling
 */
export function useCardConfig(title: string): UseCardConfigResult {
  const navigate = useNavigate();
  const config = getCardConfig(title);

  if (!config) {
    // Return defensive defaults for missing configurations
    return {
      icon: null,
      variant: 'neutral',
      showMenu: false,
      menuItems: [],
    };
  }

  const Icon = config.icon;
  const icon = Icon ? <Icon className="h-6 w-6" /> : null;

  // Map card actions to menu items with navigation
  const menuItems = config.actions?.map(action => {
    const ActionIcon = action.icon;
    const onClick = action.path 
      ? () => navigate(action.path!) 
      : action.action || (() => {});
    
    return {
      label: action.label,
      icon: <ActionIcon className="h-4 w-4" />,
      onClick,
    };
  });

  return {
    icon,
    variant: config.variant,
    showMenu: !!menuItems && menuItems.length > 0,
    menuItems,
  };
}
