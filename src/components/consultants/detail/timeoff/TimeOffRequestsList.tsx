import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { TimeOffRequest } from "@/types/timeoff";
import { cancelTimeOffRequest } from "@/lib/timeoffStorage";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TimeOffRequestsListProps {
  requests: TimeOffRequest[];
  onRefresh: () => void;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const typeLabels: Record<string, string> = {
  vacation: 'Vacation',
  sick: 'Sick Leave',
  personal: 'Personal',
  bereavement: 'Bereavement',
  unpaid: 'Unpaid',
};

export function TimeOffRequestsList({ requests, onRefresh }: TimeOffRequestsListProps) {
  const handleCancel = (id: string) => {
    cancelTimeOffRequest(id);
    toast.success("Time off request cancelled");
    onRefresh();
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Time Off Requests</h3>
          <p className="text-sm text-muted-foreground">
            No time off requests have been submitted yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">
                    {typeLabels[request.type] || request.type}
                  </h4>
                  <Badge variant="outline" className={statusColors[request.status]}>
                    {request.status}
                  </Badge>
                  {request.isHalfDay && (
                    <Badge variant="outline">Half Day</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{request.reason}</p>
              </div>
              
              {request.status === 'pending' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Time Off Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this time off request? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, keep it</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleCancel(request.id)}>
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{format(new Date(request.startDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{format(new Date(request.endDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{request.totalDays} day{request.totalDays !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {request.coverageConsultantName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Coverage</p>
                    <p className="font-medium">{request.coverageConsultantName}</p>
                  </div>
                </div>
              )}
            </div>

            {request.status === 'approved' && request.approvedByName && (
              <div className="mt-4 pt-4 border-t text-sm">
                <p className="text-muted-foreground">
                  Approved by <span className="font-medium text-foreground">{request.approvedByName}</span>
                  {' '}on {format(new Date(request.approvedAt!), 'MMM dd, yyyy')}
                </p>
              </div>
            )}

            {request.status === 'rejected' && request.rejectedByName && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      Rejected by <span className="font-medium text-foreground">{request.rejectedByName}</span>
                      {' '}on {format(new Date(request.rejectedAt!), 'MMM dd, yyyy')}
                    </p>
                    {request.rejectionReason && (
                      <p className="text-destructive mt-1">{request.rejectionReason}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
