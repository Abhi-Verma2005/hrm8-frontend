import { Badge } from "@/components/ui/badge";
import { getAccountTypeColor } from "@/lib/employerUtils";
import type { Employer } from "@/types/entities";

interface AccountTypeBadgeProps {
  accountType: Employer['accountType'];
  className?: string;
}

const accountTypeLabels: Record<Employer['accountType'], string> = {
  approved: "Approved",
  payg: "PAYG",
};

export function AccountTypeBadge({ accountType, className }: AccountTypeBadgeProps) {
  return (
    <Badge variant="outline" className={`${getAccountTypeColor(accountType)} ${className || ""}`}>
      {accountTypeLabels[accountType]}
    </Badge>
  );
}
