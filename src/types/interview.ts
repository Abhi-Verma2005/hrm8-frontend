export interface InterviewParticipant {
  userId: string;
  name: string;
  email: string;
  role: 'interviewer' | 'organizer' | 'observer';
  responseStatus: 'pending' | 'accepted' | 'declined';
}

export interface InterviewFeedback {
  interviewerId: string;
  interviewerName: string;
  technicalSkills?: number;
  communication?: number;
  cultureFit?: number;
  problemSolving?: number;
  overallRating: number;
  strengths: string;
  concerns: string;
  recommendation: 'strong-yes' | 'yes' | 'maybe' | 'no' | 'strong-no';
  notes: string;
  submittedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewers: InterviewParticipant[];
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: 'phone' | 'video' | 'in-person' | 'panel';
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  agenda?: string;
  feedback: InterviewFeedback[];
  rating?: number;
  recommendation?: 'strong-yes' | 'yes' | 'maybe' | 'no' | 'strong-no';
  recordingUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
