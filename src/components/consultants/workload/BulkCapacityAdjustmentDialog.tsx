import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTimeOffRequest } from '@/lib/timeoffStorage';
import type { WorkloadData } from '@/lib/consultantWorkloadUtils';
import type { TimeOffType } from '@/types/timeoff';

interface BulkCapacityAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedConsultants: WorkloadData[];
  onUpdate?: () => void;
}

type AdjustmentType = 'time-off' | 'status-change';

const TIME_OFF_TYPES: { value: TimeOffType; label: string }[] = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Day' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export function BulkCapacityAdjustmentDialog({
  open,
  onOpenChange,
  selectedConsultants,
  onUpdate,
}: BulkCapacityAdjustmentDialogProps) {
  const { toast } = useToast();
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('time-off');
  const [timeOffType, setTimeOffType] = useState<TimeOffType>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (adjustmentType === 'time-off') {
      if (!startDate || !endDate) {
        toast({
          title: 'Missing Information',
          description: 'Please provide start and end dates',
          variant: 'destructive',
        });
        return;
      }

      if (new Date(endDate) < new Date(startDate)) {
        toast({
          title: 'Invalid Dates',
          description: 'End date must be after start date',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (adjustmentType === 'time-off') {
        // Create time off for each selected consultant
        const promises = selectedConsultants.map(consultant => 
          createTimeOffRequest({
            consultantId: consultant.consultantId,
            consultantName: consultant.consultantName,
            type: timeOffType,
            startDate,
            endDate,
            reason: reason || `Bulk adjustment for ${selectedConsultants.length} consultants`,
            status: 'approved', // Auto-approve bulk time off
            totalDays: Math.ceil(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
            ) + 1,
            isHalfDay: false,
            approvedBy: 'system',
            approvedByName: 'System Admin',
            approvedAt: new Date().toISOString(),
          })
        );

        await Promise.all(promises);

        toast({
          title: 'Time Off Created',
          description: `Added time off for ${selectedConsultants.length} consultant${selectedConsultants.length !== 1 ? 's' : ''}`,
        });
      }

      if (onUpdate) {
        onUpdate();
      }

      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Adjustment Failed',
        description: 'Failed to adjust consultant capacity',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAdjustmentType('time-off');
    setTimeOffType('vacation');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust Consultant Capacity</DialogTitle>
          <DialogDescription>
            Adjust capacity for {selectedConsultants.length} selected consultant{selectedConsultants.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selected Consultants</Label>
            <div className="flex flex-wrap gap-2">
              {selectedConsultants.map((consultant) => (
                <Badge key={consultant.consultantId} variant="secondary">
                  {consultant.consultantName}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Adjustment Type</Label>
            <Select value={adjustmentType} onValueChange={(value) => setAdjustmentType(value as AdjustmentType)}>
              <SelectTrigger id="adjustment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-off">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Time Off
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {adjustmentType === 'time-off' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="time-off-type">Time Off Type</Label>
                <Select value={timeOffType} onValueChange={(value) => setTimeOffType(value as TimeOffType)}>
                  <SelectTrigger id="time-off-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OFF_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a reason for this time off..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Time off will be automatically approved and will reduce available capacity for the specified period.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Apply Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
