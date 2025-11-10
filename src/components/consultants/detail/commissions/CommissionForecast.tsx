import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, DollarSign, AlertCircle, ChevronRight } from "lucide-react";
import { getConsultantCommissions } from "@/lib/commissionStorage";

interface CommissionForecastProps {
  consultantId: string;
}

export function CommissionForecast({ consultantId }: CommissionForecastProps) {
  const allCommissions = getConsultantCommissions(consultantId);
  
  // Calculate historical average (last 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const recentCommissions = allCommissions.filter(
    (c) => new Date(c.earnedDate) >= threeMonthsAgo && c.status === "paid"
  );
  
  const historicalMonthlyAvg = recentCommissions.length > 0
    ? recentCommissions.reduce((sum, c) => sum + c.commissionAmount, 0) / 3
    : 0;

  // Mock forecast data (in real app, would use pipeline data and ML)
  const forecast = {
    inPipeline: 28000,
    pipelineCount: 8,
    expected: 12000,
    expectedCount: 3,
    stretch: 5000,
    stretchCount: 2,
  };

  const totalForecast = forecast.inPipeline + forecast.expected + forecast.stretch;
  const confidence = 80; // Mock confidence percentage
  const trend = "+15"; // Mock trend vs last quarter

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Commission Forecast
        </CardTitle>
        <p className="text-sm text-muted-foreground">Next 90 Days</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Projected Earnings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Projected Earnings</span>
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              {confidence}% Confidence
            </Badge>
          </div>
          
          <div className="relative">
            <Progress value={confidence} className="h-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-background drop-shadow-lg">
                ${totalForecast.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">In Pipeline</div>
              <div className="font-semibold">${forecast.inPipeline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-muted-foreground">{forecast.pipelineCount} deals</div>
            </div>
            <div className="p-2 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Expected</div>
              <div className="font-semibold">${forecast.expected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-muted-foreground">{forecast.expectedCount} deals</div>
            </div>
            <div className="p-2 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Stretch</div>
              <div className="font-semibold">${forecast.stretch.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-muted-foreground">{forecast.stretchCount} deals</div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pipeline (60% prob.)</span>
            <span className="font-medium">
              ${(forecast.inPipeline * 0.6).toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expected (80% prob.)</span>
            <span className="font-medium">
              ${(forecast.expected * 0.8).toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stretch (30% prob.)</span>
            <span className="font-medium">
              ${(forecast.stretch * 0.3).toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Historical Comparison */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Historical Average</span>
            <span className="text-sm text-muted-foreground">(Last 3 Months)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                ${historicalMonthlyAvg.toLocaleString("en-US", { minimumFractionDigits: 0 })}/mo
              </span>
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              {trend}%
            </Badge>
          </div>
        </div>

        {/* Forecast Method */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Forecast Methodology</p>
              <p>
                Based on active pipeline deals, historical conversion rates, and current performance
                trends. Probabilities are weighted by deal stage and consultant success rate.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            View Pipeline
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" className="flex-1">
            Adjust Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
