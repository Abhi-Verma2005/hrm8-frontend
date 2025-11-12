import type { AIReferenceCheckSession, InterviewTranscript, AIAnalysis } from '@/types/aiReferenceCheck';
import type { AITranscriptionSummary } from '@/types/aiReferenceReport';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function generateTranscriptionSummary(
  session: AIReferenceCheckSession,
  transcript: InterviewTranscript,
  analysis: AIAnalysis,
  candidateName: string,
  refereeInfo: {
    name: string;
    relationship: string;
    companyName: string;
    yearsKnown?: string;
  }
): Promise<AITranscriptionSummary> {
  try {
    console.log('Generating transcription summary for session:', session.id);

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-reference-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        sessionId: session.id,
        candidateId: session.candidateId,
        candidateName,
        refereeInfo,
        sessionDetails: {
          mode: session.mode,
          duration: session.duration || 0,
          completedAt: session.completedAt || new Date().toISOString(),
          questionsAsked: transcript.turns.filter(t => t.speaker === 'ai-recruiter').length,
        },
        transcript: transcript.turns,
        existingAnalysis: analysis,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error generating summary:', errorText);
      throw new Error(`Failed to generate summary: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (!data || !data.summary) {
      throw new Error('Invalid response from summary generation service');
    }

    const summary: AITranscriptionSummary = {
      ...data.summary,
      sessionId: session.id,
      candidateId: session.candidateId,
      candidateName,
      refereeInfo,
      sessionDetails: {
        mode: session.mode,
        duration: session.duration || 0,
        completedAt: session.completedAt || new Date().toISOString(),
        questionsAsked: transcript.turns.filter(t => t.speaker === 'ai-recruiter').length,
      },
      generatedAt: new Date().toISOString(),
      generatedBy: 'ai',
    };

    console.log('Successfully generated transcription summary');
    return summary;
  } catch (error) {
    console.error('Error in generateTranscriptionSummary:', error);
    throw error;
  }
}

export function calculateReportCompleteness(summary: AITranscriptionSummary): number {
  let score = 0;
  const maxScore = 10;

  if (summary.executiveSummary && summary.executiveSummary.length > 100) score += 2;
  if (summary.keyFindings.strengths.length > 0) score += 1;
  if (summary.keyFindings.concerns.length > 0) score += 1;
  if (summary.categoryBreakdown.length >= 4) score += 2;
  if (summary.conversationHighlights.length >= 3) score += 2;
  if (summary.recommendation.reasoningSummary && summary.recommendation.reasoningSummary.length > 50) score += 2;

  return Math.round((score / maxScore) * 100);
}

export function getRecommendationLabel(recommendation: AITranscriptionSummary['recommendation']['hiringRecommendation']): string {
  const labels: Record<typeof recommendation, string> = {
    'strongly-recommend': 'Strongly Recommend',
    'recommend': 'Recommend',
    'neutral': 'Neutral',
    'concerns': 'Some Concerns',
    'not-recommend': 'Not Recommended',
  };
  return labels[recommendation];
}

export function getRecommendationColor(recommendation: AITranscriptionSummary['recommendation']['hiringRecommendation']): string {
  const colors: Record<typeof recommendation, string> = {
    'strongly-recommend': 'text-green-600 dark:text-green-400',
    'recommend': 'text-blue-600 dark:text-blue-400',
    'neutral': 'text-yellow-600 dark:text-yellow-400',
    'concerns': 'text-orange-600 dark:text-orange-400',
    'not-recommend': 'text-red-600 dark:text-red-400',
  };
  return colors[recommendation];
}

export function getSeverityColor(severity: 'critical' | 'moderate' | 'minor'): string {
  const colors = {
    critical: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    moderate: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
    minor: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
  };
  return colors[severity];
}
