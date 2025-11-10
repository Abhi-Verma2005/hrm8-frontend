import { useDroppable } from '@dnd-kit/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ServiceAssignmentBar } from './ServiceAssignmentBar';
import { TimeOffBar } from './TimeOffBar';
import { calculateConsultantWorkload } from '@/lib/consultantWorkloadUtils';
import { isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Consultant } from '@/types/consultant';
import type { ServiceProject } from '@/types/recruitmentService';
import type { TimeOffRequest } from '@/types/timeoff';

interface ConsultantRowProps {
  consultant: Consultant;
  services: ServiceProject[];
  timeOff: TimeOffRequest[];
  rowHeight: number;
  labelWidth: number;
  dayWidth: number;
  daysInMonth: Date[];
  getBarPosition: (startDate: string, endDate: string) => { left: number; width: number };
  index: number;
}

export function ConsultantRow({
  consultant,
  services,
  timeOff,
  rowHeight,
  labelWidth,
  dayWidth,
  daysInMonth,
  getBarPosition,
  index,
}: ConsultantRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: consultant.id,
  });

  const workload = calculateConsultantWorkload(consultant.id);
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'bg-destructive/10';
    if (utilization >= 86) return 'bg-warning/10';
    if (utilization >= 61) return 'bg-chart-2/10';
    return 'bg-chart-1/10';
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex border-b transition-colors',
        isOver && 'bg-primary/5 ring-2 ring-primary ring-inset',
        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
      )}
      style={{ minHeight: rowHeight }}
    >
      {/* Consultant Info Column */}
      <div
        className="flex items-center gap-3 p-3 border-r bg-background"
        style={{ width: labelWidth, minWidth: labelWidth }}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={consultant.photo} />
          <AvatarFallback>
            {getInitials(`${consultant.firstName} ${consultant.lastName}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {consultant.firstName} {consultant.lastName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {workload.utilizationPercent}%
            </Badge>
            {workload.timeOffAdjustment && workload.timeOffAdjustment.scheduledDaysOff > 0 && (
              <span className="text-xs text-warning">
                {workload.timeOffAdjustment.scheduledDaysOff}d off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Area */}
      <div className="relative flex-1" style={{ minHeight: rowHeight }}>
        {/* Weekend shading */}
        {daysInMonth.map((day, i) => (
          <div
            key={i}
            className={cn(
              'absolute top-0 bottom-0 border-r',
              isWeekend(day) && 'bg-muted/30'
            )}
            style={{
              left: i * dayWidth,
              width: dayWidth,
            }}
          />
        ))}

        {/* Time Off Bars */}
        {timeOff.map(request => {
          const position = getBarPosition(request.startDate, request.endDate);
          return (
            <TimeOffBar
              key={request.id}
              request={request}
              position={position}
              consultantName={consultant.firstName}
            />
          );
        })}

        {/* Service Assignment Bars */}
        {services.map((service, serviceIndex) => {
          const position = getBarPosition(service.startDate, service.deadline);
          return (
            <ServiceAssignmentBar
              key={service.id}
              service={service}
              position={position}
              yOffset={30 + serviceIndex * 25}
            />
          );
        })}
      </div>
    </div>
  );
}
