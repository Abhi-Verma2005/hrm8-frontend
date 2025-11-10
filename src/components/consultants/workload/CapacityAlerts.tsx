import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, TrendingDown } from 'lucide-react';
import { getCapacityAlerts } from '@/lib/workloadForecastUtils';
import type { MonthlyForecast } from '@/lib/workloadForecastUtils';

interface CapacityAlertsProps {
  forecasts: MonthlyForecast[];
}

export function CapacityAlerts({ forecasts }: CapacityAlertsProps) {
  const alerts = getCapacityAlerts(forecasts);

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-chart-1" />
            No Capacity Issues Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Team capacity looks healthy for the forecasted period. Continue monitoring as new
            services are added.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4" />
          Capacity Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={getAlertVariant(alert.severity)}>
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.severity)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <AlertTitle className="text-sm font-medium mb-0">
                    {alert.month}
                  </AlertTitle>
                  <Badge
                    variant={
                      alert.severity === 'critical'
                        ? 'destructive'
                        : alert.severity === 'warning'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                {alert.consultants.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alert.consultants.map((name, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
