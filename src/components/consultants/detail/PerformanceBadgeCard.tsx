import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';

interface PerformanceBadgeCardProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

export function PerformanceBadgeCard({ consultant, metrics }: PerformanceBadgeCardProps) {
  // Calculate current month performance vs target
  // Using success rate as performance indicator
  const performancePercentage = consultant.successRate * 100;
  
  const getPerformanceColor = () => {
    if (performancePercentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (performancePercentage >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
  
  const getIcon = () => {
    if (performancePercentage >= 90) return <TrendingUp className="h-4 w-4" />;
    if (performancePercentage >= 70) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <Card className={`border-2 ${getPerformanceColor()}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <p className="text-xs font-medium">Performance</p>
            <p className="text-lg font-bold">{performancePercentage.toFixed(0)}%</p>
          </div>
        </div>
        <p className="text-[10px] mt-1">Success Rate</p>
      </CardContent>
    </Card>
  );
}
