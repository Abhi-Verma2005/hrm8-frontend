import type { Application, ApplicationStatus, ApplicationStage, ParsedResume } from '@/types/application';
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
    linkedInUrl: candidate.linkedInUrl,
    
    // Add parsed resume data for some applications
    parsedResume: i % 3 === 0 ? {
      workHistory: [
        {
          id: `work-${i}-1`,
          company: i % 2 === 0 ? 'TechCorp Inc.' : 'Digital Solutions Ltd.',
          title: candidate.currentPosition || 'Software Engineer',
          startDate: new Date(Date.now() - (candidate.experienceYears * 365 + 100) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          current: false,
          location: candidate.location,
          employmentType: 'full-time',
          responsibilities: [
            'Led development of core product features used by 100K+ users',
            'Mentored junior developers and conducted code reviews',
            'Collaborated with cross-functional teams to deliver projects on time',
            'Optimized application performance, reducing load time by 40%'
          ],
          achievements: [
            'Received Employee of the Quarter award for outstanding performance',
            'Successfully launched 3 major product releases with zero critical bugs',
            'Improved test coverage from 60% to 95%'
          ],
          technologies: candidate.skills.slice(0, 5),
          reasonForLeaving: 'Seeking new challenges and growth opportunities'
        },
        {
          id: `work-${i}-2`,
          company: 'StartupCo',
          title: i % 2 === 0 ? 'Junior Developer' : 'Developer',
          startDate: new Date(Date.now() - (candidate.experienceYears * 365 + 1500) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - (candidate.experienceYears * 365 + 100) * 24 * 60 * 60 * 1000),
          current: false,
          location: candidate.city || 'Remote',
          employmentType: 'full-time',
          responsibilities: [
            'Developed and maintained web applications using modern frameworks',
            'Participated in agile development process and daily standups',
            'Wrote unit tests and documented code',
            'Fixed bugs and implemented new features based on user feedback'
          ],
          achievements: [
            'Reduced page load time by 30% through optimization',
            'Implemented automated testing pipeline'
          ],
          technologies: candidate.skills.slice(2, 7),
        },
        {
          id: `work-${i}-3`,
          company: 'Current Company',
          title: candidate.currentPosition || 'Senior Software Engineer',
          startDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          current: true,
          location: candidate.location,
          employmentType: 'full-time',
          responsibilities: [
            'Lead technical design and architecture decisions',
            'Manage team of 5 engineers',
            'Drive technical excellence and best practices',
            'Collaborate with product and design teams'
          ],
          achievements: [
            'Led migration to microservices architecture',
            'Reduced deployment time from 2 hours to 15 minutes',
            'Improved system reliability to 99.9% uptime'
          ],
          technologies: candidate.skills.slice(0, 8),
        }
      ],
      education: [
        {
          id: `edu-${i}-1`,
          institution: i % 3 === 0 ? 'Stanford University' : i % 3 === 1 ? 'MIT' : 'UC Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: new Date(Date.now() - (candidate.experienceYears * 365 + 2000) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - (candidate.experienceYears * 365 + 1500) * 24 * 60 * 60 * 1000),
          gpa: 3.7 + Math.random() * 0.3,
          maxGpa: 4.0,
          honors: i % 2 === 0 ? 'Magna Cum Laude' : 'Cum Laude',
          relevantCoursework: [
            'Data Structures',
            'Algorithms',
            'Software Engineering',
            'Database Systems',
            'Machine Learning'
          ],
          thesisTitle: i % 2 === 0 ? 'Optimizing Neural Networks for Edge Computing' : undefined
        }
      ],
      skills: candidate.skills.map((skill, idx) => ({
        name: skill,
        category: idx % 3 === 0 ? 'Frontend' : idx % 3 === 1 ? 'Backend' : 'Tools',
        proficiency: idx % 4 === 0 ? 'expert' : idx % 4 === 1 ? 'advanced' : idx % 4 === 2 ? 'intermediate' : 'beginner',
        yearsExperience: Math.floor(Math.random() * candidate.experienceYears) + 1,
        lastUsed: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        endorsements: Math.floor(Math.random() * 20)
      })),
      certifications: i % 2 === 0 ? [
        {
          id: `cert-${i}-1`,
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
          credentialId: `AWS-${i}-${Math.random().toString(36).substring(7)}`,
          verificationUrl: 'https://aws.amazon.com/verification',
          description: 'Demonstrates expertise in designing distributed systems on AWS'
        },
        {
          id: `cert-${i}-2`,
          name: 'Certified Scrum Master',
          issuer: 'Scrum Alliance',
          issueDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          credentialId: `CSM-${i}-${Math.random().toString(36).substring(7)}`,
          description: 'Professional certification in Scrum methodology'
        }
      ] : [],
      summary: `Experienced ${candidate.currentPosition || 'software engineer'} with ${candidate.experienceYears}+ years of experience in building scalable web applications. Strong expertise in ${candidate.skills.slice(0, 3).join(', ')}. Passionate about clean code, best practices, and continuous learning. Proven track record of delivering high-quality solutions and leading technical initiatives.`,
      parsedAt: new Date(Date.now() - (i % 5) * 24 * 60 * 60 * 1000)
    } : undefined,
    
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
