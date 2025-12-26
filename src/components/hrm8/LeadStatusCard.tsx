import { useState } from 'react';
import { Lead, leadService } from '@/lib/hrm8/leadService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LeadStatusCardProps {
  lead: Lead;
  onUpdate: () => void;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'NURTURING', label: 'Nurturing' },
  { value: 'LOST', label: 'Lost' },
];

const LOSS_REASONS = [
  { value: 'NOT_INTERESTED', label: 'Not Interested' },
  { value: 'BUDGET_CONSTRAINTS', label: 'Budget Constraints' },
  { value: 'COMPETITOR', label: 'Chose Competitor' },
  { value: 'NOT_A_FIT', label: 'Not a Fit' },
  { value: 'OTHER', label: 'Other' },
];

export function LeadStatusCard({ lead, onUpdate }: LeadStatusCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lossReason, setLossReason] = useState<string>('');
  const [lossNotes, setLossNotes] = useState('');

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'LOST') {
      setStatus(newStatus);
      setLostDialogOpen(true);
      return;
    }

    updateStatus(newStatus);
  };

  const updateStatus = async (newStatus: string, reason?: string, notes?: string) => {
    try {
      setLoading(true);
      const response = await leadService.updateStatus(lead.id, newStatus, reason, notes);

      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        setStatus(newStatus);
        onUpdate();
        setLostDialogOpen(false);
      } else {
        toast.error(response.error || 'Failed to update status');
        // Revert status selection on error
        setStatus(lead.status);
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
      setStatus(lead.status);
    } finally {
      setLoading(false);
    }
  };

  const confirmLostStatus = () => {
    if (!lossReason) {
      toast.error('Please select a loss reason');
      return;
    }
    updateStatus('LOST', lossReason, lossNotes);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Status</Label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={loading || lead.status === 'CONVERTED'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {lead.status === 'LOST' && lead.lossReason && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm space-y-1">
              <p className="font-semibold text-destructive">Loss Details</p>
              <p><span className="text-muted-foreground">Reason:</span> {LOSS_REASONS.find(r => r.value === lead.lossReason)?.label || lead.lossReason}</p>
              {lead.lossNotes && <p><span className="text-muted-foreground">Notes:</span> {lead.lossNotes}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Lead as Lost</DialogTitle>
            <DialogDescription>
              Please provide details on why this lead was lost.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="loss-reason">Loss Reason <span className="text-destructive">*</span></Label>
              <Select value={lossReason} onValueChange={setLossReason}>
                <SelectTrigger id="loss-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {LOSS_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loss-notes">Additional Notes</Label>
              <Textarea
                id="loss-notes"
                placeholder="Any additional context..."
                value={lossNotes}
                onChange={(e) => setLossNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLostDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button variant="destructive" onClick={confirmLostStatus} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark as Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  );
}
