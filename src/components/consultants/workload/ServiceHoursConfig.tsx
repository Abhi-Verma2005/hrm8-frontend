import { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  getServiceHoursConfig,
  updateServiceHoursConfig,
  resetServiceHoursConfig,
  type ServiceHoursConfig,
} from '@/lib/serviceHoursConfig';

interface ServiceHoursConfigProps {
  onUpdate?: () => void;
}

export function ServiceHoursConfigDialog({ onUpdate }: ServiceHoursConfigProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ServiceHoursConfig>(getServiceHoursConfig());

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setConfig(getServiceHoursConfig());
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    updateServiceHoursConfig(config);
    setOpen(false);
    onUpdate?.();
    toast({
      title: 'Settings Updated',
      description: 'Service hours configuration has been updated successfully.',
    });
  };

  const handleReset = () => {
    resetServiceHoursConfig();
    setConfig(getServiceHoursConfig());
    toast({
      title: 'Reset to Defaults',
      description: 'Service hours configuration has been reset to default values.',
    });
  };

  const updateField = (key: keyof ServiceHoursConfig, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setConfig({ ...config, [key]: numValue });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure Hours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Service Hours Configuration</DialogTitle>
          <DialogDescription>
            Configure the estimated hours required for each service type. These hours are used to
            calculate consultant workload assuming 160 hours per month and 30-day completion windows.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="shortlisting">Shortlisting Service</Label>
            <div className="flex items-center gap-2">
              <Input
                id="shortlisting"
                type="number"
                min="0"
                step="1"
                value={config.shortlisting}
                onChange={(e) => updateField('shortlisting', e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="full-service">Standard Recruitment Service</Label>
            <div className="flex items-center gap-2">
              <Input
                id="full-service"
                type="number"
                min="0"
                step="1"
                value={config['full-service']}
                onChange={(e) => updateField('full-service', e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exec-under">Executive Search (&lt;$100k)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="exec-under"
                type="number"
                min="0"
                step="1"
                value={config['executive-search-under-100k']}
                onChange={(e) => updateField('executive-search-under-100k', e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exec-over">Executive Search (≥$100k)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="exec-over"
                type="number"
                min="0"
                step="1"
                value={config['executive-search-over-100k']}
                onChange={(e) => updateField('executive-search-over-100k', e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Note about RPO Services:</p>
            <p className="text-muted-foreground">
              RPO services with dedicated consultants are tracked separately and don't count toward
              hourly workload calculations.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
