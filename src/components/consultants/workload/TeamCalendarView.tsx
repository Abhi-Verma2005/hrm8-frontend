import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, ChevronLeft, ChevronRight, CalendarOff, Briefcase } from 'lucide-react';
import { getAllConsultants } from '@/lib/consultantStorage';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';
import { getTimeOffRequests } from '@/lib/timeoffStorage';
import { DndContext, DragOverlay, closestCenter, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { ServiceAssignmentBar } from './calendar/ServiceAssignmentBar';
import { TimeOffBar } from './calendar/TimeOffBar';
import { ConsultantRow } from './calendar/ConsultantRow';
import { TimelineHeader } from './calendar/TimelineHeader';
import { updateServiceProject } from '@/lib/recruitmentServiceStorage';
import { toast } from 'sonner';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  format,
  isWithinInterval,
  parseISO
} from 'date-fns';
import type { ServiceProject } from '@/types/recruitmentService';
import type { TimeOffRequest } from '@/types/timeoff';

export function TeamCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [draggedService, setDraggedService] = useState<ServiceProject | null>(null);

  const consultants = getAllConsultants().filter(c => c.status === 'active');
  const allServices = getAllServiceProjects().filter(s => s.status === 'active');
  const allTimeOff = getTimeOffRequests({ status: 'approved' });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate timeline metrics
  const dayWidth = 40; // pixels per day
  const rowHeight = 100; // pixels per consultant row
  const labelWidth = 200; // width of consultant name column

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const handleDragStart = (event: DragStartEvent) => {
    const serviceId = event.active.id as string;
    const service = allServices.find(s => s.id === serviceId);
    if (service) {
      setDraggedService(service);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const serviceId = active.id as string;
      const newConsultantId = over.id as string;
      
      const service = allServices.find(s => s.id === serviceId);
      const newConsultant = consultants.find(c => c.id === newConsultantId);
      
      if (service && newConsultant) {
        // Update service consultants
        const updatedConsultants = service.consultants.map(c => ({
          ...c,
          id: newConsultantId,
          name: `${newConsultant.firstName} ${newConsultant.lastName}`,
          avatar: newConsultant.photo,
        }));
        
        updateServiceProject(service.id, {
          ...service,
          consultants: updatedConsultants,
        });
        
        toast.success(`Service reassigned to ${newConsultant.firstName} ${newConsultant.lastName}`);
      }
    }
    
    setDraggedService(null);
  };

  // Get services and time off for each consultant in the current month
  const getConsultantData = (consultantId: string) => {
    const services = allServices.filter(s => 
      s.consultants.some(c => c.id === consultantId) &&
      isWithinInterval(parseISO(s.startDate), { start: monthStart, end: monthEnd }) ||
      isWithinInterval(parseISO(s.deadline), { start: monthStart, end: monthEnd })
    );

    const timeOff = allTimeOff.filter(t =>
      t.consultantId === consultantId &&
      (isWithinInterval(parseISO(t.startDate), { start: monthStart, end: monthEnd }) ||
      isWithinInterval(parseISO(t.endDate), { start: monthStart, end: monthEnd }))
    );

    return { services, timeOff };
  };

  // Calculate position for a date range
  const getBarPosition = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Clamp dates to current month view
    const viewStart = start < monthStart ? monthStart : start;
    const viewEnd = end > monthEnd ? monthEnd : end;
    
    const startDayIndex = daysInMonth.findIndex(d => 
      d.getTime() >= viewStart.getTime()
    );
    const endDayIndex = daysInMonth.findIndex(d => 
      d.getTime() >= viewEnd.getTime()
    );
    
    const left = (startDayIndex >= 0 ? startDayIndex : 0) * dayWidth;
    const width = ((endDayIndex >= 0 ? endDayIndex : daysInMonth.length - 1) - (startDayIndex >= 0 ? startDayIndex : 0) + 1) * dayWidth;
    
    return { left, width };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Team Calendar View
            </CardTitle>
            <CardDescription>
              Drag services to reassign consultants • View capacity and availability
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-semibold ml-2">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto border rounded-lg">
            {/* Timeline Header */}
            <TimelineHeader
              days={daysInMonth}
              dayWidth={dayWidth}
              labelWidth={labelWidth}
              currentMonth={currentMonth}
            />

            {/* Consultant Rows */}
            <div className="relative">
              {consultants.map((consultant, index) => {
                const { services, timeOff } = getConsultantData(consultant.id);
                
                return (
                  <ConsultantRow
                    key={consultant.id}
                    consultant={consultant}
                    services={services}
                    timeOff={timeOff}
                    rowHeight={rowHeight}
                    labelWidth={labelWidth}
                    dayWidth={dayWidth}
                    daysInMonth={daysInMonth}
                    getBarPosition={getBarPosition}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 border-t text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-chart-3 rounded" />
                <span>Active Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-warning/30 rounded border-2 border-warning" />
                <span>Time Off</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>Drag services to reassign</span>
              </div>
            </div>
          </div>

          <DragOverlay>
            {draggedService ? (
              <div className="bg-chart-3 text-white px-3 py-2 rounded shadow-lg opacity-90">
                <p className="font-medium text-sm">{draggedService.name}</p>
                <p className="text-xs opacity-75">{draggedService.serviceType}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
}
