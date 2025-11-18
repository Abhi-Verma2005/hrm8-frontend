/**
 * Signup Requests Page
 * Admin page for managing employee signup requests
 */

import { useState, useEffect } from 'react';
import { signupRequestService, SignupRequest } from '@/lib/signupRequestService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SignupRequests() {
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SignupRequest | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSignupRequests();
  }, []);

  const loadSignupRequests = async () => {
    setIsLoading(true);
    try {
      const response = await signupRequestService.getPendingSignupRequests();
      if (response.success && response.data) {
        setSignupRequests(response.data);
      } else {
        toast({
          title: 'Failed to load signup requests',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to load signup requests',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (request: SignupRequest) => {
    setIsProcessing(true);
    try {
      const response = await signupRequestService.approveSignupRequest(request.id);
      if (response.success && response.data) {
        toast({
          title: 'Request approved',
          description: `Account created for ${response.data.user.email}`,
        });
        await loadSignupRequests();
      } else {
        toast({
          title: 'Failed to approve request',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to approve request',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const response = await signupRequestService.rejectSignupRequest(
        selectedRequest.id,
        rejectionReason || undefined
      );
      if (response.success && response.data) {
        toast({
          title: 'Request rejected',
          description: 'The signup request has been rejected',
        });
        setRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectionReason('');
        await loadSignupRequests();
      } else {
        toast({
          title: 'Failed to reject request',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to reject request',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectDialog = (request: SignupRequest) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Signup Requests</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage employee signup requests
          </p>
        </div>
        <Button onClick={loadSignupRequests} variant="outline">
          Refresh
        </Button>
      </div>

      {signupRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
            <p className="text-sm text-muted-foreground text-center">
              All signup requests have been processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {signupRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {request.email}
                    </CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Requested on {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
              {request.status === 'PENDING' && (
                <CardContent className="flex gap-2 pt-0">
                  <Button
                    onClick={() => handleApprove(request)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(request)}
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Signup Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this signup request? You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <Label>Employee</Label>
                <div className="text-sm">
                  <p className="font-medium">{selectedRequest.name}</p>
                  <p className="text-muted-foreground">{selectedRequest.email}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedRequest(null);
                setRejectionReason('');
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

