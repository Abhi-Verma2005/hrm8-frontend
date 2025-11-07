import { Job } from "@/types/job";

export interface JobAnalytics {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplicants: number;
  averageApplicantsPerJob: number;
  totalViews: number;
  averageViewsPerJob: number;
  conversionRate: number;
  jobsByStatus: Record<string, number>;
  jobsByDepartment: Record<string, number>;
  jobsByLocation: Record<string, number>;
  jobsByEmploymentType: Record<string, number>;
  applicantsTrend: { date: string; count: number }[];
  viewsTrend: { date: string; count: number }[];
  timeToFill: { jobId: string; jobTitle: string; days: number }[];
  avgTimeToFill: number;
  topPerformingJobs: { jobId: string; jobTitle: string; applicants: number; views: number }[];
}

export interface RecruitmentMetrics {
  sourceEffectiveness: { source: string; applicants: number; hires: number; cost: number }[];
  timeToHireByStage: { stage: string; avgDays: number }[];
  offerAcceptanceRate: number;
  candidateDropoffRate: Record<string, number>;
  recruiterPerformance: { recruiterId: string; name: string; jobsFilled: number; avgTimeToFill: number }[];
}

export function getJobAnalytics(jobs: Job[]): JobAnalytics {
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const closedJobs = jobs.filter((j) => j.status === "closed" || j.status === "filled").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0);
  const totalViews = jobs.reduce((sum, j) => sum + j.viewsCount, 0);

  const jobsByStatus = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobsByDepartment = jobs.reduce((acc, job) => {
    acc[job.department] = (acc[job.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobsByLocation = jobs.reduce((acc, job) => {
    acc[job.location] = (acc[job.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobsByEmploymentType = jobs.reduce((acc, job) => {
    acc[job.employmentType] = (acc[job.employmentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mock trend data (last 30 days)
  const applicantsTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 50) + 10,
  }));

  const viewsTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 200) + 50,
  }));

  // Mock time to fill data
  const timeToFill = jobs
    .filter((j) => j.status === "filled")
    .slice(0, 10)
    .map((job) => ({
      jobId: job.id,
      jobTitle: job.title,
      days: Math.floor(Math.random() * 60) + 15,
    }));

  const avgTimeToFill = timeToFill.length > 0
    ? Math.round(timeToFill.reduce((sum, t) => sum + t.days, 0) / timeToFill.length)
    : 0;

  const topPerformingJobs = jobs
    .sort((a, b) => b.applicantsCount - a.applicantsCount)
    .slice(0, 10)
    .map((job) => ({
      jobId: job.id,
      jobTitle: job.title,
      applicants: job.applicantsCount,
      views: job.viewsCount,
    }));

  return {
    totalJobs,
    openJobs,
    closedJobs,
    totalApplicants,
    averageApplicantsPerJob: totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0,
    totalViews,
    averageViewsPerJob: totalJobs > 0 ? Math.round(totalViews / totalJobs) : 0,
    conversionRate: totalViews > 0 ? Math.round((totalApplicants / totalViews) * 100) : 0,
    jobsByStatus,
    jobsByDepartment,
    jobsByLocation,
    jobsByEmploymentType,
    applicantsTrend,
    viewsTrend,
    timeToFill,
    avgTimeToFill,
    topPerformingJobs,
  };
}

export function getRecruitmentMetrics(): RecruitmentMetrics {
  return {
    sourceEffectiveness: [
      { source: "LinkedIn", applicants: 145, hires: 12, cost: 2400 },
      { source: "Indeed", applicants: 98, hires: 8, cost: 1500 },
      { source: "Company Website", applicants: 67, hires: 9, cost: 0 },
      { source: "Referrals", applicants: 43, hires: 11, cost: 1100 },
      { source: "Job Boards", applicants: 89, hires: 6, cost: 1800 },
    ],
    timeToHireByStage: [
      { stage: "Application Review", avgDays: 3 },
      { stage: "Phone Screen", avgDays: 5 },
      { stage: "Technical Interview", avgDays: 7 },
      { stage: "Final Interview", avgDays: 4 },
      { stage: "Offer Process", avgDays: 6 },
    ],
    offerAcceptanceRate: 78,
    candidateDropoffRate: {
      "Application Submitted": 100,
      "Phone Screen": 65,
      "Technical Interview": 45,
      "Final Interview": 30,
      "Offer Sent": 20,
      "Offer Accepted": 15,
    },
    recruiterPerformance: [
      { recruiterId: "r1", name: "John Doe", jobsFilled: 12, avgTimeToFill: 32 },
      { recruiterId: "r2", name: "Jane Smith", jobsFilled: 15, avgTimeToFill: 28 },
      { recruiterId: "r3", name: "Bob Johnson", jobsFilled: 9, avgTimeToFill: 35 },
      { recruiterId: "r4", name: "Alice Williams", jobsFilled: 11, avgTimeToFill: 30 },
    ],
  };
}
