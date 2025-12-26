import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, CalendarOff, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Column } from '@/components/tables/DataTable';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { EditableCell, type SelectOption } from '@/components/tables/EditableCell';
import type { ConsultantType } from '@/types/consultant';
import { getConsultantById, updateConsultant } from '@/lib/consultantStorage';
import { useToast } from '@/hooks/use-toast';

interface ConsultantWorkloadColumnsOptions {
  onViewDetails?: (workload: WorkloadData) => void;
  onUpdate?: () => void;
}

const consultantTypeOptions: SelectOption[] = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'sales-rep', label: 'Sales Rep' },
  { value: '360-consultant', label: '360 Consultant' },
  { value: 'industry-partner', label: 'Industry Partner' },
];

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

export function createConsultantWorkloadColumns(options?: ConsultantWorkloadColumnsOptions): Column<WorkloadData>[] {
  const { onViewDetails, onUpdate } = options || {};
  const { toast } = useToast();
  
  const handleConsultantTypeUpdate = async (consultantId: string, newType: ConsultantType) => {
    try {
      const consultant = getConsultantById(consultantId);
      if (!consultant) {
        throw new Error('Consultant not found');
      }
      
      await updateConsultant(consultantId, { type: newType });
      toast({
        title: 'Consultant Updated',
        description: `Consultant type changed to ${consultantTypeOptions.find(o => o.value === newType)?.label}`,
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update consultant type',
        variant: 'destructive',
      });
    }
  };

  return [
    {
      key: 'consultantName',
      label: 'Consultant',
      sortable: true,
      render: (workload: WorkloadData) => {
        const [isEditingType, setIsEditingType] = useState(false);
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={workload.avatar} alt={workload.consultantName} />
              <AvatarFallback>{getInitials(workload.consultantName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{workload.consultantName}</div>
              <div className="text-xs">
                <EditableCell
                  value={workload.consultantType}
                  onSave={(newValue) => {
                    handleConsultantTypeUpdate(workload.consultantId, newValue as ConsultantType);
                    setIsEditingType(false);
                  }}
                  onCancel={() => setIsEditingType(false)}
                  fieldType="select"
                  selectOptions={consultantTypeOptions}
                  isEditing={isEditingType}
                  onStartEdit={() => setIsEditingType(true)}
                  renderView={(value) => (
                    <span className="text-muted-foreground capitalize">
                      {consultantTypeOptions.find(o => o.value === value)?.label || value}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (workload) => (
        <Badge variant={getStatusBadgeVariant(workload.status)}>
          {getStatusLabel(workload.status)}
        </Badge>
      ),
    },
    {
      key: 'hoursAssigned',
      label: 'Hours Assigned',
      sortable: true,
      render: (workload) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm gap-2">
            <span className="font-medium">
              {workload.hoursAssigned} / {workload.monthlyHoursAvailable}h
            </span>
            {workload.timeOffAdjustment && workload.timeOffAdjustment.scheduledDaysOff > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CalendarOff className="h-4 w-4 text-warning" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{workload.timeOffAdjustment.scheduledDaysOff} days off this month</p>
                    <p className="text-xs text-muted-foreground">
                      ({workload.timeOffAdjustment.hoursOff}h reduced capacity)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Progress value={workload.utilizationPercent} className="h-2" />
        </div>
      ),
    },
    {
      key: 'utilizationPercent',
      label: 'Utilization',
      sortable: true,
      render: (workload) => (
        <span className="text-lg font-semibold">
          {workload.utilizationPercent}%
        </span>
      ),
    },
    {
      key: 'shortlisting',
      label: 'Shortlisting',
      sortable: true,
      render: (workload) => (
        <div className="text-center">
          <span className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
            workload.serviceCountBreakdown.shortlisting > 0 
              ? "bg-chart-1 text-chart-1-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {workload.serviceCountBreakdown.shortlisting}
          </span>
        </div>
      ),
    },
    {
      key: 'full-service',
      label: 'Full Service',
      sortable: true,
      render: (workload) => (
        <div className="text-center">
          <span className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
            workload.serviceCountBreakdown['full-service'] > 0 
              ? "bg-chart-2 text-chart-2-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {workload.serviceCountBreakdown['full-service']}
          </span>
        </div>
      ),
    },
    {
      key: 'executive-search-under-100k',
      label: 'Exec. Search <$100k',
      sortable: true,
      render: (workload) => (
        <div className="text-center">
          <span className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
            workload.serviceCountBreakdown['executive-search-under-100k'] > 0 
              ? "bg-chart-3 text-chart-3-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {workload.serviceCountBreakdown['executive-search-under-100k']}
          </span>
        </div>
      ),
    },
    {
      key: 'executive-search-over-100k',
      label: 'Exec. Search >$100k',
      sortable: true,
      render: (workload) => (
        <div className="text-center">
          <span className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
            workload.serviceCountBreakdown['executive-search-over-100k'] > 0 
              ? "bg-chart-4 text-chart-4-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {workload.serviceCountBreakdown['executive-search-over-100k']}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (workload) => {
        const navigate = useNavigate();
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(workload);
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/consultants/${workload.consultantId}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
  ];
}
