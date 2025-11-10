import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarOff } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { TimeOffRequest } from '@/types/timeoff';

interface TimeOffBarProps {
  request: TimeOffRequest;
  position: { left: number; width: number };
  consultantName: string;
}

const TIME_OFF_COLORS = {
  vacation: 'bg-blue-100 border-blue-400',
  sick: 'bg-red-100 border-red-400',
  personal: 'bg-purple-100 border-purple-400',
  bereavement: 'bg-gray-100 border-gray-400',
  unpaid: 'bg-orange-100 border-orange-400',
};

export function TimeOffBar({ request, position, consultantName }: TimeOffBarProps) {
  const style = {
    left: position.left,
    width: Math.max(position.width, 40),
    top: 5,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            style={style}
            className={`absolute h-4 rounded px-1 text-xs flex items-center gap-1 border-2 ${
              TIME_OFF_COLORS[request.type] || 'bg-warning/30 border-warning'
            }`}
          >
            <CalendarOff className="h-3 w-3 flex-shrink-0" />
            <span className="truncate font-medium capitalize">{request.type}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{consultantName} - Time Off</p>
            <p className="text-xs capitalize">{request.type}</p>
            <div className="text-xs pt-1 border-t space-y-0.5">
              <p>Start: {format(parseISO(request.startDate), 'MMM d, yyyy')}</p>
              <p>End: {format(parseISO(request.endDate), 'MMM d, yyyy')}</p>
              <p>Duration: {request.totalDays} days</p>
              {request.reason && <p className="text-muted-foreground">Reason: {request.reason}</p>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
