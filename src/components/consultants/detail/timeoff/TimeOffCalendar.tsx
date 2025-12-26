import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { getTimeOffCalendarEvents } from "@/lib/timeoffStorage";
import { format, isSameDay } from "date-fns";
import type { TimeOffCalendarEvent } from "@/types/timeoff";

interface TimeOffCalendarProps {
  consultantId: string;
}

const typeColors: Record<string, string> = {
  vacation: 'bg-blue-500',
  sick: 'bg-red-500',
  personal: 'bg-purple-500',
  bereavement: 'bg-gray-500',
  unpaid: 'bg-orange-500',
};

export function TimeOffCalendar({ consultantId }: TimeOffCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const events = useMemo(() => getTimeOffCalendarEvents(), []);

  const consultantEvents = events.filter(e => 
    e.consultantId === consultantId || e.isBlockout
  );

  const eventsForDate = selectedDate
    ? consultantEvents.filter(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return selectedDate >= start && selectedDate <= end;
      })
    : [];

  const modifiers = {
    timeOff: consultantEvents.flatMap(event => {
      const dates: Date[] = [];
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
      
      return dates;
    }),
  };

  const modifiersStyles = {
    timeOff: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border pointer-events-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsForDate.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No time off scheduled for this date
            </p>
          ) : (
            <div className="space-y-4">
              {eventsForDate.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          event.isBlockout ? 'bg-destructive' : typeColors[event.type]
                        }`}
                      />
                      <h4 className="font-semibold">{event.consultantName}</h4>
                    </div>
                    <Badge variant="outline">
                      {event.isBlockout ? 'Blockout' : event.type}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      {format(new Date(event.startDate), 'MMM dd')} - {format(new Date(event.endDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-muted-foreground">
                      Duration: {event.totalDays} day{event.totalDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
