import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TimeOffBalance } from "@/types/timeoff";

interface TimeOffBalanceCardsProps {
  balances: TimeOffBalance[];
}

const typeLabels: Record<string, string> = {
  vacation: 'Vacation',
  sick: 'Sick Leave',
  personal: 'Personal',
  bereavement: 'Bereavement',
  unpaid: 'Unpaid',
};

const typeColors: Record<string, string> = {
  vacation: 'bg-blue-500',
  sick: 'bg-red-500',
  personal: 'bg-purple-500',
  bereavement: 'bg-gray-500',
  unpaid: 'bg-orange-500',
};

export function TimeOffBalanceCards({ balances }: TimeOffBalanceCardsProps) {
  if (balances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No time off balances configured</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => {
        const usedPercentage = (balance.used / balance.allocated) * 100;
        const availablePercentage = (balance.available / balance.allocated) * 100;
        
        return (
          <Card key={balance.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {typeLabels[balance.type] || balance.type}
                </CardTitle>
                <div className={`h-3 w-3 rounded-full ${typeColors[balance.type] || 'bg-gray-500'}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold">{balance.available} days</span>
                </div>
                <Progress value={availablePercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-muted-foreground">Allocated</p>
                  <p className="font-semibold">{balance.allocated}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Used</p>
                  <p className="font-semibold">{balance.used}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <p className="font-semibold">{balance.pending}</p>
                </div>
              </div>
              
              {balance.carriedOver > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carried Over</span>
                    <span className="font-medium">{balance.carriedOver} days</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
