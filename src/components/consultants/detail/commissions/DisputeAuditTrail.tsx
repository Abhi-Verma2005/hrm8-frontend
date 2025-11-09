import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, FileText, MessageSquare, User, ArrowRight, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import type { CommissionDispute, DisputeAuditEntry } from '@/types/commissionDispute';

interface DisputeAuditTrailProps {
  dispute: CommissionDispute;
}

export function DisputeAuditTrail({ dispute }: DisputeAuditTrailProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'dispute_created': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'status_changed': return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case 'assigned': return <UserPlus className="h-5 w-5 text-purple-500" />;
      case 'evidence_added': return <FileText className="h-5 w-5 text-green-500" />;
      case 'comment_added': return <MessageSquare className="h-5 w-5 text-cyan-500" />;
      case 'dispute_resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'dispute_escalated': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <User className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'dispute_created': return 'Dispute Created';
      case 'status_changed': return 'Status Changed';
      case 'assigned': return 'Assigned';
      case 'evidence_added': return 'Evidence Added';
      case 'comment_added': return 'Comment Added';
      case 'dispute_resolved': return 'Dispute Resolved';
      case 'dispute_escalated': return 'Escalated';
      default: return action.replace('_', ' ');
    }
  };

  const renderDetails = (entry: DisputeAuditEntry) => {
    const details: JSX.Element[] = [];

    if (entry.previousValue !== undefined && entry.newValue !== undefined) {
      details.push(
        <div key="value-change" className="flex items-center gap-2 text-sm">
          <Badge variant="outline">{String(entry.previousValue)}</Badge>
          <ArrowRight className="h-3 w-3" />
          <Badge variant="default">{String(entry.newValue)}</Badge>
        </div>
      );
    }

    Object.entries(entry.details).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        details.push(
          <div key={key} className="text-sm text-muted-foreground">
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </div>
        );
      }
    });

    return details;
  };

  return (
    <div className="space-y-4">
      {dispute.auditTrail.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No audit trail entries</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[20px] top-8 bottom-8 w-0.5 bg-border" />

          <div className="space-y-6">
            {dispute.auditTrail.map((entry, index) => (
              <div key={entry.id} className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 bg-background">
                  {getActionIcon(entry.action)}
                </div>

                <Card className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{getActionLabel(entry.action)}</div>
                      <div className="text-sm text-muted-foreground">
                        by {entry.userName}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    {renderDetails(entry)}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
