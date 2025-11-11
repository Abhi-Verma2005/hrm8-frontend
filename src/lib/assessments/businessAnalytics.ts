import { getAssessments } from '@/lib/mockAssessmentStorage';
import type { 
  RevenueMetrics, 
  UsageMetrics, 
  ProfitabilityMetrics, 
  TrendData,
  ClientRevenueData,
  GeographicData,
  TypeDistribution,
  ConversionMetrics
} from '@/types/businessMetrics';

// Assessment pricing by type
export const ASSESSMENT_PRICING = {
  'cognitive': 69,
  'personality': 59,
  'technical-skills': 89,
  'situational-judgment': 79,
  'behavioral': 69,
  'culture-fit': 59,
  'custom': 99,
};

// Provider costs (what we pay third-party providers)
const PROVIDER_COSTS = {
  'testgorilla': 40,
  'vervoe': 45,
  'criteria': 35,
  'harver': 42,
  'shl': 50,
  'codility': 55,
  'internal': 10, // Internal cost for HRM8 native assessments
};

function getAssessmentPrice(assessmentType: string): number {
  return ASSESSMENT_PRICING[assessmentType as keyof typeof ASSESSMENT_PRICING] || 69;
}

function getProviderCost(provider: string): number {
  return PROVIDER_COSTS[provider as keyof typeof PROVIDER_COSTS] || 30;
}

export function getAssessmentRevenueMetrics(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): RevenueMetrics {
  let assessments = getAssessments().filter(a => a.status === 'completed');
  
  // Apply filters
  if (dateRange) {
    assessments = assessments.filter(a => {
      const completedDate = new Date(a.completedDate || a.createdAt);
      return completedDate >= dateRange.from && completedDate <= dateRange.to;
    });
  }
  
  if (country && country !== 'all') {
    assessments = assessments.filter(a => a.country === country);
  }
  
  if (region && region !== 'all') {
    assessments = assessments.filter(a => a.region === region);
  }
  
  const totalRevenue = assessments.reduce((sum, a) => sum + getAssessmentPrice(a.assessmentType), 0);
  const totalCosts = assessments.reduce((sum, a) => sum + getProviderCost(a.provider), 0);
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;
  
  // Calculate revenue by type
  const revenueByType: Record<string, number> = {};
  assessments.forEach(a => {
    const type = a.assessmentType;
    revenueByType[type] = (revenueByType[type] || 0) + getAssessmentPrice(type);
  });
  
  // Calculate unique clients
  const uniqueClients = new Set(assessments.map(a => a.billedTo)).size;
  const revenuePerClient = uniqueClients > 0 ? totalRevenue / uniqueClients : 0;
  
  // Mock month-over-month growth
  const monthOverMonthGrowth = 12.5;
  
  return {
    totalRevenue,
    revenueByType,
    monthOverMonthGrowth,
    revenuePerClient,
    profitMargin,
  };
}

export function getAssessmentUsageMetrics(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): UsageMetrics {
  let assessments = getAssessments();
  
  // Apply filters
  if (dateRange) {
    assessments = assessments.filter(a => {
      const createdDate = new Date(a.createdAt);
      return createdDate >= dateRange.from && createdDate <= dateRange.to;
    });
  }
  
  if (country && country !== 'all') {
    assessments = assessments.filter(a => a.country === country);
  }
  
  if (region && region !== 'all') {
    assessments = assessments.filter(a => a.region === region);
  }
  
  const totalVolume = assessments.length;
  
  // Calculate volume by location
  const locationMap = new Map<string, GeographicData>();
  assessments.forEach(a => {
    const key = `${a.country || 'Unknown'}-${a.region || 'Unknown'}`;
    const existing = locationMap.get(key);
    const revenue = a.status === 'completed' ? getAssessmentPrice(a.assessmentType) : 0;
    
    if (existing) {
      existing.count++;
      existing.revenue += revenue;
    } else {
      locationMap.set(key, {
        country: a.country || 'Unknown',
        region: a.region || 'Unknown',
        count: 1,
        revenue,
      });
    }
  });
  
  const volumeByLocation = Array.from(locationMap.values())
    .sort((a, b) => b.revenue - a.revenue);
  
  // Calculate top clients
  const clientMap = new Map<string, ClientRevenueData>();
  assessments.forEach(a => {
    const clientId = a.billedTo || 'unknown';
    const clientName = a.billedToName || 'Unknown Client';
    const existing = clientMap.get(clientId);
    const revenue = a.status === 'completed' ? getAssessmentPrice(a.assessmentType) : 0;
    
    if (existing) {
      existing.volume++;
      existing.revenue += revenue;
      existing.avgPrice = existing.revenue / existing.volume;
    } else {
      clientMap.set(clientId, {
        clientId,
        clientName,
        volume: 1,
        revenue,
        avgPrice: revenue,
      });
    }
  });
  
  const topClients = Array.from(clientMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Mock client adoption rate
  const totalPossibleClients = 100; // Mock value
  const activeClients = new Set(assessments.map(a => a.billedTo)).size;
  const clientAdoptionRate = (activeClients / totalPossibleClients) * 100;
  
  return {
    totalVolume,
    volumeByLocation,
    clientAdoptionRate,
    topClients,
  };
}

export function getAssessmentProfitability(
  dateRange?: { from: Date; to: Date },
  country?: string,
  region?: string
): ProfitabilityMetrics {
  let assessments = getAssessments().filter(a => a.status === 'completed');
  
  // Apply filters
  if (dateRange) {
    assessments = assessments.filter(a => {
      const completedDate = new Date(a.completedDate || a.createdAt);
      return completedDate >= dateRange.from && completedDate <= dateRange.to;
    });
  }
  
  if (country && country !== 'all') {
    assessments = assessments.filter(a => a.country === country);
  }
  
  if (region && region !== 'all') {
    assessments = assessments.filter(a => a.region === region);
  }
  
  const totalRevenue = assessments.reduce((sum, a) => sum + getAssessmentPrice(a.assessmentType), 0);
  const providerCosts = assessments.reduce((sum, a) => sum + getProviderCost(a.provider), 0);
  const internalCosts = assessments.length * 5; // Mock internal operational cost per assessment
  const netProfit = totalRevenue - providerCosts - internalCosts;
  const costPerUnit = assessments.length > 0 ? (providerCosts + internalCosts) / assessments.length : 0;
  const marginPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  return {
    providerCosts,
    internalCosts,
    netProfit,
    costPerUnit,
    marginPercentage,
  };
}

export function getAssessmentRevenueTrends(): TrendData[] {
  const assessments = getAssessments();
  const monthMap = new Map<string, TrendData>();
  
  // Generate last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    months.push(monthKey);
    monthMap.set(monthKey, {
      month: monthKey,
      revenue: 0,
      volume: 0,
      profit: 0,
      newClients: 0,
    });
  }
  
  // Populate with assessment data
  assessments.forEach(a => {
    const date = new Date(a.completedDate || a.createdAt);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const data = monthMap.get(monthKey);
    
    if (data && a.status === 'completed') {
      const revenue = getAssessmentPrice(a.assessmentType);
      const cost = getProviderCost(a.provider) + 5;
      data.revenue += revenue;
      data.volume++;
      data.profit += (revenue - cost);
    }
  });
  
  // Mock new clients per month
  monthMap.forEach((data, key) => {
    data.newClients = Math.floor(Math.random() * 5) + 2;
  });
  
  return months.map(m => monthMap.get(m)!);
}

