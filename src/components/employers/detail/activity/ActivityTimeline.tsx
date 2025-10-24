import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Briefcase, Building2, CreditCard, DollarSign, 
  FileText, Mail, Phone, User, UserPlus 
} from "lucide-react";
import { getEmployerActivities } from "@/lib/employerCRMStorage";
import { EmployerActivity, ActivityType } from "@/types/employerCRM";
import { formatDistanceToNow } from "date-fns";

const activityIcons: Record<ActivityType, any> = {
  'account-created': Building2,
  'account-updated': Building2,
  'contact-added': UserPlus,
  'contact-updated': User,
  'contact-removed': User,
  'job-posted': Briefcase,
  'subscription-changed': CreditCard,
  'subscription-upgraded': CreditCard,
  'subscription-downgraded': CreditCard,
  'invoice-sent': FileText,
  'invoice-paid': DollarSign,
  'invoice-overdue': FileText,
  'note-added': FileText,
  'call-logged': Phone,
  'meeting-scheduled': Mail,
  'email-sent': Mail,
  'document-uploaded': FileText,
  'status-changed': Building2,
};

interface ActivityTimelineProps {
  employerId: string;
}

export function ActivityTimeline({ employerId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<EmployerActivity[]>([]);

  useEffect(() => {
    setActivities(getEmployerActivities(employerId));
  }, [employerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activities yet
              </div>
            ) : (
              activities.map((activity, index) => {
                const Icon = activityIcons[activity.type] || FileText;
                const isLast = index === activities.length - 1;
                
                return (
                  <div key={activity.id} className="relative pl-6 pb-4">
                    {!isLast && (
                      <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-border" />
                    )}
                    
                    <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <Icon className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {activity.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {activity.userName && (
                        <p className="text-xs text-muted-foreground">
                          by {activity.userName}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
