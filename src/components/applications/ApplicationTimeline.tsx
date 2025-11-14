import { Application, ApplicationStage } from "@/types/application";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ApplicationTimelineProps {
  application: Application;
}

const stageOrder: ApplicationStage[] = [
  'New Application',
  'Resume Review',
  'Phone Screen',
  'Technical Interview',
  'Manager Interview',
  'Final Round',
  'Reference Check',
  'Offer Extended',
  'Offer Accepted',
];

const rejectedStages: ApplicationStage[] = ['Rejected', 'Withdrawn'];

export function ApplicationTimeline({ application }: ApplicationTimelineProps) {
  const currentStageIndex = stageOrder.indexOf(application.stage);
  const isRejected = rejectedStages.includes(application.stage);

  const getStageStatus = (stageIndex: number): 'completed' | 'current' | 'pending' | 'rejected' => {
    if (isRejected && stageIndex === currentStageIndex) return 'rejected';
    if (stageIndex < currentStageIndex) return 'completed';
    if (stageIndex === currentStageIndex) return 'current';
    return 'pending';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'current':
        return <Clock className="h-5 w-5 text-primary animate-pulse" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Handle rejected/withdrawn cases
  const displayStages = isRejected 
    ? [...stageOrder.slice(0, currentStageIndex + 1), application.stage]
    : stageOrder;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Application Progress</h3>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
        </span>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[10px] top-3 bottom-3 w-[2px] bg-border" />

        <div className="space-y-6">
          {displayStages.map((stage, index) => {
            const status = getStageStatus(index);
            const isLast = index === displayStages.length - 1;

            return (
              <div key={stage} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background",
                  status === 'completed' && "border-primary bg-primary/10",
                  status === 'current' && "border-primary bg-background",
                  status === 'rejected' && "border-destructive bg-destructive/10",
                  status === 'pending' && "border-muted bg-background"
                )}>
                  {getStageIcon(status)}
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <p className={cn(
                    "text-sm font-medium",
                    status === 'completed' && "text-foreground",
                    status === 'current' && "text-primary",
                    status === 'rejected' && "text-destructive",
                    status === 'pending' && "text-muted-foreground"
                  )}>
                    {stage}
                  </p>
                  
                  {status === 'current' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current stage
                    </p>
                  )}
                  
                  {status === 'completed' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed
                    </p>
                  )}

                  {status === 'rejected' && application.rejectionReason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Reason: {application.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity count */}
      <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
        <span>{application.activities.length} activities</span>
        <span>•</span>
        <span>{application.notes.length} notes</span>
        {application.interviews.length > 0 && (
          <>
            <span>•</span>
            <span>{application.interviews.length} interviews</span>
          </>
        )}
      </div>
    </div>
  );
}
