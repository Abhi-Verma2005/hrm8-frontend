import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { getConsultantDisputes, getDisputeStats } from '@/lib/commissionDisputeStorage';
import { DisputeResolutionDialog } from './DisputeResolutionDialog';
import { format } from 'date-fns';
import type { CommissionDispute } from '@/types/commissionDispute';

interface DisputeTrackingCardProps {
  consultantId: string;
}

export function DisputeTrackingCard({ consultantId }: DisputeTrackingCardProps) {
  const disputes = getConsultantDisputes(consultantId);
  const stats = getDisputeStats(consultantId);
  const [selectedDispute, setSelectedDispute] = useState<CommissionDispute | null>(null);

  const activeDisputes = disputes.filter(d => 
    d.status === 'open' || d.status === 'under-review' || d.status === 'escalated'
  );

  const getStatusVariant = (status: CommissionDispute['status']) => {
    switch (status) {
      case 'open': return 'outline';
      case 'under-review': return 'secondary';
      case 'resolved': return 'default';
      case 'rejected': return 'destructive';
      case 'escalated': return 'default';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: CommissionDispute['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Dispute Tracking
          </CardTitle>
          {activeDisputes.length > 0 && (
            <Badge variant="destructive">{activeDisputes.length} Active</Badge>
          )}
        </CardHeader>
        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-500">{stats.open + stats.underReview}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{stats.avgResolutionTime}d</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 border rounded-lg bg-muted/50 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Disputed</div>
                <div className="text-xl font-bold">${(stats.totalDisputed / 1000).toFixed(1)}K</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Approved</div>
                <div className="text-xl font-bold text-green-500">${(stats.totalResolved / 1000).toFixed(1)}K</div>
              </div>
            </div>
          </div>

          {/* Disputes List */}
          {disputes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No disputes on record</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.slice(0, 5).map(dispute => (
                <div
                  key={dispute.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{dispute.id.slice(-6)}</span>
                        <Badge variant={getStatusVariant(dispute.status)}>
                          {dispute.status.replace('-', ' ')}
                        </Badge>
                        <AlertCircle className={`h-4 w-4 ${getPriorityColor(dispute.priority)}`} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {dispute.reason}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold">${dispute.disputedAmount.toLocaleString()}</div>
                      {dispute.expectedAmount && (
                        <div className="text-xs text-muted-foreground">
                          Expected: ${dispute.expectedAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>Filed {format(new Date(dispute.filedDate), 'MMM dd, yyyy')}</span>
                      {dispute.evidence.length > 0 && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {dispute.evidence.length}
                        </span>
                      )}
                      {dispute.comments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {dispute.comments.length}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {dispute.assignedToName && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Assigned to: {dispute.assignedToName}
                    </div>
                  )}
                </div>
              ))}

              {disputes.length > 5 && (
                <Button variant="outline" className="w-full">
                  View All {disputes.length} Disputes
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDispute && (
        <DisputeResolutionDialog
          open={!!selectedDispute}
          onOpenChange={(open) => !open && setSelectedDispute(null)}
          dispute={selectedDispute}
          onResolved={() => setSelectedDispute(null)}
        />
      )}
    </>
  );
}
