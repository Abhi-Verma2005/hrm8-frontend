import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, TrendingDown, Users, DollarSign, CheckCircle2, X, Settings } from 'lucide-react';
import { BusinessAlert } from '@/types/businessAlerts';
import { monitorBusinessMetrics, acknowledgeAlert, dismissAlert, getAlertStats } from '@/lib/alerts/businessAlertMonitor';
import { cn } from '@/lib/utils';

const ALERT_ICONS = {
  profit_margin_low: DollarSign,
  adoption_rate_declining: Users,
  revenue_target_missed: TrendingDown,
  client_churn_high: Users,
  cost_increase: DollarSign,
  growth_stagnant: TrendingDown,
};

const SEVERITY_STYLES = {
  critical: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900',
  warning: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900',
};

interface BusinessAlertsPanelProps {
  module?: 'assessments' | 'background-checks' | 'overall';
  showConfigButton?: boolean;
}

export function BusinessAlertsPanel({ module, showConfigButton = false }: BusinessAlertsPanelProps) {
  const [alerts, setAlerts] = useState<BusinessAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [module]);

  const loadAlerts = () => {
    const allAlerts = monitorBusinessMetrics();
    const filtered = module 
      ? allAlerts.filter(a => a.module === module && !a.acknowledged)
      : allAlerts.filter(a => !a.acknowledged);
    setAlerts(filtered.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }));
    setLoading(false);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, 'super-admin-1');
    loadAlerts();
  };

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
    loadAlerts();
  };

  const stats = getAlertStats();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Business Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Business Alerts
              {stats.unacknowledged > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.unacknowledged}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Real-time monitoring of critical business metrics
            </CardDescription>
          </div>
          {showConfigButton && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Badge variant="destructive" className="flex items-center gap-1">
            Critical: {stats.critical}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300">
            Warning: {stats.warning}
          </Badge>
          <Badge variant="outline">
            Info: {stats.info}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="font-medium text-lg mb-1">All Clear</h3>
            <p className="text-sm text-muted-foreground">
              No active alerts. All metrics are within acceptable thresholds.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-colors duration-500',
                      SEVERITY_STYLES[alert.severity]
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn(
                          'rounded-full p-2',
                          alert.severity === 'critical' && 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                          alert.severity === 'warning' && 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
                          alert.severity === 'info' && 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.module}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Current: {alert.currentValue.toFixed(1)}{alert.type.includes('margin') || alert.type.includes('rate') ? '%' : ''}</span>
                            <span>Threshold: {alert.threshold.toFixed(1)}{alert.type.includes('margin') || alert.type.includes('rate') ? '%' : ''}</span>
                            <span className="capitalize">Trend: {alert.trend}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="h-7 w-7 p-0"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(alert.id)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
