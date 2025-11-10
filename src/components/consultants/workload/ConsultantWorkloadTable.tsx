import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarOff, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import { createConsultantWorkloadColumns } from './ConsultantWorkloadColumns';
import { ServiceHoursEditor } from './ServiceHoursEditor';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';
import type { ServiceProject } from '@/types/recruitmentService';

interface ConsultantWorkloadTableProps {
  data: WorkloadData[];
}

// Extend WorkloadData with required 'id' field for DataTable
type WorkloadDataWithId = WorkloadData & { id: string };

const SERVICE_TYPE_LABELS = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search-under-100k': 'Exec. Search <$100k',
  'executive-search-over-100k': 'Exec. Search >$100k',
  rpo: 'RPO',
  'executive-search': 'Exec Search',
};

export function ConsultantWorkloadTable({ data }: ConsultantWorkloadTableProps) {
  const navigate = useNavigate();
  const [selectedConsultant, setSelectedConsultant] = useState<WorkloadData | null>(null);
  const [editingService, setEditingService] = useState<ServiceProject | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const columns = createConsultantWorkloadColumns({
    onViewDetails: (workload) => setSelectedConsultant(workload),
    onUpdate: () => {
      setRefreshKey(prev => prev + 1);
      // Refresh the selected consultant data
      if (selectedConsultant) {
        const updatedData = data.find(d => d.consultantId === selectedConsultant.consultantId);
        if (updatedData) {
          setSelectedConsultant(updatedData);
        }
      }
    },
  }) as any; // Type cast to handle WorkloadData vs WorkloadDataWithId
  
  const handleEditServiceHours = (serviceId: string) => {
    const allServices = getAllServiceProjects();
    const service = allServices.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
    }
  };

  // Transform data to include 'id' property required by DataTable
  const tableData: WorkloadDataWithId[] = data.map(item => ({ ...item, id: item.consultantId }));

  const statusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Busy', value: 'busy' },
    { label: 'At Capacity', value: 'at-capacity' },
    { label: 'Overloaded', value: 'overloaded' },
  ];

  const typeOptions = [
    { label: 'Shortlisting', value: 'shortlisting' },
    { label: 'Full Service', value: 'full-service' },
    { label: 'Exec. Search <$100k', value: 'executive-search-under-100k' },
    { label: 'Exec. Search >$100k', value: 'executive-search-over-100k' },
  ];

  // Custom row click handler to show details dialog
  const handleRowClick = (workload: WorkloadData) => {
    setSelectedConsultant(workload);
  };

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        searchable
        searchKeys={['consultantName'] as any}
        statusFilter
        statusOptions={statusOptions}
        statusKey={'status' as any}
        typeFilter
        typeOptions={typeOptions}
        typeKey={'consultantType' as any}
        exportable
        exportFilename="consultant-workload"
        columnCustomization
        columnPreferenceKey="consultant-workload-columns"
        emptyMessage="No consultant workload data available"
      />

      {/* Service Details Dialog */}
      <Dialog open={!!selectedConsultant} onOpenChange={() => setSelectedConsultant(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedConsultant?.consultantName} - Service Details
            </DialogTitle>
          </DialogHeader>

          {selectedConsultant && (
            <div className="space-y-4">
              {/* Time Off Section */}
              {selectedConsultant.timeOffAdjustment && (
                selectedConsultant.timeOffAdjustment.scheduledDaysOff > 0 || 
                selectedConsultant.timeOffAdjustment.upcomingTimeOff.length > 0
              ) && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <CalendarOff className="h-4 w-4" />
                    Time Off & Availability
                  </h4>
                  {selectedConsultant.timeOffAdjustment.scheduledDaysOff > 0 && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-warning">
                        {selectedConsultant.timeOffAdjustment.scheduledDaysOff} days off
                      </span>{' '}
                      scheduled this month ({selectedConsultant.timeOffAdjustment.hoursOff}h reduced capacity)
                    </p>
                  )}
                  {selectedConsultant.timeOffAdjustment.upcomingTimeOff.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Upcoming:</p>
                      {selectedConsultant.timeOffAdjustment.upcomingTimeOff.slice(0, 3).map(timeOff => (
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
                {selectedConsultant.activeServices.length > 0 ? (
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {selectedConsultant.activeServices.map((service) => (
                      <div
                        key={service.id}
                        className="group relative p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-medium flex-1">{service.name}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEditServiceHours(service.id)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {SERVICE_TYPE_LABELS[service.type as keyof typeof SERVICE_TYPE_LABELS]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{service.hours}h</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Est. completion: {new Date(service.expectedCompletion).toLocaleDateString()}
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs mt-1"
                            onClick={() => {
                              setSelectedConsultant(null);
                              navigate(`/recruitment-services/${service.id}`);
                            }}
                          >
                            View Details →
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active services assigned</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Hours Editor */}
      {editingService && (
        <ServiceHoursEditor
          service={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          onUpdate={() => {
            setRefreshKey(prev => prev + 1);
            // Refresh the selected consultant data
            if (selectedConsultant) {
              const updatedData = data.find(d => d.consultantId === selectedConsultant.consultantId);
              if (updatedData) {
                setSelectedConsultant(updatedData);
              }
            }
          }}
        />
      )}
    </>
  );
}
