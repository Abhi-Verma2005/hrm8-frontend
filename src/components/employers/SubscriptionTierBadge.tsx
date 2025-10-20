import { Badge } from "@/components/ui/badge";
import { getSubscriptionTierColor } from "@/lib/employerUtils";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscriptionConfig";

interface SubscriptionTierBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

export function SubscriptionTierBadge({ tier, className }: SubscriptionTierBadgeProps) {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  
  return (
    <Badge variant="outline" className={`${getSubscriptionTierColor(tier)} ${className || ""}`}>
      {tierConfig.name}
    </Badge>
  );
}
