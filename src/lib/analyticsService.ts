/**
 * Analytics Service
 * Calculates recruitment metrics and analytics data
 */

import { Candidate } from "@/types/entities";
import { differenceInDays, startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export interface RecruitmentMetrics {
  totalCandidates: number;
  activeCandidates: number;
  hiredCandidates: number;
  rejectedCandidates: number;
  averageTimeToHire: number;
  conversionRate: number;
  candidatesThisMonth: number;
  candidatesLastMonth: number;
  monthOverMonthGrowth: number;
}

export interface PipelineStageMetrics {
  stage: string;
  count: number;
  percentage: number;
  averageTimeInStage: number;
}

export interface SourceEffectivenessMetrics {
  source: string;
  candidates: number;
  hired: number;
  conversionRate: number;
  averageTimeToHire: number;
  averageRating: number;
}

export interface TimeToHireData {
  period: string;
  averageDays: number;
  candidates: number;
}

export interface TrendData {
  date: string;
  candidates: number;
  hired: number;
  rejected: number;
}

/**
 * Calculate overall recruitment metrics
 */
export function calculateRecruitmentMetrics(candidates: Candidate[]): RecruitmentMetrics {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => c.status === 'active').length;
  const hiredCandidates = candidates.filter(c => c.status === 'hired').length;
  const rejectedCandidates = candidates.filter(c => c.status === 'rejected').length;

  // Calculate average time to hire (for hired candidates)
  const hiredWithDates = candidates.filter(c => c.status === 'hired' && c.appliedDate);
  const totalDaysToHire = hiredWithDates.reduce((sum, c) => {
    if (!c.appliedDate) return sum;
    const hireDate = c.updatedAt || new Date();
    return sum + differenceInDays(hireDate, c.appliedDate);
  }, 0);
  const averageTimeToHire = hiredWithDates.length > 0 ? Math.round(totalDaysToHire / hiredWithDates.length) : 0;

  // Calculate conversion rate (hired / total applied)
  const conversionRate = totalCandidates > 0 ? (hiredCandidates / totalCandidates) * 100 : 0;

  // Month-over-month comparison
  const candidatesThisMonth = candidates.filter(c => {
    if (!c.appliedDate) return false;
    return c.appliedDate >= thisMonthStart && c.appliedDate <= thisMonthEnd;
  }).length;

  const candidatesLastMonth = candidates.filter(c => {
    if (!c.appliedDate) return false;
    return c.appliedDate >= lastMonthStart && c.appliedDate <= lastMonthEnd;
  }).length;

  const monthOverMonthGrowth = candidatesLastMonth > 0
    ? ((candidatesThisMonth - candidatesLastMonth) / candidatesLastMonth) * 100
    : 0;

  return {
    totalCandidates,
    activeCandidates,
    hiredCandidates,
    rejectedCandidates,
    averageTimeToHire,
    conversionRate,
    candidatesThisMonth,
    candidatesLastMonth,
    monthOverMonthGrowth,
  };
}

/**
 * Calculate pipeline stage metrics
 */
export function calculatePipelineMetrics(candidates: Candidate[]): PipelineStageMetrics[] {
  const stageGroups: Record<string, Candidate[]> = {};
  
  candidates.forEach(candidate => {
    const stage = candidate.stage || 'Applied';
    if (!stageGroups[stage]) {
      stageGroups[stage] = [];
    }
    stageGroups[stage].push(candidate);
  });

  const totalCandidates = candidates.length;
  const stages = Object.keys(stageGroups);

  return stages.map(stage => {
    const stageCandidates = stageGroups[stage];
    const count = stageCandidates.length;
    const percentage = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;

    // Calculate average time in this stage
    const totalTime = stageCandidates.reduce((sum, c) => {
      if (!c.appliedDate) return sum;
      const currentDate = c.updatedAt || new Date();
      return sum + differenceInDays(currentDate, c.appliedDate);
    }, 0);
    const averageTimeInStage = count > 0 ? Math.round(totalTime / count) : 0;

    return {
      stage,
      count,
      percentage: Math.round(percentage * 10) / 10,
      averageTimeInStage,
    };
  }).sort((a, b) => b.count - a.count);
}

