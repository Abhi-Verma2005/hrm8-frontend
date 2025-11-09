import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompanyInitials } from "@/lib/employerUtils";

interface EmployerAvatarProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function EmployerAvatar({ name, logoUrl, size = "md", className }: EmployerAvatarProps) {
  const initials = getCompanyInitials(name);
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      <AvatarImage src={logoUrl} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {logoUrl ? <Building2 className="h-1/2 w-1/2" /> : initials}
      </AvatarFallback>
    </Avatar>
  );
}
