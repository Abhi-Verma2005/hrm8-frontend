import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Phone, Users, MapPin, Calendar, Clock, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Interview } from '@/types/interview';

interface InterviewListProps {
  interviews: Interview[];
  onInterviewClick: (interview: Interview) => void;
  onScheduleClick: () => void;
}

export function InterviewList({ interviews, onInterviewClick, onScheduleClick }: InterviewListProps) {
  const getInterviewTypeIcon = (type: Interview['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'panel':
        return <Users className="h-4 w-4" />;
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Interview['status']) => {
    const variants: Record<Interview['status'], { variant: any; label: string }> = {
      scheduled: { variant: 'default', label: 'Scheduled' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      'no-show': { variant: 'destructive', label: 'No Show' }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (interviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
        <p className="text-muted-foreground mb-4">Schedule your first interview to get started</p>
        <Button onClick={onScheduleClick}>Schedule Interview</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map(interview => (
        <Card
          key={interview.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onInterviewClick(interview)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getInterviewTypeIcon(interview.type)}
              </div>
              <div>
                <h3 className="font-semibold">{interview.candidateName}</h3>
                <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
              </div>
            </div>
            {getStatusBadge(interview.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(parseISO(interview.scheduledDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{interview.scheduledTime} ({interview.duration} min)</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Interviewers:</span>
              <div className="flex gap-2">
                {interview.interviewers.map(interviewer => (
                  <Badge key={interviewer.userId} variant="outline" className="text-xs">
                    {interviewer.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
