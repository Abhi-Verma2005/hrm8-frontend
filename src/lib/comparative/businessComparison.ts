import { getAssessmentRevenueMetrics, getAssessmentUsageMetrics, getAssessmentProfitability, getAssessmentRevenueTrends } from '@/lib/assessments/businessAnalytics';
import { getBackgroundCheckRevenueMetrics, getBackgroundCheckUsageMetrics, getBackgroundCheckProfitability, getBackgroundCheckRevenueTrends } from '@/lib/backgroundChecks/businessAnalytics';
import type { RevenueMetrics, UsageMetrics, ProfitabilityMetrics, TrendData } from '@/types/businessMetrics';

export interface ModuleComparison {
  moduleName: string;
  revenue: RevenueMetrics;
  usage: UsageMetrics;
  profitability: ProfitabilityMetrics;
  trends: TrendData[];
}

export interface ComparativeMetrics {
  assessments: ModuleComparison;
  backgroundChecks: ModuleComparison;
  totalRevenue: number;
  totalProfit: number;
  totalVolume: number;
  overallMargin: number;
}

export interface GrowthComparison {
  module: string;
  revenueGrowth: number;
  volumeGrowth: number;
  profitGrowth: number;
  clientGrowth: number;
}

export interface ROIMetrics {
  module: string;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roi: number;
  paybackPeriod: number; // months
  profitMargin: number;
}

export function getComparativeMetrics(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): ComparativeMetrics {
  const assessmentRevenue = getAssessmentRevenueMetrics(dateRange, country, region);
  const assessmentUsage = getAssessmentUsageMetrics(dateRange, country, region);
  const assessmentProfitability = getAssessmentProfitability(dateRange, country, region);
  const assessmentTrends = getAssessmentRevenueTrends();

  const backgroundCheckRevenue = getBackgroundCheckRevenueMetrics(dateRange, country, region);
  const backgroundCheckUsage = getBackgroundCheckUsageMetrics(dateRange, country, region);
  const backgroundCheckProfitability = getBackgroundCheckProfitability(dateRange, country, region);
  const backgroundCheckTrends = getBackgroundCheckRevenueTrends();

  const totalRevenue = assessmentRevenue.totalRevenue + backgroundCheckRevenue.totalRevenue;
  const totalProfit = assessmentProfitability.netProfit + backgroundCheckProfitability.netProfit;
  const totalVolume = assessmentUsage.totalVolume + backgroundCheckUsage.totalVolume;
  const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    assessments: {
      moduleName: 'Assessments',
      revenue: assessmentRevenue,
      usage: assessmentUsage,
      profitability: assessmentProfitability,
      trends: assessmentTrends,
    },
    backgroundChecks: {
      moduleName: 'Background Checks',
      revenue: backgroundCheckRevenue,
      usage: backgroundCheckUsage,
      profitability: backgroundCheckProfitability,
      trends: backgroundCheckTrends,
    },
    totalRevenue,
    totalProfit,
    totalVolume,
    overallMargin,
  };
}

export function getGrowthComparison(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): GrowthComparison[] {
  const assessmentRevenue = getAssessmentRevenueMetrics(dateRange, country, region);
  const assessmentTrends = getAssessmentRevenueTrends();
  
  const backgroundCheckRevenue = getBackgroundCheckRevenueMetrics(dateRange, country, region);
  const backgroundCheckTrends = getBackgroundCheckRevenueTrends();

  // Calculate volume growth from trends
  const assessmentVolumeGrowth = assessmentTrends.length >= 2
    ? ((assessmentTrends[assessmentTrends.length - 1].volume - assessmentTrends[0].volume) / assessmentTrends[0].volume) * 100
    : 0;

  const backgroundCheckVolumeGrowth = backgroundCheckTrends.length >= 2
    ? ((backgroundCheckTrends[backgroundCheckTrends.length - 1].volume - backgroundCheckTrends[0].volume) / backgroundCheckTrends[0].volume) * 100
    : 0;

  // Calculate profit growth from trends
  const assessmentProfitGrowth = assessmentTrends.length >= 2
    ? ((assessmentTrends[assessmentTrends.length - 1].profit - assessmentTrends[0].profit) / assessmentTrends[0].profit) * 100
    : 0;

  const backgroundCheckProfitGrowth = backgroundCheckTrends.length >= 2
    ? ((backgroundCheckTrends[backgroundCheckTrends.length - 1].profit - backgroundCheckTrends[0].profit) / backgroundCheckTrends[0].profit) * 100
    : 0;

  // Calculate client growth from trends
  const assessmentClientGrowth = assessmentTrends.length >= 2
    ? ((assessmentTrends[assessmentTrends.length - 1].newClients - assessmentTrends[0].newClients) / assessmentTrends[0].newClients) * 100
    : 0;

  const backgroundCheckClientGrowth = backgroundCheckTrends.length >= 2
    ? ((backgroundCheckTrends[backgroundCheckTrends.length - 1].newClients - backgroundCheckTrends[0].newClients) / backgroundCheckTrends[0].newClients) * 100
    : 0;

  return [
    {
      module: 'Assessments',
      revenueGrowth: assessmentRevenue.monthOverMonthGrowth,
      volumeGrowth: assessmentVolumeGrowth,
      profitGrowth: assessmentProfitGrowth,
      clientGrowth: assessmentClientGrowth,
    },
    {
      module: 'Background Checks',
      revenueGrowth: backgroundCheckRevenue.monthOverMonthGrowth,
      volumeGrowth: backgroundCheckVolumeGrowth,
      profitGrowth: backgroundCheckProfitGrowth,
      clientGrowth: backgroundCheckClientGrowth,
    },
  ];
}

