import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { WithdrawalBalance } from "@/types/withdrawal";
import { Wallet, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface BalanceCardProps {
    balance: WithdrawalBalance;
    onRequestWithdrawal: () => void;
    isLoading?: boolean;
}

export function BalanceCard({ balance, onRequestWithdrawal, isLoading }: BalanceCardProps) {
    const { formatCurrency } = useCurrencyFormat();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-success-600">{formatCurrency(balance.availableBalance)}</div>
                    <p className="text-xs text-muted-foreground pb-4">
                        Ready to withdraw
                    </p>
                    <Button
                        className="w-full"
                        size="sm"
                        onClick={onRequestWithdrawal}
                        disabled={balance.availableBalance <= 0 || isLoading}
                    >
                        Request Withdrawal
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(balance.pendingBalance)}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting confirmation
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(balance.totalEarned)}</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime commissions
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(balance.totalWithdrawn)}</div>
                    <p className="text-xs text-muted-foreground">
                        Successfully paid
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
