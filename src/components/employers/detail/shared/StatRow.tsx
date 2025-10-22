import { LucideIcon } from "lucide-react";

interface StatRowProps {
  icon: LucideIcon;
  label: string;
  active: number;
  total: number;
}

export function StatRow({ icon: Icon, label, active, total }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium">
        <span className="text-primary">{active}</span>
        <span className="text-muted-foreground"> / {total}</span>
      </div>
    </div>
  );
}