export function getROIComparison(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): ROIMetrics[] {
  const assessmentRevenue = getAssessmentRevenueMetrics(dateRange, country, region);
  const assessmentProfitability = getAssessmentProfitability(dateRange, country, region);
  
  const backgroundCheckRevenue = getBackgroundCheckRevenueMetrics(dateRange, country, region);
  const backgroundCheckProfitability = getBackgroundCheckProfitability(dateRange, country, region);

  const assessmentTotalCosts = assessmentProfitability.providerCosts + assessmentProfitability.internalCosts;
  const backgroundCheckTotalCosts = backgroundCheckProfitability.providerCosts + backgroundCheckProfitability.internalCosts;

  const assessmentROI = assessmentTotalCosts > 0 
    ? ((assessmentProfitability.netProfit / assessmentTotalCosts) * 100) 
    : 0;

  const backgroundCheckROI = backgroundCheckTotalCosts > 0 
    ? ((backgroundCheckProfitability.netProfit / backgroundCheckTotalCosts) * 100) 
    : 0;

  // Payback period: months to recover investment (simplified calculation)
  const assessmentPaybackPeriod = assessmentProfitability.netProfit > 0 
    ? (assessmentTotalCosts / (assessmentProfitability.netProfit / 6)) 
    : 0;

  const backgroundCheckPaybackPeriod = backgroundCheckProfitability.netProfit > 0 
    ? (backgroundCheckTotalCosts / (backgroundCheckProfitability.netProfit / 6)) 
    : 0;

  return [
    {
      module: 'Assessments',
      totalRevenue: assessmentRevenue.totalRevenue,
      totalCosts: assessmentTotalCosts,
      netProfit: assessmentProfitability.netProfit,
      roi: assessmentROI,
      paybackPeriod: assessmentPaybackPeriod,
      profitMargin: assessmentProfitability.marginPercentage,
    },
    {
      module: 'Background Checks',
      totalRevenue: backgroundCheckRevenue.totalRevenue,
      totalCosts: backgroundCheckTotalCosts,
      netProfit: backgroundCheckProfitability.netProfit,
      roi: backgroundCheckROI,
      paybackPeriod: backgroundCheckPaybackPeriod,
      profitMargin: backgroundCheckProfitability.marginPercentage,
    },
  ];
}

export function getModulePerformanceScore(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): { module: string; score: number; factors: { name: string; value: number; weight: number }[] }[] {
  const comparative = getComparativeMetrics(dateRange, country, region);
  const growth = getGrowthComparison(dateRange, country, region);
  const roi = getROIComparison(dateRange, country, region);

  const calculateScore = (
    moduleName: string,
    moduleData: ModuleComparison,
    growthData: GrowthComparison,
    roiData: ROIMetrics
  ) => {
    // Weighted scoring system (0-100)
    const factors = [
      { name: 'Profit Margin', value: moduleData.profitability.marginPercentage, weight: 0.25 },
      { name: 'Revenue Growth', value: Math.min(growthData.revenueGrowth, 100), weight: 0.20 },
      { name: 'ROI', value: Math.min(roiData.roi / 2, 100), weight: 0.20 },
      { name: 'Client Adoption', value: moduleData.usage.clientAdoptionRate, weight: 0.15 },
      { name: 'Volume Growth', value: Math.min(growthData.volumeGrowth, 100), weight: 0.10 },
      { name: 'Profit Growth', value: Math.min(growthData.profitGrowth, 100), weight: 0.10 },
    ];

    const score = factors.reduce((total, factor) => {
      return total + (factor.value * factor.weight);
    }, 0);

    return { module: moduleName, score, factors };
  };

  return [
    calculateScore('Assessments', comparative.assessments, growth[0], roi[0]),
    calculateScore('Background Checks', comparative.backgroundChecks, growth[1], roi[1]),
  ];
}
