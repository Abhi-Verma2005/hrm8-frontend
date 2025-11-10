import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllServiceProjects, updateServiceProject } from '@/lib/recruitmentServiceStorage';
import type { ServiceProject } from '@/types/recruitmentService';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';

interface BulkAssignToServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedConsultants: WorkloadData[];
  onUpdate?: () => void;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search': 'Executive Search',
  rpo: 'RPO',
};

export function BulkAssignToServiceDialog({
  open,
  onOpenChange,
  selectedConsultants,
  onUpdate,
}: BulkAssignToServiceDialogProps) {
  const { toast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const activeServices = getAllServiceProjects().filter(s => s.status === 'active');

  const handleAssign = async () => {
    if (!selectedServiceId) {
      toast({
        title: 'No Service Selected',
        description: 'Please select a service to assign consultants to',
        variant: 'destructive',
      });
      return;
    }

    setIsAssigning(true);

    try {
      const service = activeServices.find(s => s.id === selectedServiceId);
      if (!service) {
        throw new Error('Service not found');
      }

      // Get existing consultant assignments
      const existingConsultants = service.consultants || [];
      const existingIds = new Set(existingConsultants.map(c => c.id));

      // Add new consultants (only if not already assigned)
      const newConsultants = selectedConsultants
        .filter(consultant => !existingIds.has(consultant.consultantId))
        .map(consultant => ({
          id: consultant.consultantId,
          name: consultant.consultantName,
          role: 'support' as const,
          avatar: consultant.avatar,
        }));

      if (newConsultants.length === 0) {
        toast({
          title: 'Already Assigned',
          description: 'All selected consultants are already assigned to this service',
          variant: 'destructive',
        });
        setIsAssigning(false);
        return;
      }

      // Update service with new consultants
      await updateServiceProject(selectedServiceId, {
        consultants: [...existingConsultants, ...newConsultants],
      });

      toast({
        title: 'Consultants Assigned',
        description: `${newConsultants.length} consultant${newConsultants.length !== 1 ? 's' : ''} assigned to ${service.name}`,
      });

      if (onUpdate) {
        onUpdate();
      }

      onOpenChange(false);
      setSelectedServiceId('');
    } catch (error) {
      toast({
        title: 'Assignment Failed',
        description: 'Failed to assign consultants to service',
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const selectedService = activeServices.find(s => s.id === selectedServiceId);
  const wouldOverload = selectedService && selectedConsultants.some(c => 
    c.status === 'at-capacity' || c.status === 'overloaded'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Consultants to Service</DialogTitle>
          <DialogDescription>
            Assign {selectedConsultants.length} selected consultant{selectedConsultants.length !== 1 ? 's' : ''} to an active service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selected Consultants</Label>
            <div className="flex flex-wrap gap-2">
              {selectedConsultants.map((consultant) => (
                <Badge
                  key={consultant.consultantId}
                  variant={
                    consultant.status === 'overloaded' ? 'destructive' :
                    consultant.status === 'at-capacity' ? 'warning' :
                    'secondary'
                  }
                >
                  {consultant.consultantName}
                  <span className="ml-1 text-xs">({consultant.utilizationPercent}%)</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {activeServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center gap-2">
                      <span>{service.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {SERVICE_TYPE_LABELS[service.serviceType]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {wouldOverload && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Warning: Some selected consultants are at or over capacity. This assignment may overload them.
              </AlertDescription>
            </Alert>
          )}

          {selectedService && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Currently assigned: {selectedService.consultants?.length || 0} consultant{selectedService.consultants?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAssigning}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedServiceId || isAssigning}>
            {isAssigning ? 'Assigning...' : 'Assign Consultants'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
