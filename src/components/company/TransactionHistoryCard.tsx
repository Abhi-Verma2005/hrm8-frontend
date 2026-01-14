import { useEffect, useState } from 'react';
import { transactionService, Transaction } from '@/lib/company/transactionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign, FileText, CreditCard, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { RefundRequestDialog } from './RefundRequestDialog';

export function TransactionHistoryCard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showRefundDialog, setShowRefundDialog] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAll();

            if (response.success && response.data?.transactions) {
                setTransactions(response.data.transactions);
            } else if (!response.success) {
                toast.error(response.error || 'Failed to load transactions');
            }
        } catch (error: any) {
            console.error('Error loading transactions:', error);
            toast.error('Failed to load transaction history');
        } finally {
            setLoading(false);
        }
    };

    const handleRefundClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowRefundDialog(true);
    };

    const handleRefundSuccess = () => {
        toast.success('Refund request submitted successfully');
        setShowRefundDialog(false);
        setSelectedTransaction(null);
        loadTransactions(); // Reload to show updated status
    };

    const handleWithdraw = async (refundId: string) => {
        try {
            const { refundRequestService } = await import('@/lib/company/refundRequestService');
            const result = await refundRequestService.withdraw(refundId);

            if (result.success) {
                toast.success('Refund withdrawn successfully');
                loadTransactions(); // Reload to show "Refunded" badge
            } else {
                toast.error(result.error || 'Failed to withdraw refund');
            }
        } catch (error: any) {
            console.error('Withdraw error:', error);
            toast.error(error.message || 'Failed to withdraw refund');
        }
    };

    const columns: Column<Transaction>[] = [
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (row) => format(new Date(row.date), 'MMM d, yyyy'),
        },
        {
            key: 'type',
            label: 'Type',
            render: (row) => (
                <Badge variant={row.type === 'JOB_PAYMENT' ? 'default' : 'secondary'}>
                    {row.type === 'JOB_PAYMENT' ? (
                        <><FileText className="w-3 h-3 mr-1" /> Job Payment</>
                    ) : (
                        <><CreditCard className="w-3 h-3 mr-1" /> Subscription</>
                    )}
                </Badge>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (row) => <span className="font-medium">{row.description}</span>,
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (row) => <span className="font-bold text-green-600">{formatCurrency(row.amount)}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {row.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => {
                if (row.refundStatus === 'PENDING') {
                    return (
                        <Button size="sm" variant="secondary" disabled className="text-xs opacity-70 cursor-not-allowed">
                            Request Pending
                        </Button>
                    );
                }
                if (row.refundStatus === 'APPROVED') {
                    return (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => row.refundId && handleWithdraw(row.refundId)}
                        >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Withdraw
                        </Button>
                    );
                }
                if (row.refundStatus === 'COMPLETED') {
                    return (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Refunded
                        </Badge>
                    );
                }
                if (row.refundStatus === 'REJECTED') {
                    return (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefundClick(row)}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Retry Refund
                        </Button>
                    );
                }

                // Default: No refund request exists
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefundClick(row)}
                        className="text-xs"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Request Refund
                    </Button>
                );
            },
        },
    ];

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Transaction History
                            </CardTitle>
                            <CardDescription>All your company payments and transactions</CardDescription>
                        </div>
                        {!loading && (
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">Loading transactions...</p>
                        </div>
                    ) : (
                        <DataTable
                            data={transactions}
                            columns={columns}
                            searchable
                            emptyMessage="No transactions found. Your payments will appear here once processed."
                        />
                    )}
                </CardContent>
            </Card>

            {selectedTransaction && (
                <RefundRequestDialog
                    isOpen={showRefundDialog}
                    onClose={() => {
                        setShowRefundDialog(false);
                        setSelectedTransaction(null);
                    }}
                    transaction={{
                        id: selectedTransaction.id,
                        type: selectedTransaction.type as 'JOB_PAYMENT' | 'SUBSCRIPTION_BILL',
                        amount: selectedTransaction.amount,
                        description: selectedTransaction.description,
                    }}
                    onSuccess={handleRefundSuccess}
                />
            )}
        </>
    );
}
