import { v4 as uuidv4 } from 'uuid';
import type { RefereeDetails, ReferenceResponse, QuestionAnswer } from '@/types/referee';
import {
  saveReferee,
  updateReferee,
  getRefereeByToken,
  getRefereesByBackgroundCheck
} from './refereeStorage';
import { updateBackgroundCheck } from '@/lib/mockBackgroundCheckStorage';
import { generateRefereeInvitationEmail } from './emailTemplates';

export function generateRefereeToken(): string {
  return `referee_${uuidv4()}_${Date.now()}`;
}

export function createReferee(
  candidateId: string,
  backgroundCheckId: string,
  refereeData: Omit<RefereeDetails, 'id' | 'candidateId' | 'backgroundCheckId' | 'token' | 'status' | 'createdAt' | 'updatedAt'>
): RefereeDetails {
  const referee: RefereeDetails = {
    ...refereeData,
    id: uuidv4(),
    candidateId,
    backgroundCheckId,
    token: generateRefereeToken(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  saveReferee(referee);
  return referee;
}

export function inviteReferee(
  referee: RefereeDetails,
  candidateName: string
): void {
  const questionnaireUrl = `${window.location.origin}/reference/${referee.token}`;
  const emailHtml = generateRefereeInvitationEmail(referee, candidateName, questionnaireUrl);
  
  // Simulate sending email
  console.log('📧 Sending referee invitation to:', referee.email);
  console.log('Questionnaire URL:', questionnaireUrl);
  console.log('Email HTML:', emailHtml);
  
  // Update referee status
  updateReferee(referee.id, {
    status: 'invited',
    invitedDate: new Date().toISOString()
  });
}

export function validateRefereeToken(token: string): boolean {
  const referee = getRefereeByToken(token);
  
  if (!referee) return false;
  if (referee.status === 'completed') return false;
  
  // Check if overdue (14 days)
  if (referee.invitedDate) {
    const invitedDate = new Date(referee.invitedDate);
    const now = new Date();
    const daysSinceInvite = Math.floor((now.getTime() - invitedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceInvite > 14) {
      updateReferee(referee.id, { status: 'overdue' });
      return false;
    }
  }
  
  return true;
}

export function markRefereeQuestionnaireOpened(token: string): void {
  const referee = getRefereeByToken(token);
  if (referee && referee.status === 'invited') {
    updateReferee(referee.id, { status: 'opened' });
  }
}

export function markRefereeQuestionnaireInProgress(token: string): void {
  const referee = getRefereeByToken(token);
  if (referee && (referee.status === 'invited' || referee.status === 'opened')) {
    updateReferee(referee.id, { status: 'in-progress' });
  }
}

export function submitReferenceResponse(
  token: string,
  questionnaireTemplateId: string,
  answers: QuestionAnswer[],
  ipAddress: string = '0.0.0.0',
  completionTime?: number
): void {
  const referee = getRefereeByToken(token);
  if (!referee) throw new Error('Referee not found');
  if (referee.status === 'completed') throw new Error('Response already submitted');
  
  const overallRating = calculateOverallRating(answers);
  
  const response: ReferenceResponse = {
    refereeId: referee.id,
    questionnaireTemplateId,
    answers,
    overallRating,
    submittedAt: new Date().toISOString(),
    ipAddress,
    completionTime
  };
  
  // Update referee with response
  updateReferee(referee.id, {
    status: 'completed',
    completedDate: new Date().toISOString(),
    response
  });
  
  // Check if all referees are completed
  checkAllRefereesCompleted(referee.backgroundCheckId);
  
  console.log('✅ Reference response submitted:', referee.id);
}

export function calculateOverallRating(answers: QuestionAnswer[]): number {
  const ratingAnswers = answers.filter(a => a.type === 'rating' && typeof a.value === 'number');
  
  if (ratingAnswers.length === 0) return 0;
  
  const sum = ratingAnswers.reduce((total, answer) => total + (answer.value as number), 0);
  return Math.round((sum / ratingAnswers.length) * 10) / 10; // Round to 1 decimal
}

export function checkAllRefereesCompleted(backgroundCheckId: string): void {
  const referees = getRefereesByBackgroundCheck(backgroundCheckId);
  const allCompleted = referees.every(r => r.status === 'completed');
  
  if (allCompleted && referees.length > 0) {
    // Update background check status
    const completedResults = referees
      .filter(r => r.response)
      .map(r => ({
        checkType: 'reference' as const,
        status: 'clear' as const,
        details: `Reference from ${r.name} (${r.relationship})`,
        completedDate: r.completedDate
      }));
    
    updateBackgroundCheck(backgroundCheckId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      results: completedResults
    });
    
    console.log('✅ All referees completed for background check:', backgroundCheckId);
  }
}

export function getAggregateRatings(backgroundCheckId: string): {
  averageRating: number;
  totalResponses: number;
  wouldRehireCount: number;
} {
  const referees = getRefereesByBackgroundCheck(backgroundCheckId);
  const completed = referees.filter(r => r.status === 'completed' && r.response);
  
  if (completed.length === 0) {
    return { averageRating: 0, totalResponses: 0, wouldRehireCount: 0 };
  }
  
  const totalRating = completed.reduce((sum, r) => sum + (r.response?.overallRating || 0), 0);
  const averageRating = totalRating / completed.length;
  
  // Count "would rehire" yes answers
  const wouldRehireCount = completed.filter(r => {
    const rehireAnswer = r.response?.answers.find(a => 
      a.question.toLowerCase().includes('re-hire') && a.value === true
    );
    return !!rehireAnswer;
  }).length;
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalResponses: completed.length,
    wouldRehireCount
  };
}
