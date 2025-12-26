import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DetailRowProps {
  label: string;
  value: string | number | ReactNode;
  icon?: LucideIcon;
  link?: boolean;
}

export function DetailRow({ label, value, icon: Icon, link }: DetailRowProps) {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[120px]">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-right">
        {link && typeof value === 'string' ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
