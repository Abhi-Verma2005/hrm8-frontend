import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface SLAMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  status: 'met' | 'at-risk' | 'missed';
  trend: 'up' | 'down' | 'stable';
}

interface RPOSLATrackerProps {
  contractId: string;
}

export function RPOSLATracker({ contractId }: RPOSLATrackerProps) {
  // Mock data - will be replaced with real data later
  const slaMetrics: SLAMetric[] = [
    {
      name: 'Time to Submit Candidates',
      target: 48,
      current: 36,
      unit: 'hours',
      status: 'met',
      trend: 'up'
    },
    {
      name: 'Candidate Quality Score',
      target: 85,
      current: 88,
      unit: '%',
      status: 'met',
      trend: 'up'
    },
    {
      name: 'Interview-to-Offer Ratio',
      target: 30,
      current: 28,
      unit: '%',
      status: 'met',
      trend: 'stable'
    },
    {
      name: 'Monthly Placement Target',
      target: 10,
      current: 7,
      unit: 'placements',
      status: 'at-risk',
      trend: 'down'
    },
    {
      name: 'Client Response Time',
      target: 24,
      current: 18,
      unit: 'hours',
      status: 'met',
      trend: 'up'
    },
    {
      name: 'Consultant Availability',
      target: 95,
      current: 98,
      unit: '%',
      status: 'met',
      trend: 'stable'
    }
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'met') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (status === 'at-risk') return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-destructive" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'met') return <Badge variant="default" className="bg-green-600">Met</Badge>;
    if (status === 'at-risk') return <Badge variant="outline" className="text-yellow-600 border-yellow-600">At Risk</Badge>;
    return <Badge variant="destructive">Missed</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const getPerformancePercentage = (metric: SLAMetric) => {
    // For metrics where lower is better (like time)
    if (metric.name.includes('Time')) {
      return Math.min(100, (metric.target / metric.current) * 100);
    }
    // For metrics where higher is better
    return Math.min(100, (metric.current / metric.target) * 100);
  };

  const metCount = slaMetrics.filter(m => m.status === 'met').length;
  const overallCompliance = (metCount / slaMetrics.length) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SLA Compliance Overview</CardTitle>
              <CardDescription>Real-time tracking of service level agreements</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{overallCompliance.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Overall Compliance</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metCount}</div>
              <div className="text-sm text-muted-foreground">Met</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {slaMetrics.filter(m => m.status === 'at-risk').length}
              </div>
              <div className="text-sm text-muted-foreground">At Risk</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-destructive">
                {slaMetrics.filter(m => m.status === 'missed').length}
              </div>
              <div className="text-sm text-muted-foreground">Missed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {slaMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <h4 className="font-semibold">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Target: {metric.target} {metric.unit}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(metric.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {metric.current} {metric.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-muted-foreground">
                      {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>

                <div>
                  <Progress 
                    value={getPerformancePercentage(metric)} 
                    className="h-2"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Performance</span>
                    <span className="text-xs font-medium">
                      {getPerformancePercentage(metric).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
