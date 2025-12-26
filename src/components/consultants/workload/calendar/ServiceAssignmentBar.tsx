import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GripVertical } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ServiceProject } from '@/types/recruitmentService';

interface ServiceAssignmentBarProps {
  service: ServiceProject;
  position: { left: number; width: number };
  yOffset: number;
}

const SERVICE_TYPE_COLORS = {
  shortlisting: 'bg-chart-1 border-chart-1',
  'full-service': 'bg-chart-2 border-chart-2',
  'executive-search': 'bg-chart-3 border-chart-3',
  rpo: 'bg-chart-4 border-chart-4',
};

export function ServiceAssignmentBar({ service, position, yOffset }: ServiceAssignmentBarProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: service.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: position.left,
    width: Math.max(position.width, 40),
    top: yOffset,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            className={cn(
              'absolute h-6 rounded px-2 text-white text-xs flex items-center gap-1 cursor-move border-2 transition-all',
              SERVICE_TYPE_COLORS[service.serviceType] || 'bg-chart-3 border-chart-3',
              isDragging && 'opacity-50 shadow-lg scale-105 z-50'
            )}
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-3 w-3 flex-shrink-0" />
            <span className="truncate font-medium">{service.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{service.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {service.serviceType.replace('-', ' ')}
            </p>
            <div className="text-xs pt-1 border-t space-y-0.5">
              <p>Start: {format(parseISO(service.startDate), 'MMM d, yyyy')}</p>
              <p>Deadline: {format(parseISO(service.deadline), 'MMM d, yyyy')}</p>
              <p>Progress: {service.progress}%</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
