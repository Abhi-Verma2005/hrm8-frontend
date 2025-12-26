import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MessageSquare, History, Send, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { resolveDispute, addDisputeComment, escalateDispute } from '@/lib/commissionDisputeStorage';
import { DisputeAuditTrail } from './DisputeAuditTrail';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { CommissionDispute, DisputeResolution } from '@/types/commissionDispute';

interface DisputeResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: CommissionDispute;
  onResolved?: () => void;
}

export function DisputeResolutionDialog({
  open,
  onOpenChange,
  dispute,
  onResolved,
}: DisputeResolutionDialogProps) {
  const [comment, setComment] = useState('');
  const [resolution, setResolution] = useState<DisputeResolution | ''>('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(dispute.expectedAmount?.toString() || '');
  const [isInternal, setIsInternal] = useState(false);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    addDisputeComment(
      dispute.id,
      comment,
      'current-user',
      'Current User',
      isInternal
    );

    toast({
      title: "Comment Added",
      description: "Your comment has been recorded",
    });

    setComment('');
  };

  const handleResolve = () => {
    if (!resolution || !resolutionNotes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide resolution type and notes",
        variant: "destructive",
      });
      return;
    }

    resolveDispute(
      dispute.id,
      resolution,
      resolutionNotes,
      resolution === 'approved' || resolution === 'partial-approval' 
        ? parseFloat(approvedAmount) 
        : undefined,
      'current-user',
      'Current User'
    );

    toast({
      title: "Dispute Resolved",
      description: `Dispute #${dispute.id.slice(-6)} has been ${resolution}`,
    });

    onResolved?.();
    onOpenChange(false);
  };

  const handleEscalate = () => {
    escalateDispute(
      dispute.id,
      'senior-manager',
      'Senior Manager',
      resolutionNotes,
      'current-user',
      'Current User'
    );

    toast({
      title: "Dispute Escalated",
      description: "This dispute has been escalated for review",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Dispute #{dispute.id.slice(-6)}</DialogTitle>
              <DialogDescription>
                Filed by {dispute.filedByName} on {format(new Date(dispute.filedDate), 'MMM dd, yyyy')}
              </DialogDescription>
            </div>
            <Badge variant={dispute.status === 'resolved' ? 'default' : 'destructive'}>
              {dispute.status.replace('-', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="evidence">
                Evidence ({dispute.evidence.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({dispute.comments.length})
              </TabsTrigger>
              <TabsTrigger value="audit">
                <History className="h-4 w-4 mr-2" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Dispute Summary */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-3">{dispute.reason}</h3>
                <p className="text-sm text-muted-foreground mb-4">{dispute.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Disputed Amount:</span>
                    <div className="text-lg font-bold">${dispute.disputedAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Expected Amount:</span>
                    <div className="text-lg font-bold text-green-500">
                      ${dispute.expectedAmount?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <div className="font-medium capitalize">{dispute.priority}</div>
                  </div>
                  {dispute.assignedToName && (
                    <div>
                      <span className="text-sm text-muted-foreground">Assigned To:</span>
                      <div className="font-medium">{dispute.assignedToName}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Section */}
              {dispute.status !== 'resolved' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Resolve Dispute</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select value={resolution} onValueChange={(value: DisputeResolution) => setResolution(value)}>
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="partial-approval">Partial Approval</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                        <SelectItem value="escalated">Escalate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(resolution === 'approved' || resolution === 'partial-approval') && (
                    <div className="space-y-2">
                      <Label htmlFor="approved-amount">Approved Amount ($)</Label>
                      <Input
                        id="approved-amount"
                        type="number"
                        step="0.01"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="resolution-notes">Resolution Notes</Label>
                    <Textarea
                      id="resolution-notes"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={4}
                      placeholder="Provide detailed reasoning for this resolution..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleResolve} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve Dispute
                    </Button>
                    <Button variant="outline" onClick={handleEscalate}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                  </div>
                </div>
              )}

              {/* Resolution Details */}
              {dispute.resolution && (
                <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Resolved
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="ml-2 font-medium capitalize">
                        {dispute.resolution.replace('-', ' ')}
                      </span>
                    </div>
                    {dispute.approvedAmount && (
                      <div>
                        <span className="text-muted-foreground">Approved Amount:</span>
                        <span className="ml-2 font-bold text-green-500">
                          ${dispute.approvedAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Resolved By:</span>
                      <span className="ml-2">{dispute.resolvedByName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resolved On:</span>
                      <span className="ml-2">
                        {dispute.resolvedDate && format(new Date(dispute.resolvedDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1">{dispute.resolutionNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              {dispute.evidence.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No evidence uploaded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dispute.evidence.map(evidence => (
                    <div key={evidence.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{evidence.fileName}</div>
                          {evidence.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {evidence.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            Uploaded by {evidence.uploadedBy} on{' '}
                            {format(new Date(evidence.uploadedAt), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {/* Add Comment */}
              <div className="p-4 border rounded-lg space-y-3">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    Internal note (not visible to consultant)
                  </label>
                  <Button onClick={handleAddComment} size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              {dispute.comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dispute.comments.map(comment => (
                    <div 
                      key={comment.id} 
                      className={`p-4 border rounded-lg ${
                        comment.isInternal ? 'bg-amber-500/10 border-amber-500/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{comment.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                      {comment.isInternal && (
                        <Badge variant="outline" className="mt-2">Internal</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit">
              <DisputeAuditTrail dispute={dispute} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
