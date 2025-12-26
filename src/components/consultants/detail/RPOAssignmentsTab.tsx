import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getConsultantRPOAssignments } from '@/lib/rpoTrackingUtils';
import { getTasksByConsultant, getTaskStats } from '@/lib/rpoTaskStorage';
import { FileText, Calendar, DollarSign, CheckSquare, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import type { Consultant } from '@/types/consultant';

interface RPOAssignmentsTabProps {
  consultant: Consultant;
}

export function RPOAssignmentsTab({ consultant }: RPOAssignmentsTabProps) {
  const assignments = useMemo(() => getConsultantRPOAssignments(consultant.id), [consultant.id]);
  const tasks = useMemo(() => getTasksByConsultant(consultant.id), [consultant.id]);
  const taskStats = useMemo(() => {
    const allTasks = tasks;
    return {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      overdue: allTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
    };
  }, [tasks]);

  const totalMonthlyRevenue = assignments.reduce((sum, contract) => {
    const consultantAssignment = contract.assignedConsultants.find(
      c => c.consultantId === consultant.id && c.isActive
    );
    return sum + (consultantAssignment?.monthlyRate || 0);
  }, 0);

  if (assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RPO Assignments</CardTitle>
          <CardDescription>This consultant is not currently assigned to any RPO contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No RPO assignments found</p>
            <Button asChild className="mt-4">
              <Link to="/rpo/consultants">View RPO Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Contracts</CardDescription>
            <CardTitle className="text-3xl">{assignments.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly Revenue</CardDescription>
            <CardTitle className="text-3xl">${totalMonthlyRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Tasks</CardDescription>
            <CardTitle className="text-3xl">{taskStats.inProgress}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Task Completion</CardDescription>
            <CardTitle className="text-3xl">
              {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Active Contracts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active RPO Contracts</CardTitle>
              <CardDescription>Current assignments and contract details</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/rpo/contracts">View All Contracts</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map(contract => {
              const consultantAssignment = contract.assignedConsultants.find(
                c => c.consultantId === consultant.id && c.isActive
              );
              
              if (!consultantAssignment) return null;

              const daysRemaining = contract.daysRemaining;
              const isExpiring = contract.isExpiring;

              return (
                <Card key={contract.id} className={isExpiring ? 'border-orange-500' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{contract.name}</h3>
                          <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                            {contract.status}
                          </Badge>
                          {isExpiring && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contract.clientName}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/recruitment-services/${contract.id}`}>View Details</Link>
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Monthly Rate</p>
                          <p className="font-semibold">${consultantAssignment.monthlyRate.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Start Date</p>
                          <p className="font-semibold">{format(new Date(consultantAssignment.startDate), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>

                      {contract.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">End Date</p>
                            <p className="font-semibold">{format(new Date(contract.endDate), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                      )}

                      {daysRemaining !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className={`h-4 w-4 ${isExpiring ? 'text-orange-500' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="text-muted-foreground text-xs">Days Remaining</p>
                            <p className={`font-semibold ${isExpiring ? 'text-orange-500' : ''}`}>
                              {daysRemaining > 0 ? daysRemaining : 'Expired'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Tasks assigned to this consultant</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/rpo/tasks">View All Tasks</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in-progress' ? 'secondary' :
                        task.status === 'blocked' ? 'destructive' : 'outline'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.contractName}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due: {format(new Date(task.dueDate), 'MMM dd')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