/**
 * Calculate source effectiveness metrics
 */
export function calculateSourceEffectiveness(candidates: Candidate[]): SourceEffectivenessMetrics[] {
  const sourceGroups: Record<string, Candidate[]> = {};
  
  candidates.forEach(candidate => {
    const source = candidate.source || 'Unknown';
    if (!sourceGroups[source]) {
      sourceGroups[source] = [];
    }
    sourceGroups[source].push(candidate);
  });

  return Object.keys(sourceGroups).map(source => {
    const sourceCandidates = sourceGroups[source];
    const total = sourceCandidates.length;
    const hired = sourceCandidates.filter(c => c.status === 'hired').length;
    const conversionRate = total > 0 ? (hired / total) * 100 : 0;

    // Calculate average time to hire for this source
    const hiredFromSource = sourceCandidates.filter(c => c.status === 'hired' && c.appliedDate);
    const totalDays = hiredFromSource.reduce((sum, c) => {
      if (!c.appliedDate) return sum;
      const hireDate = c.updatedAt || new Date();
      return sum + differenceInDays(hireDate, c.appliedDate);
    }, 0);
    const averageTimeToHire = hiredFromSource.length > 0 ? Math.round(totalDays / hiredFromSource.length) : 0;

    // Calculate average rating
    const ratedCandidates = sourceCandidates.filter(c => c.rating && c.rating > 0);
    const totalRating = ratedCandidates.reduce((sum, c) => sum + (c.rating || 0), 0);
    const averageRating = ratedCandidates.length > 0 ? totalRating / ratedCandidates.length : 0;

    return {
      source,
      candidates: total,
      hired,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageTimeToHire,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }).sort((a, b) => b.candidates - a.candidates);
}

/**
 * Calculate time-to-hire trends over time
 */
export function calculateTimeToHireTrend(candidates: Candidate[], months: number = 6): TimeToHireData[] {
  const now = new Date();
  const data: TimeToHireData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthCandidates = candidates.filter(c => {
      if (!c.appliedDate || c.status !== 'hired') return false;
      return c.appliedDate >= monthStart && c.appliedDate <= monthEnd;
    });

    const totalDays = monthCandidates.reduce((sum, c) => {
      if (!c.appliedDate) return sum;
      const hireDate = c.updatedAt || new Date();
      return sum + differenceInDays(hireDate, c.appliedDate);
    }, 0);

    const averageDays = monthCandidates.length > 0 ? Math.round(totalDays / monthCandidates.length) : 0;

    data.push({
      period: format(monthDate, 'MMM yyyy'),
      averageDays,
      candidates: monthCandidates.length,
    });
  }

  return data;
}

/**
 * Calculate candidate trends over time
 */
export function calculateCandidateTrends(candidates: Candidate[], months: number = 6): TrendData[] {
  const now = new Date();
  const data: TrendData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthCandidates = candidates.filter(c => {
      if (!c.appliedDate) return false;
      return c.appliedDate >= monthStart && c.appliedDate <= monthEnd;
    });

    const hired = monthCandidates.filter(c => c.status === 'hired').length;
    const rejected = monthCandidates.filter(c => c.status === 'rejected').length;

    data.push({
      date: format(monthDate, 'MMM yyyy'),
      candidates: monthCandidates.length,
      hired,
      rejected,
    });
  }

  return data;
}

/**
 * Calculate stage conversion funnel
 */
export function calculateConversionFunnel(candidates: Candidate[]): Array<{ stage: string; candidates: number; conversionRate: number }> {
  const stageOrder = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired'];
  const stageCounts = new Map<string, number>();

  // Count candidates in each stage
  candidates.forEach(candidate => {
    const stage = candidate.stage || 'Applied';
    stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1);
  });

  const total = candidates.length;
  const funnel: Array<{ stage: string; candidates: number; conversionRate: number }> = [];

  stageOrder.forEach(stage => {
    const count = stageCounts.get(stage) || 0;
    const conversionRate = total > 0 ? (count / total) * 100 : 0;
    
    funnel.push({
      stage,
      candidates: count,
      conversionRate: Math.round(conversionRate * 10) / 10,
    });
  });

  return funnel.filter(f => f.candidates > 0);
}
