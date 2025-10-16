import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/types/entities";

interface CandidateStatusBadgeProps {
  status: Candidate['status'];
}

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  const variants: Record<Candidate['status'], { variant: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' | 'info', label: string }> = {
    active: { variant: 'success', label: 'Active' },
    placed: { variant: 'info', label: 'Placed' },
    inactive: { variant: 'secondary', label: 'Inactive' },
  };

  const { variant, label } = variants[status];

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}
