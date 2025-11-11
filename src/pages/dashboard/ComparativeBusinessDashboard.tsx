import { useState, useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { DashboardActionBar } from '@/components/dashboard/DashboardActionBar';
import { ActiveFiltersIndicator } from '@/components/dashboard/ActiveFiltersIndicator';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { ModuleComparisonChart } from '@/components/dashboard/charts/ModuleComparisonChart';
import { GrowthComparisonChart } from '@/components/dashboard/charts/GrowthComparisonChart';
import { ROIComparisonChart } from '@/components/dashboard/charts/ROIComparisonChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { 
  getComparativeMetrics, 
  getGrowthComparison, 
  getROIComparison,
  getModulePerformanceScore 
} from '@/lib/comparative/businessComparison';

export default function ComparativeBusinessDashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Get comparative metrics with filters
  const comparativeData = useMemo(() => {
    const range = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getComparativeMetrics(
      range,
      selectedCountry !== 'all' ? selectedCountry : undefined,
      selectedRegion !== 'all' ? selectedRegion : undefined
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const growthData = useMemo(() => {
    const range = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getGrowthComparison(
      range,
      selectedCountry !== 'all' ? selectedCountry : undefined,
      selectedRegion !== 'all' ? selectedRegion : undefined
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const roiData = useMemo(() => {
    const range = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getROIComparison(
      range,
      selectedCountry !== 'all' ? selectedCountry : undefined,
      selectedRegion !== 'all' ? selectedRegion : undefined
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const performanceScores = useMemo(() => {
    const range = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getModulePerformanceScore(
      range,
      selectedCountry !== 'all' ? selectedCountry : undefined,
      selectedRegion !== 'all' ? selectedRegion : undefined
    );
  }, [dateRange, selectedCountry, selectedRegion]);

  const hasActiveFilters = dateRange !== undefined || selectedCountry !== 'all' || selectedRegion !== 'all';

  return (
    <DashboardPageLayout
      dashboardActions={<EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />}
    >
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header with Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comparative Business Performance</h1>
            <p className="text-muted-foreground mt-1">
              Compare Assessments and Background Checks module performance side-by-side
            </p>
          </div>
          
          {!isEditMode && (
            <DashboardActionBar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              onExport={() => {}}
              onResetFilters={() => {
                setDateRange(undefined);
                setSelectedCountry('all');
                setSelectedRegion('all');
              }}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <ActiveFiltersIndicator
            dateRange={dateRange}
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            onClearDateRange={() => setDateRange(undefined)}
            onClearCountry={() => setSelectedCountry('all')}
            onClearRegion={() => setSelectedRegion('all')}
          />
        )}

        {/* Key Metrics - Overall Combined Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Combined Revenue"
            value={`$${comparativeData.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            change="+0%"
            trend="up"
            variant="primary"
            showGradient={false}
            showBorder={true}
            elevation="sm"
          />
          <EnhancedStatCard
            title="Combined Profit"
            value={`$${comparativeData.totalProfit.toLocaleString()}`}
            icon={<TrendingUp className="h-6 w-6" />}
            change="+0%"
            trend="up"
            variant="success"
            showGradient={false}
            showBorder={true}
            elevation="sm"
          />
          <EnhancedStatCard
            title="Total Volume"
            value={comparativeData.totalVolume.toLocaleString()}
            icon={<Users className="h-6 w-6" />}
            change="+0%"
            trend="up"
            variant="neutral"
            showGradient={false}
            showBorder={true}
            elevation="sm"
          />
          <EnhancedStatCard
            title="Overall Margin"
            value={`${comparativeData.overallMargin.toFixed(1)}%`}
            icon={<Target className="h-6 w-6" />}
            change="+0%"
            trend="up"
            variant="warning"
            showGradient={false}
            showBorder={true}
            elevation="sm"
          />
        </div>

        {/* Module Performance Scores */}
        <div className="grid md:grid-cols-2 gap-4">
          {performanceScores.map((score) => (
            <div 
              key={score.module}
              className="p-6 rounded-lg border bg-card transition-[background,border-color,box-shadow,color] duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{score.module}</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{score.score.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Performance Score</div>
                </div>
              </div>
              <div className="space-y-2">
                {score.factors.map((factor) => (
                  <div key={factor.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{factor.name}</span>
                      <span className="font-medium">{factor.value.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(factor.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="growth">Growth Rates</TabsTrigger>
            <TabsTrigger value="roi">ROI & Profitability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ModuleComparisonChart 
              data={comparativeData}
              description="Side-by-side comparison of key business metrics"
            />
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <GrowthComparisonChart 
              data={growthData}
              description="Compare growth rates across revenue, volume, profit, and clients"
            />
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <ROIComparisonChart 
              data={roiData}
              description="Return on investment and profitability analysis"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
