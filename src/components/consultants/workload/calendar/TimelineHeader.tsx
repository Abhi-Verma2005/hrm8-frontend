import { format, isToday, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimelineHeaderProps {
  days: Date[];
  dayWidth: number;
  labelWidth: number;
  currentMonth: Date;
}

export function TimelineHeader({ days, dayWidth, labelWidth, currentMonth }: TimelineHeaderProps) {
  return (
    <div className="flex bg-muted/50 border-b sticky top-0 z-10">
      {/* Consultant label column */}
      <div
        className="flex items-center justify-center font-semibold border-r bg-background"
        style={{ width: labelWidth, minWidth: labelWidth }}
      >
        Consultant
      </div>

      {/* Days */}
      <div className="flex">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col items-center justify-center py-2 border-r text-xs',
              isToday(day) && 'bg-primary/10 font-semibold',
              isWeekend(day) && 'bg-muted/70'
            )}
            style={{ width: dayWidth, minWidth: dayWidth }}
          >
            <span className="font-medium">{format(day, 'EEE')}</span>
            <span className={cn('text-muted-foreground', isToday(day) && 'text-primary')}>
              {format(day, 'd')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
