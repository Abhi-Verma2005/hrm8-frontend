import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  FileText, 
  MessageSquare, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isWithinInterval, parseISO, isBefore, isAfter } from "date-fns";
import { PerformanceGoal, PerformanceReview, Feedback360 } from "@/types/performance";
import { cn } from "@/lib/utils";

interface PerformanceEvent {
  id: string;
  type: 'goal' | 'review' | 'feedback';
  title: string;
  date: Date;
  status: string;
  priority?: string;
  description?: string;
}

interface PerformanceCalendarProps {
  goals: PerformanceGoal[];
  reviews: PerformanceReview[];
  feedback: Feedback360[];
}

export function PerformanceCalendar({ goals, reviews, feedback }: PerformanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');

  // Aggregate all events
  const events = useMemo(() => {
    const allEvents: PerformanceEvent[] = [];

    // Add goal deadlines
    goals.forEach(goal => {
      if (goal.targetDate) {
        allEvents.push({
          id: goal.id,
          type: 'goal',
          title: goal.title,
          date: parseISO(goal.targetDate),
          status: goal.status,
          priority: goal.priority,
          description: goal.description
        });
      }
    });

    // Add review dates
    reviews.forEach(review => {
      if (review.dueDate) {
        allEvents.push({
          id: review.id,
          type: 'review',
          title: `${review.templateName} - ${review.employeeName}`,
          date: parseISO(review.dueDate),
          status: review.status,
          description: `Performance review for ${review.employeeName}`
        });
      }
    });

    // Add feedback sessions
    feedback.forEach(fb => {
      if (fb.dueDate) {
        allEvents.push({
          id: fb.id,
          type: 'feedback',
          title: `360° Feedback - ${fb.employeeName}`,
          date: parseISO(fb.dueDate),
          status: fb.status,
          description: `Feedback from ${fb.providers.length} providers`
        });
      }
    });

    return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [goals, reviews, feedback]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(event.date, selectedDate));
  }, [events, selectedDate]);

  // Get upcoming events (next 30 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = addMonths(today, 1);
    return events.filter(event => 
      isWithinInterval(event.date, { start: today, end: thirtyDaysFromNow })
    );
  }, [events]);

  // Check if date has events
  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'goal': return 'default';
      case 'review': return 'secondary';
      case 'feedback': return 'outline';
      default: return 'default';
    }
  };

  // Get event icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return Target;
      case 'review': return FileText;
      case 'feedback': return MessageSquare;
      default: return CalendarIcon;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  // Check if event is overdue
  const isOverdue = (event: PerformanceEvent) => {
    return isBefore(event.date, new Date()) && 
           !['completed', 'done'].includes(event.status);
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Calendar</h2>
          <p className="text-muted-foreground">Track deadlines and important dates</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'timeline')}>
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'calendar' ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Calendar View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className={cn("rounded-md border pointer-events-auto")}
                modifiers={{
                  hasEvents: (date) => hasEvents(date)
                }}
                modifiersStyles={{
                  hasEvents: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textDecorationColor: 'hsl(var(--primary))',
                    textDecorationThickness: '2px'
                  }
                }}
              />

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Has Events</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a Date'}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {selectedDateEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No events scheduled for this date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => {
                      const Icon = getEventIcon(event.type);
                      const overdue = isOverdue(event);
                      
                      return (
                        <Card key={event.id} className={cn("relative", overdue && "border-red-300 bg-red-50/50")}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <Icon className={cn("h-5 w-5", overdue && "text-red-600")} />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-medium leading-none">{event.title}</h4>
                                  {overdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground">{event.description}</p>
                                )}
                                <div className="flex items-center gap-2">
                                  <Badge variant={getEventTypeColor(event.type)}>
                                    {event.type}
                                  </Badge>
                                  <span className={cn("text-xs font-medium", getStatusColor(event.status))}>
                                    {event.status}
                                  </span>
                                  {event.priority && (
                                    <Badge variant="outline" className="text-xs">
                                      {event.priority} priority
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Timeline View */
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 30 days of scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming events in the next 30 days
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    const overdue = isOverdue(event);
                    const showDateDivider = index === 0 || 
                      !isSameDay(event.date, upcomingEvents[index - 1].date);
                    
                    return (
                      <div key={event.id}>
                        {showDateDivider && (
                          <div className="flex items-center gap-2 mb-3 mt-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {format(event.date, 'EEEE, MMMM dd, yyyy')}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                        )}
                        
                        <Card className={cn("relative", overdue && "border-red-300 bg-red-50/50")}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <Icon className={cn("h-5 w-5", overdue && "text-red-600")} />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-medium leading-none mb-1">{event.title}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {format(event.date, 'h:mm a')}
                                    </p>
                                  </div>
                                  {overdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground">{event.description}</p>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant={getEventTypeColor(event.type)}>
                                    {event.type}
                                  </Badge>
                                  <span className={cn("text-xs font-medium", getStatusColor(event.status))}>
                                    {event.status}
                                  </span>
                                  {event.priority && (
                                    <Badge variant="outline" className="text-xs">
                                      {event.priority} priority
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Goal Deadlines</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.type === 'goal').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.type === 'goal' && isOverdue(e)).length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Review Dates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.type === 'review').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.type === 'review' && isOverdue(e)).length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feedback Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.type === 'feedback').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.type === 'feedback' && isOverdue(e)).length} overdue
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
