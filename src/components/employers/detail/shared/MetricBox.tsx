import { LucideIcon } from "lucide-react";

interface MetricBoxProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
}

export function MetricBox({ icon: Icon, label, value, sublabel }: MetricBoxProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold mb-1">{value}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}
