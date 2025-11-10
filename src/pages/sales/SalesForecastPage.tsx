import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";
import { getOpportunityStats } from "@/lib/salesOpportunityStorage";
import { getSalesAgentStats } from "@/lib/salesAgentStorage";

export default function SalesForecastPage() {
  const opportunityStats = getOpportunityStats();
  const salesStats = getSalesAgentStats();

  const forecastedRevenue = opportunityStats.weightedPipelineValue;
  const quotaGap = salesStats.totalQuota - salesStats.totalRevenue;

  return (
    <DashboardPageLayout
      title="Sales Forecasting"
      subtitle="Revenue projections and sales forecasts"
      fullWidth={true}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Forecasted Revenue</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              ${(forecastedRevenue / 1000000).toFixed(2)}M
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on weighted pipeline
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quota Gap</h3>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">
              ${(quotaGap / 1000000).toFixed(2)}M
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Remaining to reach quota
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Forecast Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Best Case Scenario</span>
                <span className="text-green-600 font-semibold">
                  ${((forecastedRevenue * 1.3) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Assuming 30% higher win rates and deal sizes
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Most Likely</span>
                <span className="text-blue-600 font-semibold">
                  ${(forecastedRevenue / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Based on current pipeline and win rates
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Worst Case Scenario</span>
                <span className="text-orange-600 font-semibold">
                  ${((forecastedRevenue * 0.7) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Conservative estimate with lower win rates
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
