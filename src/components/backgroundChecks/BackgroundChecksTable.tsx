import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, FileText, Mail, Ban, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import type { BackgroundCheck } from '@/types/backgroundCheck';

interface BackgroundChecksTableProps {
  checks: BackgroundCheck[];
  onViewDetails?: (checkId: string) => void;
  onViewConsent?: (checkId: string) => void;
  onViewReferees?: (checkId: string) => void;
  onDownloadReport?: (checkId: string) => void;
  onSendReminder?: (checkId: string) => void;
  onCancelCheck?: (checkId: string) => void;
}

export function BackgroundChecksTable({
  checks,
  onViewDetails,
  onViewConsent,
  onViewReferees,
  onDownloadReport,
  onSendReminder,
  onCancelCheck,
}: BackgroundChecksTableProps) {
  const getStatusBadge = (status: BackgroundCheck['status']) => {
    const variants: Record<BackgroundCheck['status'], any> = {
      'not-started': 'outline',
      'pending-consent': 'secondary',
      'in-progress': 'default',
      'completed': 'default',
      'issues-found': 'destructive',
      'cancelled': 'outline',
    };
    return <Badge variant={variants[status]}>{status.replace(/-/g, ' ')}</Badge>;
  };

  const getProgress = (check: BackgroundCheck): number => {
    if (check.status === 'completed') return 100;
    if (check.status === 'in-progress') return 60;
    if (check.status === 'pending-consent') return 25;
    if (check.status === 'cancelled') return 0;
    return 10;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Check Types</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Initiated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No background checks found
              </TableCell>
            </TableRow>
          ) : (
            checks.map((check) => (
              <TableRow key={check.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{check.candidateName}</p>
                    <p className="text-sm text-muted-foreground">{check.candidateId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {check.checkTypes.slice(0, 2).map((ct, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {ct.type.split('-')[0]}
                      </Badge>
                    ))}
                    {check.checkTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{check.checkTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{check.provider}</TableCell>
                <TableCell>{getStatusBadge(check.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={getProgress(check)} className="h-2 w-20" />
                    <span className="text-xs text-muted-foreground">{getProgress(check)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{check.initiatedByName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(check.initiatedDate), { addSuffix: true })}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails?.(check.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConsent?.(check.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Consent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewReferees?.(check.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Referees
                      </DropdownMenuItem>
                      {check.status === 'completed' && (
                        <DropdownMenuItem onClick={() => onDownloadReport?.(check.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                      )}
                      {check.status === 'pending-consent' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onSendReminder?.(check.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        </>
                      )}
                      {check.status !== 'completed' && check.status !== 'cancelled' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onCancelCheck?.(check.id)}
                            className="text-destructive"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel Check
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
