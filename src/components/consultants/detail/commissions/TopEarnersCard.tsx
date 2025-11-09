import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Award } from "lucide-react";
import type { Commission } from "@/types/commission";

interface TopEarnersCardProps {
  allCommissions: Commission[];
  limit?: number;
}

export function TopEarnersCard({ allCommissions, limit = 5 }: TopEarnersCardProps) {
  const topEarners = useMemo(() => {
    // Group commissions by consultant
    const consultantEarnings: Record<string, {
      id: string;
      name: string;
      totalEarned: number;
      totalPaid: number;
      commissionCount: number;
    }> = {};

    allCommissions.forEach(commission => {
      if (!consultantEarnings[commission.consultantId]) {
        consultantEarnings[commission.consultantId] = {
          id: commission.consultantId,
          name: commission.consultantName,
          totalEarned: 0,
          totalPaid: 0,
          commissionCount: 0,
        };
      }

      consultantEarnings[commission.consultantId].totalEarned += commission.commissionAmount;
      consultantEarnings[commission.consultantId].commissionCount += 1;
      
      if (commission.status === 'paid') {
        consultantEarnings[commission.consultantId].totalPaid += commission.commissionAmount;
      }
    });

    // Convert to array and sort by total earned
    return Object.values(consultantEarnings)
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit);
  }, [allCommissions, limit]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Award className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const totalEarnings = useMemo(() => 
    topEarners.reduce((sum, earner) => sum + earner.totalEarned, 0),
    [topEarners]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Earners
          </CardTitle>
          <Badge variant="secondary">
            ${(totalEarnings / 1000).toFixed(0)}K Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {topEarners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No commission data available
          </div>
        ) : (
          <div className="space-y-4">
            {topEarners.map((earner, index) => {
              const paymentRate = earner.totalPaid > 0 
                ? (earner.totalPaid / earner.totalEarned) * 100 
                : 0;

              return (
                <div
                  key={earner.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(earner.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{earner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {earner.commissionCount} {earner.commissionCount === 1 ? 'commission' : 'commissions'}
                    </p>
                  </div>

                  {/* Earnings */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${(earner.totalEarned / 1000).toFixed(1)}K
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${paymentRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {paymentRate.toFixed(0)}% paid
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {topEarners.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average per consultant</span>
              <span className="font-semibold">
                ${((totalEarnings / topEarners.length) / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
