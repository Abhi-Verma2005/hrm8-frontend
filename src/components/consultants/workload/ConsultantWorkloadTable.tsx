import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, CalendarOff } from 'lucide-react';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { getCapacityBgColor } from '@/lib/consultantWorkloadUtils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ConsultantWorkloadTableProps {
  data: WorkloadData[];
}

const SERVICE_TYPE_COLORS = {
  shortlisting: 'bg-chart-1',
  'full-service': 'bg-chart-2',
  'executive-search-under-100k': 'bg-chart-3',
  'executive-search-over-100k': 'bg-chart-4',
  rpo: 'bg-chart-5',
  'executive-search': 'bg-chart-3', // fallback for activeServices display
};

const SERVICE_TYPE_LABELS = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search-under-100k': 'Exec. Search <$100k',
  'executive-search-over-100k': 'Exec. Search >$100k',
  rpo: 'RPO',
  'executive-search': 'Exec Search', // fallback for activeServices display
};

export function ConsultantWorkloadTable({ data }: ConsultantWorkloadTableProps) {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'at-capacity': return 'warning';
      case 'overloaded': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'at-capacity': return 'At Capacity';
      case 'overloaded': return 'Overloaded';
      default: return status;
    }
  };

  return (
    <Card className="overflow-hidden" data-workload-table>
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Detailed Consultant Workload</h3>
        <p className="text-sm text-muted-foreground">Click a row to view service details</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Consultant</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Hours Assigned</th>
              <th className="text-left p-4 font-medium">Utilization</th>
              <th className="text-center p-4 font-medium">Shortlisting</th>
              <th className="text-center p-4 font-medium">Full Service</th>
              <th className="text-center p-4 font-medium">Exec. Search &lt;$100k</th>
              <th className="text-center p-4 font-medium">Exec. Search &gt;$100k</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((consultant) => (
              <>
                <tr
                  key={consultant.consultantId}
                  className={cn(
                    "hover:bg-muted/50 cursor-pointer transition-colors",
                    getCapacityBgColor(consultant.utilizationPercent),
                    expandedRow === consultant.consultantId && "bg-muted/30"
                  )}
                  onClick={() => setExpandedRow(
                    expandedRow === consultant.consultantId ? null : consultant.consultantId
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={consultant.avatar} />
                        <AvatarFallback>{getInitials(consultant.consultantName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{consultant.consultantName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {consultant.consultantType.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(consultant.status)}>
                      {getStatusLabel(consultant.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{consultant.hoursAssigned} / {consultant.monthlyHoursAvailable}h</span>
                        {consultant.timeOffAdjustment && consultant.timeOffAdjustment.scheduledDaysOff > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CalendarOff className="h-4 w-4 text-warning" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{consultant.timeOffAdjustment.scheduledDaysOff} days off this month</p>
                                <p className="text-xs text-muted-foreground">
                                  ({consultant.timeOffAdjustment.hoursOff}h reduced capacity)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Progress 
                        value={consultant.utilizationPercent} 
                        className="h-2"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {consultant.utilizationPercent}%
                      </span>
                    </div>
                  </td>
                  
                  {/* Shortlisting column */}
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                      consultant.serviceCountBreakdown.shortlisting > 0 
                        ? "bg-chart-1 text-chart-1-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {consultant.serviceCountBreakdown.shortlisting}
                    </span>
                  </td>

                  {/* Full Service column */}
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                      consultant.serviceCountBreakdown['full-service'] > 0 
                        ? "bg-chart-2 text-chart-2-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {consultant.serviceCountBreakdown['full-service']}
                    </span>
                  </td>

                  {/* Exec. Search <$100k column */}
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                      consultant.serviceCountBreakdown['executive-search-under-100k'] > 0 
                        ? "bg-chart-3 text-chart-3-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {consultant.serviceCountBreakdown['executive-search-under-100k']}
                    </span>
                  </td>

                  {/* Exec. Search >$100k column */}
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                      consultant.serviceCountBreakdown['executive-search-over-100k'] > 0 
                        ? "bg-chart-4 text-chart-4-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {consultant.serviceCountBreakdown['executive-search-over-100k']}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/consultants/${consultant.consultantId}`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Expanded row with service details */}
                {expandedRow === consultant.consultantId && (
                  <tr>
                    <td colSpan={9} className="p-4 bg-muted/20">
                      <div className="space-y-4">
                        {/* Time Off Section */}
                        {consultant.timeOffAdjustment && (
                          consultant.timeOffAdjustment.scheduledDaysOff > 0 || 
                          consultant.timeOffAdjustment.upcomingTimeOff.length > 0
                        ) && (
                          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <CalendarOff className="h-4 w-4" />
                              Time Off & Availability
                            </h4>
                            {consultant.timeOffAdjustment.scheduledDaysOff > 0 && (
                              <p className="text-sm text-muted-foreground mb-2">
                                <span className="font-medium text-warning">
                                  {consultant.timeOffAdjustment.scheduledDaysOff} days off
                                </span>{' '}
                                scheduled this month ({consultant.timeOffAdjustment.hoursOff}h reduced capacity)
                              </p>
                            )}
                            {consultant.timeOffAdjustment.upcomingTimeOff.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Upcoming:</p>
                                {consultant.timeOffAdjustment.upcomingTimeOff.slice(0, 3).map(timeOff => (
                                  <div key={timeOff.id} className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {timeOff.type}
                                    </Badge>
                                    {format(new Date(timeOff.startDate), 'MMM d')} - {format(new Date(timeOff.endDate), 'MMM d')}
                                    <span className="text-muted-foreground">({timeOff.totalDays} days)</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Active Services Section */}
                        <div>
                          <p className="text-sm font-medium mb-2">Active Services:</p>
                          {consultant.activeServices.length > 0 ? (
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                              {consultant.activeServices.map((service) => (
                                <div
                                  key={service.id}
                                  className="flex items-center justify-between p-3 bg-background rounded-lg border cursor-pointer hover:bg-accent"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/recruitment-services/${service.id}`);
                                  }}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{service.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {SERVICE_TYPE_LABELS[service.type as keyof typeof SERVICE_TYPE_LABELS]}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{service.hours}h</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Est. completion: {new Date(service.expectedCompletion).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No active services assigned</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No consultant data available
        </div>
      )}
    </Card>
  );
}
