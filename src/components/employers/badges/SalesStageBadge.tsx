import { Badge } from "@/components/ui/badge";
import { getCRMStageColor } from "@/lib/employerModuleUtils";
import type { Employer } from "@/types/entities";

interface SalesStageBadgeProps {
  stage: Employer['crm']['salesStage'];
  className?: string;
}

export function SalesStageBadge({ stage, className }: SalesStageBadgeProps) {
  const stageLabels: Record<typeof stage, string> = {
    'lead': 'Lead',
    'prospect': 'Prospect',
    'trial': 'Trial',
    'customer': 'Customer',
    'at-risk': 'At Risk',
    'churned': 'Churned'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getCRMStageColor(stage)} ${className || ''}`}
    >
      {stageLabels[stage]}
    </Badge>
  );
}
