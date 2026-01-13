/**
 * RefundRequestsCard
 * Displays refund request status for employers
 */

import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { format } from 'date-fns';
import { refundRequestService, RefundRequest } from '../../lib/company/refundRequestService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';

export const RefundRequestsCard: React.FC = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRefundRequests = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await refundRequestService.getAll();
            if (result.success && result.data) {
                setRefundRequests(result.data.refundRequests);
            } else {
                setError(result.error || 'Failed to load refund requests');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load refund requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRefundRequests();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this refund request?')) {
            return;
        }

        try {
            const result = await refundRequestService.cancel(id);
            if (result.success) {
                loadRefundRequests();
            } else {
                alert(result.error || 'Failed to cancel refund request');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to cancel refund request');
        }
    };

    const getStatusBadge = (status: RefundRequest['status']) => {
        const variants: Record<typeof status, 'default' | 'success' | 'warning' | 'destructive'> = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'destructive',
            COMPLETED: 'success',
            CANCELLED: 'default',
        };

        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const columns = [
        {
            key: 'createdAt',
            label: 'Date',
            render: (request: RefundRequest) => format(new Date(request.createdAt), 'MMM dd, yyyy'),
        },
        {
            key: 'transactionType',
            label: 'Type',
            render: (request: RefundRequest) =>
                request.transactionType === 'JOB_PAYMENT' ? 'Job Payment' : 'Subscription Bill',
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (request: RefundRequest) => `$${request.amount.toFixed(2)}`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (request: RefundRequest) => getStatusBadge(request.status),
        },
        {
            key: 'reason',
            label: 'Reason',
            render: (request: RefundRequest) => (
                <div className="max-w-xs truncate" title={request.reason}>
                    {request.reason}
                </div>
            ),
        },
        {
            key: 'adminNotes',
            label: 'Admin Response',
            render: (request: RefundRequest) => (
                <div className="max-w-xs">
                    {request.rejectionReason && (
                        <span className="text-red-600 text-sm">{request.rejectionReason}</span>
                    )}
                    {request.adminNotes && (
                        <span className="text-gray-600 text-sm">{request.adminNotes}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (request: RefundRequest) =>
                request.status === 'PENDING' ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                    >
                        <X size={14} className="mr-1" />
                        Cancel
                    </Button>
                ) : null,
        },
    ];

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Refund Requests</h2>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={loadRefundRequests}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading refund requests...</div>
            ) : refundRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No refund requests found
                </div>
            ) : (
                <DataTable
                    data={refundRequests}
                    columns={columns}
                    searchable
                />
            )}
        </Card>
    );
};
