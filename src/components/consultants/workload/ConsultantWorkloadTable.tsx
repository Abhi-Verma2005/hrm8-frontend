import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, UserPlus } from 'lucide-react';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { getCapacityBgColor } from '@/lib/consultantWorkloadUtils';
import { cn } from '@/lib/utils';

interface ConsultantWorkloadTableProps {
  data: WorkloadData[];
}

const SERVICE_TYPE_COLORS = {
  shortlisting: 'bg-chart-1',
  'full-service': 'bg-chart-2',
  'executive-search': 'bg-chart-3',
  rpo: 'bg-chart-4',
};

const SERVICE_TYPE_LABELS = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search': 'Exec Search',
  rpo: 'RPO',
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
    <Card className="overflow-hidden">
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
              <th className="text-left p-4 font-medium">Jobs</th>
              <th className="text-left p-4 font-medium">Employers</th>
              <th className="text-left p-4 font-medium">Utilization</th>
              <th className="text-left p-4 font-medium">Services</th>
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
                        <span className="font-medium">{consultant.currentJobs}/{consultant.maxJobs}</span>
                      </div>
                      <Progress 
                        value={(consultant.currentJobs / consultant.maxJobs) * 100} 
                        className="h-2"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{consultant.currentEmployers}/{consultant.maxEmployers}</span>
                      </div>
                      <Progress 
                        value={(consultant.currentEmployers / consultant.maxEmployers) * 100} 
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
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(consultant.serviceBreakdown).map(([type, count]) => {
                        if (count === 0) return null;
                        const serviceType = type as keyof typeof SERVICE_TYPE_COLORS;
                        return (
                          <Badge
                            key={type}
                            variant="outline"
                            className={cn("text-xs", SERVICE_TYPE_COLORS[serviceType])}
                          >
                            {SERVICE_TYPE_LABELS[serviceType]}: {count}
                          </Badge>
                        );
                      })}
                      {consultant.activeServices.length === 0 && (
                        <span className="text-sm text-muted-foreground">No services</span>
                      )}
                    </div>
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
                    <td colSpan={7} className="p-4 bg-muted/20">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Active Services:</p>
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
                                <div>
                                  <p className="text-sm font-medium">{service.name}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {SERVICE_TYPE_LABELS[service.type as keyof typeof SERVICE_TYPE_LABELS]}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No active services assigned</p>
                        )}
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
