import { getSentEmails } from "./scheduledEmails";
import { getOnboardingWorkflows } from "./onboardingStorage";

export interface EngagementScore {
  workflowId: string;
  employeeEmail: string;
  employeeName: string;
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: {
    emailsReceived: number;
    emailsOpened: number;
    emailsClicked: number;
    openRate: number;
    clickRate: number;
    avgTimeToOpen: number; // in hours
    lastEngagement?: Date;
    consecutiveIgnores: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const STORAGE_KEY = "engagement_scores";

export function calculateEngagementScore(workflowId: string): EngagementScore | null {
  const workflows = getOnboardingWorkflows();
  const workflow = workflows.find(w => w.id === workflowId);
  if (!workflow) return null;

  const sentEmails = getSentEmails();
  const workflowEmails = sentEmails.filter(email => 
    email.recipientIds.includes(workflowId)
  );

  if (workflowEmails.length === 0) {
    return {
      workflowId,
      employeeEmail: workflow.employeeEmail,
      employeeName: workflow.employeeName,
      score: 50, // Neutral score for no data
      grade: 'C',
      metrics: {
        emailsReceived: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        openRate: 0,
        clickRate: 0,
        avgTimeToOpen: 0,
        consecutiveIgnores: 0,
      },
      trend: 'stable',
      riskLevel: 'low',
      recommendations: ['No email history yet - monitor after sending emails'],
    };
  }

  // Calculate metrics
  const emailsReceived = workflowEmails.filter(e => e.deliveryStatus === 'delivered').length;
  const emailsOpened = workflowEmails.filter(e => e.openedAt).length;
  const emailsClicked = workflowEmails.filter(e => e.clickedAt).length;
  
  const openRate = emailsReceived > 0 ? (emailsOpened / emailsReceived) * 100 : 0;
  const clickRate = emailsReceived > 0 ? (emailsClicked / emailsReceived) * 100 : 0;

  // Calculate average time to open
  const openTimes = workflowEmails
    .filter(e => e.sentAt && e.openedAt)
    .map(e => {
      const sent = new Date(e.sentAt!).getTime();
      const opened = new Date(e.openedAt!).getTime();
      return (opened - sent) / (1000 * 60 * 60); // Convert to hours
    });
  const avgTimeToOpen = openTimes.length > 0 
    ? openTimes.reduce((a, b) => a + b, 0) / openTimes.length 
    : 0;

  // Find last engagement
  const lastEngagement = workflowEmails
    .filter(e => e.openedAt || e.clickedAt)
    .map(e => e.openedAt || e.clickedAt!)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  // Count consecutive ignores (last N emails not opened)
  const recentEmails = workflowEmails.slice(-5);
  let consecutiveIgnores = 0;
  for (let i = recentEmails.length - 1; i >= 0; i--) {
    if (!recentEmails[i].openedAt) {
      consecutiveIgnores++;
    } else {
      break;
    }
  }

  // Calculate engagement score (0-100)
  let score = 0;
  
  // Open rate contributes 40%
  score += (openRate / 100) * 40;
  
  // Click rate contributes 30%
  score += (clickRate / 100) * 30;
  
  // Response time contributes 15% (faster is better)
  if (avgTimeToOpen > 0) {
    const timeScore = Math.max(0, 100 - (avgTimeToOpen / 24) * 100); // Penalize after 24 hours
    score += (timeScore / 100) * 15;
  }
  
  // Consistency contributes 15% (penalize consecutive ignores)
  const consistencyScore = Math.max(0, 100 - (consecutiveIgnores * 20));
  score += (consistencyScore / 100) * 15;

  score = Math.round(Math.min(100, Math.max(0, score)));

  // Determine grade
  let grade: EngagementScore['grade'];
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  // Determine trend (mock for now, would compare to historical data)
  let trend: EngagementScore['trend'] = 'stable';
  if (consecutiveIgnores === 0 && openRate > 60) trend = 'improving';
  if (consecutiveIgnores >= 3) trend = 'declining';

  // Determine risk level
  let riskLevel: EngagementScore['riskLevel'] = 'low';
  if (consecutiveIgnores >= 5 || openRate < 20) riskLevel = 'high';
  else if (consecutiveIgnores >= 3 || openRate < 40) riskLevel = 'medium';

  // Generate recommendations
  const recommendations: string[] = [];
  if (openRate < 30) {
    recommendations.push('Low open rate - try personalizing subject lines');
  }
  if (clickRate < 10 && openRate > 40) {
    recommendations.push('Good open rate but low clicks - add clearer calls-to-action');
  }
  if (consecutiveIgnores >= 3) {
    recommendations.push('Multiple consecutive ignores - consider changing send time or content');
  }
  if (avgTimeToOpen > 48) {
    recommendations.push('Slow response time - emails may not be urgent enough');
  }
  if (score >= 80) {
    recommendations.push('High engagement - maintain current strategy');
  }

  return {
    workflowId,
    employeeEmail: workflow.employeeEmail,
    employeeName: workflow.employeeName,
    score,
    grade,
    metrics: {
      emailsReceived,
      emailsOpened,
      emailsClicked,
      openRate: Math.round(openRate),
      clickRate: Math.round(clickRate),
      avgTimeToOpen: Math.round(avgTimeToOpen * 10) / 10,
      lastEngagement: lastEngagement ? new Date(lastEngagement) : undefined,
      consecutiveIgnores,
    },
    trend,
    riskLevel,
    recommendations,
  };
}

export function getAllEngagementScores(): EngagementScore[] {
  const workflows = getOnboardingWorkflows();
  const scores: EngagementScore[] = [];

  workflows.forEach(workflow => {
    const score = calculateEngagementScore(workflow.id);
    if (score) scores.push(score);
  });

  return scores.sort((a, b) => b.score - a.score);
}

export function getEngagementScoresByGrade(): Record<string, EngagementScore[]> {
  const scores = getAllEngagementScores();
  return {
    A: scores.filter(s => s.grade === 'A'),
    B: scores.filter(s => s.grade === 'B'),
    C: scores.filter(s => s.grade === 'C'),
    D: scores.filter(s => s.grade === 'D'),
    F: scores.filter(s => s.grade === 'F'),
  };
}

export function getHighRiskEmployees(): EngagementScore[] {
  return getAllEngagementScores().filter(s => s.riskLevel === 'high');
}

export function getEngagementStatistics() {
  const scores = getAllEngagementScores();
  
  if (scores.length === 0) {
    return {
      averageScore: 0,
      totalEmployees: 0,
      highEngagement: 0,
      mediumEngagement: 0,
      lowEngagement: 0,
      atRisk: 0,
    };
  }

  const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const highEngagement = scores.filter(s => s.score >= 80).length;
  const mediumEngagement = scores.filter(s => s.score >= 60 && s.score < 80).length;
  const lowEngagement = scores.filter(s => s.score < 60).length;
  const atRisk = scores.filter(s => s.riskLevel === 'high').length;

  return {
    averageScore: Math.round(averageScore),
    totalEmployees: scores.length,
    highEngagement,
    mediumEngagement,
    lowEngagement,
    atRisk,
  };
}
