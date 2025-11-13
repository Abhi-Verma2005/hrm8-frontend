import type { Application, ApplicationStatus, ApplicationStage } from '@/types/application';
import { mockCandidatesData } from './mockCandidatesData';
import { mockJobs } from './mockTableData';

const statuses: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'];

const stagesByStatus: Record<ApplicationStatus, ApplicationStage[]> = {
  applied: ['New Application', 'Resume Review'],
  screening: ['Phone Screen', 'Resume Review'],
  interview: ['Technical Interview', 'Manager Interview', 'Final Round'],
  offer: ['Reference Check', 'Offer Extended'],
  hired: ['Offer Accepted'],
  rejected: ['Rejected'],
  withdrawn: ['Withdrawn'],
};

export const mockApplicationsData: Application[] = [];

// Create 200+ applications linking candidates to jobs
for (let i = 0; i < 200; i++) {
  const candidate = mockCandidatesData[i % mockCandidatesData.length];
  const job = mockJobs[i % mockJobs.length];
  const status = statuses[i % statuses.length];
  const stageOptions = stagesByStatus[status];
  const stage = stageOptions[i % stageOptions.length];
  
  const daysAgo = i % 60;
  const appliedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const createdAt = appliedDate;
  const updatedAt = new Date(appliedDate.getTime() + (i % 10) * 24 * 60 * 60 * 1000);
  
  // AI Match Score: 45-98 range for variety
  const aiMatchScore = 45 + Math.floor(Math.random() * 54);
  
  // New applications (last 2 days)
  const isNew = daysAgo <= 2;
  
  // 30% of applications are unread
  const isRead = Math.random() > 0.3;
  
  // Generate sample tags based on application characteristics
  const tags: string[] = [];
  if (aiMatchScore >= 90) tags.push('High Potential');
  if (aiMatchScore >= 85 && aiMatchScore < 90) tags.push('Technical Expert');
  if (i % 3 === 0) tags.push('Culture Fit');
  if (i % 5 === 0) tags.push('Leadership Material');
  if (candidate.workArrangement === 'remote') tags.push('Remote Ready');
  if (stage === 'Final Round' || stage === 'Offer Extended') tags.push('Quick Learner');
  if (i % 7 === 0) tags.push('Team Player');
  if (daysAgo <= 5) tags.push('Immediate Start');
  if (i % 11 === 0) tags.push('Internal Referral');
  if (i % 13 === 0) tags.push('Diverse Candidate');

  const application: Application = {
    id: `app-${i + 1}`,
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    candidatePhoto: candidate.photo,
    jobId: job.id,
    jobTitle: job.title,
    employerName: job.employer,
    
    appliedDate,
    status,
    stage,
    
    resumeUrl: candidate.resumeUrl,
    coverLetterUrl: candidate.coverLetterUrl,
    portfolioUrl: candidate.portfolioUrl,
    
    customAnswers: [
      {
        questionId: 'q1',
        question: 'Why are you interested in this position?',
        answer: 'I am excited about this opportunity because it aligns perfectly with my career goals and technical expertise.',
      },
      {
        questionId: 'q2',
        question: 'What are your salary expectations?',
        answer: `$${candidate.salaryMin} - $${candidate.salaryMax}`,
      },
    ],
    
    score: i % 3 === 0 ? 60 + Math.floor(Math.random() * 40) : undefined,
    rating: i % 4 === 0 ? Math.floor(Math.random() * 3) + 3 : undefined,
    aiMatchScore,
    isRead,
    isNew,
    tags,
    
    notes: [],
    activities: [
      {
        id: `activity-${i}-1`,
        type: 'status_change',
        description: `Application status changed to ${status}`,
        userId: 'user-1',
        userName: 'System',
        createdAt: appliedDate,
      },
    ],
    
    interviews: status === 'interview' || status === 'offer' ? [
      {
        id: `interview-${i}-1`,
        type: i % 2 === 0 ? 'phone' : 'video',
        scheduledDate: new Date(appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        interviewers: ['John Manager', 'Jane Tech Lead'],
        location: i % 2 === 0 ? undefined : 'Conference Room A',
        meetingLink: i % 2 === 0 ? 'https://zoom.us/j/123456789' : undefined,
        status: 'completed',
        feedback: 'Strong candidate with excellent technical skills.',
        rating: 4,
      },
    ] : [],
    
    assignedTo: i % 3 === 0 ? 'recruiter-1' : i % 3 === 1 ? 'recruiter-2' : undefined,
    assignedToName: i % 3 === 0 ? 'John Recruiter' : i % 3 === 1 ? 'Jane Recruiter' : undefined,
    
    rejectionReason: status === 'rejected' ? 'Not enough experience with required technologies' : undefined,
    rejectionDate: status === 'rejected' ? updatedAt : undefined,
    
    createdAt,
    updatedAt,
  };

  mockApplicationsData.push(application);
}
