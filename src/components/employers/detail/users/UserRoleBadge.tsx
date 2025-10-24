import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/employerUser";
import { Crown, Shield, UserCheck, Eye, Briefcase } from "lucide-react";

interface UserRoleBadgeProps {
  role: UserRole;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const roleConfig = {
    owner: {
      label: "Owner",
      variant: "default" as const,
      icon: Crown,
      className: "bg-gradient-to-r from-yellow-600 to-amber-600 text-white border-0",
    },
    admin: {
      label: "Admin",
      variant: "default" as const,
      icon: Shield,
      className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0",
    },
    recruiter: {
      label: "Recruiter",
      variant: "default" as const,
      icon: UserCheck,
      className: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0",
    },
    "hiring-manager": {
      label: "Hiring Manager",
      variant: "default" as const,
      icon: Briefcase,
      className: "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0",
    },
    viewer: {
      label: "Viewer",
      variant: "outline" as const,
      icon: Eye,
      className: "",
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
