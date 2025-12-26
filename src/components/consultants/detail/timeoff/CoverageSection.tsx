import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { getCoverageAssignments, updateCoverageAssignment } from "@/lib/timeoffStorage";
import { toast } from "sonner";
import type { CoverageAssignment } from "@/types/timeoff";

interface CoverageSectionProps {
  consultantId: string;
  consultantName: string;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
  declined: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function CoverageSection({ consultantId, consultantName }: CoverageSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Get coverage assignments where this consultant is providing coverage
  const providingCoverage = useMemo(() => 
    getCoverageAssignments({ coveringConsultantId: consultantId }),
    [consultantId, refreshKey]
  );

  // Get coverage assignments where this consultant needs coverage
  const needingCoverage = useMemo(() => 
    getCoverageAssignments({ consultantId }),
    [consultantId, refreshKey]
  );

  const handleAccept = (id: string) => {
    updateCoverageAssignment(id, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
    toast.success("Coverage request accepted");
    setRefreshKey(prev => prev + 1);
  };

  const handleDecline = (id: string) => {
    updateCoverageAssignment(id, {
      status: 'declined',
      declinedAt: new Date().toISOString(),
      declineReason: "Unable to provide coverage",
    });
    toast.success("Coverage request declined");
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Coverage Requests for Me */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Coverage Requests for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {providingCoverage.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No coverage requests assigned to you
            </p>
          ) : (
            <div className="space-y-4">
              {providingCoverage.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{assignment.consultantName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Needs coverage
                      </p>
                    </div>
                    <Badge variant="outline" className={statusColors[assignment.status]}>
                      {assignment.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(new Date(assignment.startDate), 'MMM dd')} -{' '}
                      {format(new Date(assignment.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {assignment.tasks.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Tasks:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {assignment.tasks.map((task, index) => (
                          <li key={index}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {assignment.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                    </div>
                  )}

                  {assignment.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(assignment.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(assignment.id)}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {assignment.status === 'accepted' && assignment.acceptedAt && (
                    <div className="pt-2 border-t text-sm text-muted-foreground">
                      Accepted on {format(new Date(assignment.acceptedAt), 'MMM dd, yyyy')}
                    </div>
                  )}

                  {assignment.status === 'declined' && (
                    <div className="pt-2 border-t text-sm text-destructive">
                      Declined: {assignment.declineReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Coverage Arrangements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Coverage Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {needingCoverage.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No coverage arrangements set up
            </p>
          ) : (
            <div className="space-y-4">
              {needingCoverage.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{assignment.coveringConsultantName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Covering for you
                      </p>
                    </div>
                    <Badge variant="outline" className={statusColors[assignment.status]}>
                      {assignment.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(new Date(assignment.startDate), 'MMM dd')} -{' '}
                      {format(new Date(assignment.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {assignment.tasks.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Tasks:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {assignment.tasks.map((task, index) => (
                          <li key={index}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {assignment.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
