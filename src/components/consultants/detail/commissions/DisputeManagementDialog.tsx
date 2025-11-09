import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload, X } from 'lucide-react';
import { createDispute } from '@/lib/commissionDisputeStorage';
import { getCommissionById } from '@/lib/commissionStorage';
import { toast } from '@/hooks/use-toast';
import type { DisputePriority } from '@/types/commissionDispute';

interface DisputeManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commissionId: string;
  consultantId: string;
  consultantName: string;
  onDisputeFiled?: () => void;
}

export function DisputeManagementDialog({
  open,
  onOpenChange,
  commissionId,
  consultantId,
  consultantName,
  onDisputeFiled,
}: DisputeManagementDialogProps) {
  const commission = getCommissionById(commissionId);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [expectedAmount, setExpectedAmount] = useState(commission?.commissionAmount.toString() || '');
  const [priority, setPriority] = useState<DisputePriority>('medium');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!commission) return;

    if (!reason.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both reason and description",
        variant: "destructive",
      });
      return;
    }

    const dispute = createDispute({
      commissionId,
      consultantId,
      consultantName,
      reason,
      description,
      disputedAmount: commission.commissionAmount,
      expectedAmount: parseFloat(expectedAmount),
      status: 'open',
      priority,
      filedBy: 'current-user',
      filedByName: 'Current User',
      filedDate: new Date().toISOString(),
    });

    toast({
      title: "Dispute Filed",
      description: `Dispute #${dispute.id.slice(-6)} has been created and is pending review`,
    });

    onDisputeFiled?.();
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setReason('');
    setDescription('');
    setExpectedAmount(commission?.commissionAmount.toString() || '');
    setPriority('medium');
    setFiles([]);
  };

  if (!commission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Commission Dispute</DialogTitle>
          <DialogDescription>
            Submit a dispute for commission #{commissionId.slice(-6)} - ${commission.commissionAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Commission Details */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Commission Amount:</span>
                <span className="ml-2 font-medium">${commission.commissionAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Commission Rate:</span>
                <span className="ml-2 font-medium">{commission.commissionRate}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Entity:</span>
                <span className="ml-2 font-medium">{commission.entityName || commission.entityType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 font-medium capitalize">{commission.status}</span>
              </div>
            </div>
          </div>

          {/* Dispute Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Dispute Reason *</Label>
            <Input
              id="reason"
              placeholder="e.g., Incorrect calculation, Missing bonus"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed explanation of the dispute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Expected Amount */}
          <div className="space-y-2">
            <Label htmlFor="expected-amount">Expected Amount ($)</Label>
            <Input
              id="expected-amount"
              type="number"
              step="0.01"
              value={expectedAmount}
              onChange={(e) => setExpectedAmount(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: DisputePriority) => setPriority(value)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-2">
            <Label>Supporting Evidence</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label htmlFor="evidence-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload supporting documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, PNG, JPG up to 10MB each
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="flex gap-2 p-4 border border-amber-500/50 bg-amber-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Important</p>
              <p className="text-muted-foreground mt-1">
                Filing a dispute will pause payment processing for this commission until resolved.
                Provide detailed information and evidence to expedite the review process.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            File Dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
