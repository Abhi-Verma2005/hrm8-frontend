import { Application } from '@/types/application';
import { Job } from '@/types/job';
import { Candidate } from '@/types/entities';
import { differenceInDays, differenceInHours, startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface FunnelMetrics {
  stage: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface TimeToHireMetrics {
  averageDays: number;
  medianDays: number;
  byStage: {
    stage: string;
    averageDays: number;
  }[];
  trend: {
    month: string;
    averageDays: number;
  }[];
}

export interface SourceEffectivenessMetrics {
  source: string;
  totalApplications: number;
  hiredCount: number;
  conversionRate: number;
  averageTimeToHire: number;
  qualityScore: number;
}

export interface TeamPerformanceMetrics {
  teamMember: string;
  role: string;
  applicationsReviewed: number;
  interviewsConducted: number;
  offersExtended: number;
  hires: number;
  averageTimeToReview: number;
  responseRate: number;
}

export function calculateRecruitmentFunnel(applications: Application[]): FunnelMetrics[] {
  const stageOrder = [
    'New Application',
    'Resume Review',
    'Phone Screen',
    'Technical Interview',
    'Manager Interview',
    'Final Round',
    'Reference Check',
    'Offer Extended',
    'Offer Accepted',
  ];

  const stageCounts = stageOrder.map(stage => {
    const count = applications.filter(app => {
      const stageIndex = stageOrder.indexOf(app.stage);
      const currentIndex = stageOrder.indexOf(stage);
      return stageIndex >= currentIndex && app.status !== 'rejected' && app.status !== 'withdrawn';
    }).length;
    return { stage, count };
  });

  const totalApplications = applications.length;
  
  return stageCounts.map((item, index) => {
    const percentage = totalApplications > 0 ? (item.count / totalApplications) * 100 : 0;
    const prevCount = index > 0 ? stageCounts[index - 1].count : totalApplications;
    const conversionRate = prevCount > 0 ? (item.count / prevCount) * 100 : 0;
    
    return {
      stage: item.stage,
      count: item.count,
      percentage: Math.round(percentage * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  });
}

export function calculateTimeToHire(applications: Application[]): TimeToHireMetrics {
  const hiredApplications = applications.filter(app => app.status === 'hired');
  
  if (hiredApplications.length === 0) {
    return {
      averageDays: 0,
      medianDays: 0,
      byStage: [],
      trend: [],
    };
  }

  // Calculate days from application to hire
  const daysToHire = hiredApplications.map(app => 
    differenceInDays(app.updatedAt, app.appliedDate)
  ).sort((a, b) => a - b);

  const averageDays = Math.round(
    daysToHire.reduce((sum, days) => sum + days, 0) / daysToHire.length
  );

  const medianDays = daysToHire[Math.floor(daysToHire.length / 2)];

  // Calculate average time spent in each stage
  const stageOrder = [
    'Resume Review',
    'Phone Screen',
    'Technical Interview',
    'Manager Interview',
    'Final Round',
    'Reference Check',
    'Offer Extended',
  ];

  const byStage = stageOrder.map(stage => {
    const appsInStage = hiredApplications.filter(app => 
      app.activities.some(activity => activity.description.includes(stage))
    );
    
    const avgDays = appsInStage.length > 0
      ? Math.round(
          appsInStage.reduce((sum, app) => {
            const stageActivity = app.activities.find(a => a.description.includes(stage));
            if (stageActivity) {
              return sum + differenceInDays(stageActivity.createdAt, app.appliedDate);
            }
            return sum;
          }, 0) / appsInStage.length
        )
      : 0;

    return { stage, averageDays: avgDays };
  });

  // Calculate trend over last 6 months
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthEnd = endOfMonth(subMonths(new Date(), i));
    
    const monthApplications = hiredApplications.filter(app => 
      app.updatedAt >= monthStart && app.updatedAt <= monthEnd
    );

    if (monthApplications.length > 0) {
      const monthDays = monthApplications.map(app => 
        differenceInDays(app.updatedAt, app.appliedDate)
      );
      const avgDays = Math.round(
        monthDays.reduce((sum, days) => sum + days, 0) / monthDays.length
      );
      
      trend.push({
        month: format(monthStart, 'MMM yyyy'),
        averageDays: avgDays,
      });
    } else {
      trend.push({
        month: format(monthStart, 'MMM yyyy'),
        averageDays: 0,
      });
    }
  }

  return {
    averageDays,
    medianDays,
    byStage,
    trend,
  };
}

export function calculateSourceEffectiveness(
  applications: Application[],
  candidates: Candidate[]
): SourceEffectivenessMetrics[] {
  const sources = [...new Set(candidates.map(c => c.source))];
  
  return sources.map(source => {
    const sourceCandidates = candidates.filter(c => c.source === source);
    const sourceApplications = applications.filter(app => 
      sourceCandidates.some(c => c.id === app.candidateId)
    );
    
    const totalApplications = sourceApplications.length;
    const hiredCount = sourceApplications.filter(app => app.status === 'hired').length;
    const conversionRate = totalApplications > 0 ? (hiredCount / totalApplications) * 100 : 0;
    
    // Calculate average time to hire for this source
    const hiredApps = sourceApplications.filter(app => app.status === 'hired');
    const avgTimeToHire = hiredApps.length > 0
      ? Math.round(
          hiredApps.reduce((sum, app) => 
            sum + differenceInDays(app.updatedAt, app.appliedDate), 0
          ) / hiredApps.length
        )
      : 0;

    // Quality score based on multiple factors
    const interviewRate = totalApplications > 0
      ? (sourceApplications.filter(app => app.status === 'interview').length / totalApplications) * 100
      : 0;
    
    const qualityScore = Math.round(
      (conversionRate * 0.5) + (interviewRate * 0.3) + (totalApplications > 10 ? 20 : 0)
    );

    return {
      source,
      totalApplications,
      hiredCount,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageTimeToHire: avgTimeToHire,
      qualityScore: Math.min(100, qualityScore),
    };
  }).sort((a, b) => b.qualityScore - a.qualityScore);
}

export function calculateTeamPerformance(
  applications: Application[],
  jobs: Job[]
): TeamPerformanceMetrics[] {
  const teamMembers = new Map<string, TeamPerformanceMetrics>();

  // Process applications to gather team metrics
  applications.forEach(app => {
    // Get assigned recruiter
    if (app.assignedToName) {
      const existing = teamMembers.get(app.assignedToName) || {
        teamMember: app.assignedToName,
        role: 'Recruiter',
        applicationsReviewed: 0,
        interviewsConducted: 0,
        offersExtended: 0,
        hires: 0,
        averageTimeToReview: 0,
        responseRate: 0,
      };

      existing.applicationsReviewed++;
      if (app.status === 'interview') existing.interviewsConducted++;
      if (app.status === 'offer') existing.offersExtended++;
      if (app.status === 'hired') existing.hires++;

      teamMembers.set(app.assignedToName, existing);
    }

    // Process interviews to track interviewers
    app.interviews.forEach(interview => {
      interview.interviewers?.forEach(interviewer => {
        const existing = teamMembers.get(interviewer) || {
          teamMember: interviewer,
          role: 'Interviewer',
          applicationsReviewed: 0,
          interviewsConducted: 0,
          offersExtended: 0,
          hires: 0,
          averageTimeToReview: 0,
          responseRate: 0,
        };

        existing.interviewsConducted++;
        if (interview.status === 'completed') {
          existing.responseRate = Math.min(100, existing.responseRate + 10);
        }

        teamMembers.set(interviewer, existing);
      });
    });

    // Process scorecards
    app.scorecards?.forEach(scorecard => {
      const existing = teamMembers.get(scorecard.evaluatorName) || {
        teamMember: scorecard.evaluatorName,
        role: scorecard.evaluatorRole,
        applicationsReviewed: 0,
        interviewsConducted: 0,
        offersExtended: 0,
        hires: 0,
        averageTimeToReview: 0,
        responseRate: 0,
      };

      existing.applicationsReviewed++;
      if (scorecard.status === 'completed') {
        const reviewTime = differenceInHours(scorecard.completedAt, scorecard.createdAt);
        existing.averageTimeToReview = 
          (existing.averageTimeToReview * (existing.applicationsReviewed - 1) + reviewTime) / 
          existing.applicationsReviewed;
      }

      teamMembers.set(scorecard.evaluatorName, existing);
    });
  });

  return Array.from(teamMembers.values())
    .map(member => ({
      ...member,
      averageTimeToReview: Math.round(member.averageTimeToReview * 10) / 10,
      responseRate: Math.min(100, member.responseRate),
    }))
    .sort((a, b) => b.hires - a.hires);
}

export function calculateOverallMetrics(applications: Application[]) {
  const total = applications.length;
  const active = applications.filter(app => 
    app.status !== 'rejected' && app.status !== 'withdrawn' && app.status !== 'hired'
  ).length;
  const hired = applications.filter(app => app.status === 'hired').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  
  const hireRate = total > 0 ? (hired / total) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
  
  // Calculate average AI match score
  const appsWithAIScore = applications.filter(app => app.aiMatchScore);
  const avgAIScore = appsWithAIScore.length > 0
    ? Math.round(
        appsWithAIScore.reduce((sum, app) => sum + (app.aiMatchScore || 0), 0) / 
        appsWithAIScore.length
      )
    : 0;

  return {
    total,
    active,
    hired,
    rejected,
    hireRate: Math.round(hireRate * 10) / 10,
    rejectionRate: Math.round(rejectionRate * 10) / 10,
    avgAIScore,
  };
}
