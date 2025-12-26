import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Briefcase } from 'lucide-react';
import { getConsultantAssignments } from '@/lib/consultantAssignmentStorage';
import { format } from 'date-fns';
import type { Consultant } from '@/types/consultant';

interface AssignmentsTabProps {
  consultantId: string;
  consultant: Consultant;
}

export function AssignmentsTab({ consultantId, consultant }: AssignmentsTabProps) {
  const assignments = getConsultantAssignments(consultantId);
  const employerAssignments = assignments.filter(a => a.entityType === 'employer' && a.status === 'active');
  const jobAssignments = assignments.filter(a => a.entityType === 'job' && a.status === 'active');

  return (
    <div className="space-y-6">
      {/* Employer Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Employer Assignments</CardTitle>
            <Badge variant="secondary">{employerAssignments.length}</Badge>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Assign Employer
          </Button>
        </CardHeader>
        <CardContent>
          {employerAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employer assignments yet
            </div>
          ) : (
            <div className="space-y-4">
              {employerAssignments.map(assignment => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{assignment.entityName}</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.role && (
                        <Badge variant="outline" className="mr-2">{assignment.role}</Badge>
                      )}
                      {assignment.isPrimary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Since {format(new Date(assignment.assignedAt), 'MMM yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Job Assignments</CardTitle>
            <Badge variant="secondary">{jobAssignments.length}</Badge>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Assign Job
          </Button>
        </CardHeader>
        <CardContent>
          {jobAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No job assignments yet
            </div>
          ) : (
            <div className="space-y-4">
              {jobAssignments.map(assignment => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{assignment.entityName}</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.role && (
                        <Badge variant="outline" className="mr-2">{assignment.role}</Badge>
                      )}
                      {assignment.isPrimary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Since {format(new Date(assignment.assignedAt), 'MMM yyyy')}
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
