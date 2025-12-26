import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Briefcase, MoreVertical, ExternalLink, Users, Search, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';
import { formatDistanceToNow } from 'date-fns';

interface ConsultantAssignmentsSectionProps {
  consultantId: string;
}

// Service type icons and colors
const serviceTypeConfig = {
  'shortlisting': {
    icon: Search,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Shortlisting'
  },
  'full-service': {
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Full-Service'
  },
  'executive-search': {
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    label: 'Executive Search'
  },
  'rpo': {
    icon: Layers,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'RPO'
  }
};

// Status colors
const statusConfig = {
  'active': { variant: 'default' as const, label: 'Active' },
  'on-hold': { variant: 'secondary' as const, label: 'On Hold' },
  'completed': { variant: 'outline' as const, label: 'Completed' },
  'cancelled': { variant: 'destructive' as const, label: 'Cancelled' }
};

// Stage colors
const stageConfig = {
  'initiated': { color: 'bg-gray-100 text-gray-700', label: 'Initiated' },
  'in-progress': { color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  'shortlisting': { color: 'bg-yellow-100 text-yellow-700', label: 'Shortlisting' },
  'interviewing': { color: 'bg-purple-100 text-purple-700', label: 'Interviewing' },
  'offer': { color: 'bg-green-100 text-green-700', label: 'Offer' },
  'completed': { color: 'bg-gray-100 text-gray-700', label: 'Completed' }
};

export function ConsultantAssignmentsSection({ consultantId }: ConsultantAssignmentsSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Get active service assignments for this consultant
  const serviceAssignments = useMemo(() => {
    const allServices = getAllServiceProjects();
    return allServices.filter(service => 
      service.status === 'active' && 
      service.consultants.some(c => c.id === consultantId)
    );
  }, [consultantId]);

  // Calculate days since assignment
  const getDaysSince = (dateString: string) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Service Assignments</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {serviceAssignments.length} Active
          </Badge>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Assign Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {serviceAssignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No active service assignments</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => setShowAddDialog(true)}
            >
              Assign First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {serviceAssignments.slice(0, 6).map((service) => {
              const serviceType = serviceTypeConfig[service.serviceType];
              const ServiceIcon = serviceType.icon;
              const status = statusConfig[service.status];
              const stage = stageConfig[service.stage];
              const consultantRole = service.consultants.find(c => c.id === consultantId)?.role || 'support';
              const daysSince = getDaysSince(service.startDate);
              
              // Calculate days until deadline
              const deadline = new Date(service.deadline);
              const today = new Date();
              const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={service.id} className="border-muted hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${serviceType.bgColor}`}>
                            <ServiceIcon className={`h-4 w-4 ${serviceType.color}`} />
                          </div>
                          <div className="flex flex-col">
                            <Badge variant="outline" className="text-xs w-fit mb-1">
                              {serviceType.label}
                            </Badge>
                            {consultantRole === 'lead' && (
                              <Badge variant="default" className="text-xs w-fit">
                                Lead
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Remove Assignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Service Name and Client */}
                      <Link to={`/services/${service.id}`} className="group block">
                        <h4 className="font-semibold mb-1 group-hover:text-primary flex items-center gap-1">
                          {service.name}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {service.clientName}
                        </p>
                      </Link>

                      {/* Status and Stage */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                        <Badge className={`text-xs ${stage.color}`}>
                          {stage.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          • {service.progress}% Complete
                        </span>
                      </div>

                      {/* Timeline Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Day {daysSince}</span>
                        <span className={daysUntilDeadline < 7 ? 'text-destructive font-medium' : ''}>
                          {daysUntilDeadline > 0 
                            ? `Due in ${daysUntilDeadline} days` 
                            : daysUntilDeadline === 0 
                              ? 'Due today'
                              : `Overdue by ${Math.abs(daysUntilDeadline)} days`
                          }
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {serviceAssignments.length > 6 && (
              <Button variant="outline" className="w-full" size="sm">
                View All {serviceAssignments.length} Assignments →
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
