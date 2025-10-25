import { Badge } from "@/components/ui/badge";
import { ContactRole } from "@/types/employerCRM";
import { cn } from "@/lib/utils";

interface ContactRoleBadgeProps {
  role: ContactRole;
}

const roleConfig: Record<ContactRole, { label: string; className: string }> = {
  'decision-maker': {
    label: 'Decision Maker',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  'technical': {
    label: 'Technical',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'billing': {
    label: 'Billing',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  'hr': {
    label: 'HR',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'recruiter': {
    label: 'Recruiter',
    className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  'other': {
    label: 'Other',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

export function ContactRoleBadge({ role }: ContactRoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}
