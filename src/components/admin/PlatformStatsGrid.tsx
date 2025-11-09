import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Briefcase, ClipboardList, Ticket } from 'lucide-react';
import { PlatformStats } from '@/types/platformAdmin';

interface PlatformStatsGridProps {
  stats: PlatformStats;
}

export function PlatformStatsGrid({ stats }: PlatformStatsGridProps) {
  const statCards = [
    {
      title: 'Total Employers',
      value: stats.totalEmployers,
      change: stats.employerGrowth,
      icon: Building2,
      format: 'number',
    },
    {
      title: 'Active Employers',
      value: stats.activeEmployers,
      subtitle: `${Math.round((stats.activeEmployers / stats.totalEmployers) * 100)}% active`,
      icon: Users,
      format: 'number',
    },
    {
      title: 'Monthly Recurring Revenue',
      value: stats.mrr,
      change: stats.mrrGrowth,
      icon: DollarSign,
      format: 'currency',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      change: stats.revenueGrowth,
      icon: DollarSign,
      format: 'currency',
    },
    {
      title: 'Platform Users',
      value: stats.totalUsers,
      icon: Users,
      format: 'number',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      format: 'number',
    },
    {
      title: 'Pending Services',
      value: stats.pendingServices,
      icon: ClipboardList,
      format: 'number',
      alert: stats.pendingServices > 20,
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: Ticket,
      format: 'number',
      alert: stats.openTickets > 10,
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.alert ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatValue(stat.value, stat.format)}</div>
            {stat.change !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.change > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+{stat.change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-red-600">{stat.change}%</span>
                  </>
                )}
                <span>vs last month</span>
              </p>
            )}
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
