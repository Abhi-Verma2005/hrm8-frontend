import { LucideIcon } from 'lucide-react';

interface ConsultantMetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export function ConsultantMetricCard({ icon: Icon, value, label }: ConsultantMetricCardProps) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold truncate">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
