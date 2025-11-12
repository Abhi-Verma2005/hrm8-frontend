import { useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendsChart } from '@/components/backgroundChecks/TrendsChart';
import { CheckTypeComparisonChart } from '@/components/backgroundChecks/CheckTypeComparisonChart';
import { RecruiterPerformanceTable } from '@/components/backgroundChecks/RecruiterPerformanceTable';
import { BottleneckAnalysis } from '@/components/backgroundChecks/BottleneckAnalysis';
import { PredictiveInsights } from '@/components/backgroundChecks/PredictiveInsights';
import {
  getTrendsData,
  getCheckTypeComparison,
  getRecruiterPerformance,
  getBottleneckInsights,
  getPredictiveMetrics
} from '@/lib/backgroundChecks/analyticsService';

export default function BackgroundChecksAnalytics() {
  const [dateRange, setDateRange] = useState(30);
  
  const trendsData = getTrendsData(dateRange);
  const checkTypeData = getCheckTypeComparison();
  const recruiterData = getRecruiterPerformance();
  const bottleneckData = getBottleneckInsights();
  const predictiveData = getPredictiveMetrics();

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <DashboardPageLayout
      title="Background Checks Analytics"
      subtitle="Comprehensive insights into verification processes and performance"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDateRange(dateRange === 30 ? 90 : 30)}>
            <Calendar className="h-4 w-4 mr-2" />
            Last {dateRange} Days
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Predictive Insights */}
        <PredictiveInsights metrics={predictiveData} />

        {/* Tabs for different analysis views */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Check Type Comparison</TabsTrigger>
            <TabsTrigger value="performance">Recruiter Performance</TabsTrigger>
            <TabsTrigger value="bottlenecks">Bottleneck Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <TrendsChart data={trendsData} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <CheckTypeComparisonChart data={checkTypeData} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <RecruiterPerformanceTable data={recruiterData} />
          </TabsContent>

          <TabsContent value="bottlenecks" className="space-y-4">
            <BottleneckAnalysis insights={bottleneckData} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
