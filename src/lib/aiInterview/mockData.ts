import type { AIInterviewSession, TranscriptEntry } from '@/types/aiInterview';
import type { InterviewReport, ReportComment } from '@/types/aiInterviewReport';
import { generateQuestionsForJob } from './questionGenerator';

export function generateMockTranscript(): TranscriptEntry[] {
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      speaker: 'ai',
      content: 'Hello! Thank you for joining this AI interview. I\'m excited to learn more about you. Are you ready to begin?',
      duration: 5
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 590000).toISOString(),
      speaker: 'candidate',
      content: 'Yes, I\'m ready. Thank you for having me.',
      duration: 3
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 580000).toISOString(),
      speaker: 'ai',
      content: 'Great! Let\'s start with your background. Can you walk me through a complex technical problem you solved recently?',
      duration: 4
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 570000).toISOString(),
      speaker: 'candidate',
      content: 'Sure. In my last project, we had a performance issue where our API was taking 3-4 seconds to respond. I analyzed the database queries and found we were making multiple redundant calls. I implemented query batching and caching, which reduced response time to under 500ms.',
      duration: 15
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 550000).toISOString(),
      speaker: 'ai',
      content: 'That\'s impressive! What alternative approaches did you consider?',
      duration: 3
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 545000).toISOString(),
      speaker: 'candidate',
      content: 'We considered horizontal scaling and switching to a different database, but those were more expensive solutions. The query optimization gave us the best ROI.',
      duration: 8
    }
  ];
}

export function generateMockSessions(): AIInterviewSession[] {
  return [
    {
      id: 'ai-int-1',
      candidateId: 'cand-1',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@email.com',
      applicationId: 'app-1',
      jobId: 'job-1',
      jobTitle: 'Senior Software Engineer',
      status: 'completed',
      scheduledDate: new Date(Date.now() - 86400000).toISOString(),
      startedAt: new Date(Date.now() - 82800000).toISOString(),
      completedAt: new Date(Date.now() - 79200000).toISOString(),
      duration: 3600,
      interviewMode: 'video',
      questionSource: 'hybrid',
      questions: generateQuestionsForJob('Senior Software Engineer', 10),
      currentQuestionIndex: 10,
      transcript: generateMockTranscript(),
      analysis: {
        overallScore: 85,
        categoryScores: {
          technical: 88,
          communication: 90,
          culturalFit: 82,
          experience: 85,
          problemSolving: 87
        },
        strengths: [
          'Strong technical problem-solving skills',
          'Excellent communication and articulation',
          'Proven experience with performance optimization',
          'Good understanding of cost-benefit analysis'
        ],
        concerns: [
          'Limited experience with distributed systems',
          'Could elaborate more on leadership examples'
        ],
        redFlags: [],
        keyHighlights: [
          {
            quote: 'I implemented query batching and caching, which reduced response time to under 500ms',
            context: 'Discussing technical problem-solving',
            sentiment: 'positive'
          },
          {
            quote: 'The query optimization gave us the best ROI',
            context: 'Evaluating alternative solutions',
            sentiment: 'positive'
          }
        ],
        recommendation: 'recommend',
        confidenceScore: 88,
        summary: 'Strong technical candidate with excellent problem-solving skills and communication abilities. Demonstrates practical experience and cost-conscious decision making.'
      },
      reportId: 'report-1',
      invitationToken: 'token-123',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 79200000).toISOString(),
      createdBy: 'user-1'
    },
    {
      id: 'ai-int-2',
      candidateId: 'cand-2',
      candidateName: 'Michael Chen',
      candidateEmail: 'michael.c@email.com',
      jobId: 'job-2',
      jobTitle: 'Product Manager',
      status: 'scheduled',
      scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      interviewMode: 'video',
      questionSource: 'predefined',
      questions: generateQuestionsForJob('Product Manager', 8),
      currentQuestionIndex: 0,
      transcript: [],
      invitationToken: 'token-456',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
      createdBy: 'user-1'
    },
    {
      id: 'ai-int-3',
      candidateId: 'cand-3',
      candidateName: 'Emily Rodriguez',
      candidateEmail: 'emily.r@email.com',
      jobId: 'job-1',
      jobTitle: 'Senior Software Engineer',
      status: 'in-progress',
      scheduledDate: new Date(Date.now() - 1800000).toISOString(),
      startedAt: new Date(Date.now() - 900000).toISOString(),
      interviewMode: 'text',
      questionSource: 'ai-generated',
      questions: generateQuestionsForJob('Senior Software Engineer', 10),
      currentQuestionIndex: 4,
      transcript: generateMockTranscript().slice(0, 4),
      invitationToken: 'token-789',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
      createdBy: 'user-2'
    }
  ];
}

export function generateMockReports(): InterviewReport[] {
  return [
    {
      id: 'report-1',
      sessionId: 'ai-int-1',
      candidateId: 'cand-1',
      candidateName: 'Sarah Johnson',
      jobId: 'job-1',
      jobTitle: 'Senior Software Engineer',
      status: 'finalized',
      version: 2,
      executiveSummary: 'Sarah demonstrated strong technical capabilities and excellent communication skills throughout the interview. Her experience in performance optimization and practical problem-solving approach makes her a strong candidate for the Senior Software Engineer position.',
      analysis: {
        overallScore: 85,
        categoryScores: {
          technical: 88,
          communication: 90,
          culturalFit: 82,
          experience: 85,
          problemSolving: 87
        },
        strengths: [
          'Strong technical problem-solving skills',
          'Excellent communication and articulation',
          'Proven experience with performance optimization'
        ],
        concerns: ['Limited experience with distributed systems'],
        redFlags: [],
        keyHighlights: [],
        recommendation: 'recommend',
        confidenceScore: 88,
        summary: 'Strong technical candidate with excellent problem-solving skills.'
      },
      recommendations: 'Move forward to technical panel interview. Focus on distributed systems architecture in next round.',
      nextSteps: 'Schedule technical panel interview with senior engineers. Prepare system design scenarios.',
      isShared: true,
      sharedWith: ['user-2', 'user-3'],
      permissions: [
        {
          userId: 'user-2',
          userName: 'John Smith',
          level: 'comment',
          grantedAt: new Date(Date.now() - 43200000).toISOString(),
          grantedBy: 'user-1'
        }
      ],
      createdAt: new Date(Date.now() - 79200000).toISOString(),
      updatedAt: new Date(Date.now() - 36000000).toISOString(),
      createdBy: 'user-1',
      finalizedAt: new Date(Date.now() - 36000000).toISOString(),
      finalizedBy: 'user-1'
    }
  ];
}

export function generateMockComments(): ReportComment[] {
  return [
    {
      id: 'comment-1',
      reportId: 'report-1',
      userId: 'user-2',
      userName: 'John Smith',
      content: 'Great interview! I agree with the recommendation. @JaneD we should move quickly on this candidate.',
      mentions: ['user-3'],
      replies: [
        {
          id: 'comment-2',
          reportId: 'report-1',
          userId: 'user-3',
          userName: 'Jane Doe',
          content: 'Agreed! I\'ll schedule the panel interview for next week.',
          mentions: [],
          parentId: 'comment-1',
          replies: [],
          createdAt: new Date(Date.now() - 28800000).toISOString(),
          isEdited: false
        }
      ],
      createdAt: new Date(Date.now() - 36000000).toISOString(),
      isEdited: false
    }
  ];
}
