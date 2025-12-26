import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ApprovalRequest {
  id: string;
  type: 'custom_pricing' | 'bulk_change' | 'tier_update' | 'addon_pricing';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approvedAt?: string;
  comments?: string;
  details: Record<string, any>;
}

// Mock approval requests
const mockRequests: ApprovalRequest[] = [
  {
    id: 'apr-001',
    type: 'custom_pricing',
    title: 'Custom Pricing for Acme Corp',
    description: 'Custom Enterprise tier with 20% discount for 2-year commitment',
    requestedBy: 'John Doe',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    details: {
      employer: 'Acme Corporation',
      baseTier: 'Enterprise',
      discount: '20%',
      term: '2 years',
      estimatedValue: '£96,000',
    },
  },
  {
    id: 'apr-002',
    type: 'bulk_change',
    title: 'Bulk Status Update - 15 Items',
    description: 'Archive 15 outdated add-on services',
    requestedBy: 'Jane Smith',
    requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    details: {
      action: 'Archive',
      itemCount: 15,
      entityType: 'Add-on Services',
    },
  },
  {
    id: 'apr-003',
    type: 'tier_update',
    title: 'Price Increase - Medium Tier',
    description: 'Increase Medium tier price from £499 to £549/month (10% increase)',
    requestedBy: 'Mike Johnson',
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    approver: 'Sarah Williams',
    approvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    comments: 'Approved as discussed in pricing review meeting.',
    details: {
      tier: 'Medium',
      currentPrice: '£499',
      newPrice: '£549',
      increase: '10%',
    },
  },
  {
    id: 'apr-004',
    type: 'addon_pricing',
    title: 'New Add-on Service Pricing',
    description: 'Set pricing for Video Interviewing add-on at £150/month',
    requestedBy: 'John Doe',
    requestedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: 'rejected',
    approver: 'Sarah Williams',
    approvedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    comments: 'Price point too high. Please revise to £120/month and resubmit.',
    details: {
      addon: 'Video Interviewing',
      proposedPrice: '£150',
      pricingModel: 'Monthly subscription',
    },
  },
];

export function ApprovalWorkflows() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');

  const handleAction = (request: ApprovalRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setComments('');
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    const updatedRequest: ApprovalRequest = {
      ...selectedRequest,
      status: actionType === 'approve' ? 'approved' : 'rejected',
      approver: 'Current User', // Would be actual user in real implementation
      approvedAt: new Date().toISOString(),
      comments: comments || undefined,
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r))
    );

    toast({
      title: actionType === 'approve' ? 'Request approved' : 'Request rejected',
      description: `${selectedRequest.title} has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
    });

    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setComments('');
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      custom_pricing: DollarSign,
      bulk_change: AlertCircle,
      tier_update: TrendingUp,
      addon_pricing: Package,
    };
    return icons[type] || AlertCircle;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      custom_pricing: 'bg-purple-500/10 text-purple-500',
      bulk_change: 'bg-orange-500/10 text-orange-500',
      tier_update: 'bg-blue-500/10 text-blue-500',
      addon_pricing: 'bg-green-500/10 text-green-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-600',
      approved: 'bg-green-500/10 text-green-600',
      rejected: 'bg-red-500/10 text-red-600',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  const RequestCard = ({ request }: { request: ApprovalRequest }) => {
    const TypeIcon = getTypeIcon(request.type);
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(request.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{request.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)} variant="secondary">
            <span className="flex items-center gap-1">
              {getStatusIcon(request.status)}
              {request.status}
            </span>
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(request.details).map(([key, value]) => (
            <div key={key}>
              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-sm">
          <div>
            <span className="text-muted-foreground">Requested by:</span>{' '}
            <span className="font-medium">{request.requestedBy}</span>
            <span className="text-muted-foreground ml-2">
              {format(new Date(request.requestedAt), 'PPp')}
            </span>
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleAction(request, 'approve')}
              size="sm"
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => handleAction(request, 'reject')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {(request.status === 'approved' || request.status === 'rejected') && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {request.status === 'approved' ? 'Approved' : 'Rejected'} by:
              </span>
              <span className="font-medium">{request.approver}</span>
              <span className="text-muted-foreground">
                {request.approvedAt && format(new Date(request.approvedAt), 'PPp')}
              </span>
            </div>
            {request.comments && (
              <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-muted-foreground">{request.comments}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedRequests.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Requests awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
          <CardDescription>Previously approved or rejected requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...approvedRequests, ...rejectedRequests]
              .sort((a, b) => new Date(b.approvedAt || 0).getTime() - new Date(a.approvedAt || 0).getTime())
              .map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Request
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedRequest.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments {actionType === 'reject' ? '(Required)' : '(Optional)'}</Label>
                <Textarea
                  id="comments"
                  placeholder={
                    actionType === 'approve'
                      ? 'Add any notes about this approval...'
                      : 'Please provide a reason for rejection...'
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={actionType === 'reject' && !comments.trim()}
              className={actionType === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  );
}

// Import missing icons for TypeScript
import { DollarSign, TrendingUp, Package } from 'lucide-react';