export function getRevenueByTypeDistribution(): TypeDistribution[] {
  const assessments = getAssessments().filter(a => a.status === 'completed');
  const typeMap = new Map<string, TypeDistribution>();
  
  assessments.forEach(a => {
    const type = a.assessmentType;
    const existing = typeMap.get(type);
    const revenue = getAssessmentPrice(type);
    const providerCost = getProviderCost(a.provider);
    
    if (existing) {
      existing.revenue += revenue;
      existing.volume++;
      existing.providerCost = (existing.providerCost || 0) + providerCost;
      existing.profit = existing.revenue - (existing.providerCost || 0);
      existing.avgPrice = existing.revenue / existing.volume;
    } else {
      typeMap.set(type, {
        type: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        revenue,
        volume: 1,
        avgPrice: revenue,
        providerCost,
        profit: revenue - providerCost,
      });
    }
  });
  
  return Array.from(typeMap.values()).sort((a, b) => b.revenue - a.revenue);
}

export function getTopClientsByRevenue(limit: number = 10): ClientRevenueData[] {
  const assessments = getAssessments().filter(a => a.status === 'completed');
  const clientMap = new Map<string, ClientRevenueData>();
  
  assessments.forEach(a => {
    const clientId = a.billedTo || 'unknown';
    const clientName = a.billedToName || 'Unknown Client';
    const existing = clientMap.get(clientId);
    const revenue = getAssessmentPrice(a.assessmentType);
    
    if (existing) {
      existing.volume++;
      existing.revenue += revenue;
      existing.avgPrice = existing.revenue / existing.volume;
    } else {
      clientMap.set(clientId, {
        clientId,
        clientName,
        volume: 1,
        revenue,
        avgPrice: revenue,
      });
    }
  });
  
  return Array.from(clientMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getGeographicRevenueDistribution(): GeographicData[] {
  const assessments = getAssessments().filter(a => a.status === 'completed');
  const locationMap = new Map<string, GeographicData>();
  
  assessments.forEach(a => {
    const key = a.country || 'Unknown';
    const existing = locationMap.get(key);
    const revenue = getAssessmentPrice(a.assessmentType);
    
    if (existing) {
      existing.count++;
      existing.revenue += revenue;
    } else {
      locationMap.set(key, {
        country: a.country || 'Unknown',
        region: a.region || 'Unknown',
        count: 1,
        revenue,
      });
    }
  });
  
  return Array.from(locationMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

export function getConversionMetrics(): ConversionMetrics {
  const assessments = getAssessments().filter(a => a.status === 'completed');
  const totalAssessments = assessments.length;
  
  // Mock: assume 35% of completed assessments lead to hire
  const leadsToHire = Math.round(totalAssessments * 0.35);
  const conversionRate = totalAssessments > 0 ? (leadsToHire / totalAssessments) * 100 : 0;
  
  const totalRevenue = assessments.reduce((sum, a) => sum + getAssessmentPrice(a.assessmentType), 0);
  const revenuePerHire = leadsToHire > 0 ? totalRevenue / leadsToHire : 0;
  
  return {
    totalAssessments,
    leadsToHire,
    conversionRate,
    revenuePerHire,
  };
}
