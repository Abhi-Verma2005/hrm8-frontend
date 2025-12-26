import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/employerUser";
import { CheckCircle2, Clock, XCircle, Ban } from "lucide-react";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const statusConfig = {
    active: {
      label: "Active",
      variant: "success" as const,
      icon: CheckCircle2,
    },
    inactive: {
      label: "Inactive",
      variant: "neutral" as const,
      icon: XCircle,
    },
    invited: {
      label: "Invited",
      variant: "warning" as const,
      icon: Clock,
    },
    suspended: {
      label: "Suspended",
      variant: "destructive" as const,
      icon: Ban,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
