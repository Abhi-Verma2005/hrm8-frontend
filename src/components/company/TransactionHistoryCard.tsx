import { useEffect, useState } from 'react';
import { transactionService, Transaction } from '@/lib/company/transactionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

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
];

export function TransactionHistoryCard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAll();
            if (response.success && response.data?.transactions) {
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            toast.error('Failed to load transaction history');
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
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
                <DataTable
                    data={transactions}
                    columns={columns}
                    loading={loading}
                    searchable
                    searchKeys={['description', 'type']}
                    emptyMessage="No transactions found"
                />
            </CardContent>
        </Card>
    );
}
