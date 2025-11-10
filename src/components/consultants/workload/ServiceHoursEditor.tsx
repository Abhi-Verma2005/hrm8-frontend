import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { updateServiceProject } from '@/lib/recruitmentServiceStorage';
import { getServiceHours } from '@/lib/serviceHoursConfig';
import type { ServiceProject } from '@/types/recruitmentService';

interface ServiceHoursEditorProps {
  service: ServiceProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  shortlisting: 'Shortlisting',
  'full-service': 'Full Service',
  'executive-search-under-100k': 'Exec. Search <$100k',
  'executive-search-over-100k': 'Exec. Search >$100k',
  'executive-search': 'Executive Search',
  rpo: 'RPO',
};

export function ServiceHoursEditor({ service, open, onOpenChange, onUpdate }: ServiceHoursEditorProps) {
  const { toast } = useToast();
  const currentHours = getServiceHours(service.serviceType);
  const [customHours, setCustomHours] = useState<number>(currentHours);

  const handleSave = async () => {
    try {
      // Store custom hours in service metadata
      await updateServiceProject(service.id, {
        customHours: customHours,
      });

      toast({
        title: 'Hours Updated',
        description: `Service hours updated to ${customHours}h`,
      });

      if (onUpdate) {
        onUpdate();
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update service hours',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service Hours</DialogTitle>
          <DialogDescription>
            Adjust the hours allocated for this service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{service.name}</p>
              <Badge variant="outline" className="text-xs">
                {SERVICE_TYPE_LABELS[service.serviceType] || service.serviceType}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Allocated Hours</Label>
            <div className="flex items-center gap-2">
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                value={customHours}
                onChange={(e) => setCustomHours(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Default: {currentHours}h
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
