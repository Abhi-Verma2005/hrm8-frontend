import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Briefcase } from 'lucide-react';
import { createWorkflowFromTemplate, getAllTemplates } from '@/lib/onboardingStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { ConsultantType } from '@/types/onboarding';

interface CreateOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  consultantName: string;
  onCreated?: () => void;
}

export function CreateOnboardingDialog({
  open,
  onOpenChange,
  consultantId,
  consultantName,
  onCreated,
}: CreateOnboardingDialogProps) {
  const templates = getAllTemplates();
  const [consultantType, setConsultantType] = useState<ConsultantType>('employee');
  const [templateId, setTemplateId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());

  const filteredTemplates = templates.filter(t => t.consultantType === consultantType && t.isActive);

  const handleCreate = () => {
    if (!templateId) {
      toast({
        title: "Template Required",
        description: "Please select an onboarding template",
        variant: "destructive",
      });
      return;
    }

    const workflow = createWorkflowFromTemplate(
      templateId,
      consultantId,
      consultantName,
      startDate.toISOString(),
      'current-user'
    );

    if (workflow) {
      toast({
        title: "Onboarding Created",
        description: `Onboarding workflow started for ${consultantName}`,
      });
      onCreated?.();
    } else {
      toast({
        title: "Error",
        description: "Failed to create onboarding workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Start Onboarding</DialogTitle>
          <DialogDescription>
            Create a new onboarding workflow for {consultantName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Consultant Type */}
          <div className="space-y-3">
            <Label>Consultant Type</Label>
            <RadioGroup
              value={consultantType}
              onValueChange={(value: ConsultantType) => {
                setConsultantType(value);
                setTemplateId('');
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <label
                  htmlFor="employee"
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    consultantType === 'employee' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="employee" id="employee" />
                  <div className="flex items-center gap-3 flex-1">
                    <Users className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Full-Time Employee</div>
                      <div className="text-sm text-muted-foreground">
                        Direct hire with benefits
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="contractor"
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    consultantType === 'contractor' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="contractor" id="contractor" />
                  <div className="flex items-center gap-3 flex-1">
                    <Briefcase className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Contractor</div>
                      <div className="text-sm text-muted-foreground">
                        Independent contractor
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Onboarding Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                {filteredTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.defaultDuration} days • {template.checklistItems.length} tasks
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {templateId && (
              <p className="text-sm text-muted-foreground">
                {filteredTemplates.find(t => t.id === templateId)?.description}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preview */}
          {templateId && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">What's Included:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Checklist Items</div>
                  <div className="text-lg font-bold">
                    {filteredTemplates.find(t => t.id === templateId)?.checklistItems.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Documents</div>
                  <div className="text-lg font-bold">
                    {filteredTemplates.find(t => t.id === templateId)?.documents.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Training Modules</div>
                  <div className="text-lg font-bold">
                    {filteredTemplates.find(t => t.id === templateId)?.training.length || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!templateId}>
            Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
