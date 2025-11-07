import { Badge } from "@/components/ui/badge";
import { ContactRole } from "@/types/employerCRM";

interface ContactRoleBadgeProps {
  role: ContactRole;
}

const roleConfig: Record<ContactRole, { label: string; variant: "purple" | "default" | "teal" | "coral" | "orange" | "neutral" }> = {
  'decision-maker': {
    label: 'Decision Maker',
    variant: 'purple',
  },
  'technical': {
    label: 'Technical',
    variant: 'default',
  },
  'billing': {
    label: 'Billing',
    variant: 'teal',
  },
  'hr': {
    label: 'HR',
    variant: 'coral',
  },
  'recruiter': {
    label: 'Recruiter',
    variant: 'orange',
  },
  'other': {
    label: 'Other',
    variant: 'neutral',
  },
};

export function ContactRoleBadge({ role }: ContactRoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}
