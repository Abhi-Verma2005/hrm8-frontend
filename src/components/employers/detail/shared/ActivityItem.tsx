import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: LucideIcon;
  text: string;
  time: string;
}

export function ActivityItem({ icon: Icon, text, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}
