import type { Application } from '@/types/application';

export interface ScoringCriteria {
  jobRequirements: string;
  weights: {
    skills: number;
    experience: number;
    education: number;
    cultural_fit: number;
  };
}

export interface BulkScoringProgress {
  total: number;
  completed: number;
  failed: number;
  currentCandidate?: string;
}

export interface BulkScoringResult {
  applicationId: string;
  candidateName: string;
  oldScore?: number;
  newScore: number;
  scoreDelta: number;
  success: boolean;
  error?: string;
}

// Mock AI scoring function - simulates scoring a single candidate
async function scoreCandidate(
  application: Application,
  criteria: ScoringCriteria
): Promise<number> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Mock scoring algorithm based on criteria weights
  const baseScore = Math.random() * 40 + 40; // 40-80 base
  const skillsBonus = criteria.weights.skills * 0.15;
  const experienceBonus = criteria.weights.experience * 0.1;
  const educationBonus = criteria.weights.education * 0.05;
  
  const newScore = Math.min(100, Math.max(0, 
    baseScore + skillsBonus + experienceBonus + educationBonus
  ));
  
  return Math.round(newScore);
}

export async function bulkScoreCandidates(
  applications: Application[],
  criteria: ScoringCriteria,
  onProgress: (progress: BulkScoringProgress) => void
): Promise<BulkScoringResult[]> {
  const results: BulkScoringResult[] = [];
  let completed = 0;
  let failed = 0;

  for (const application of applications) {
    onProgress({
      total: applications.length,
      completed,
      failed,
      currentCandidate: application.candidateName,
    });

    try {
      const newScore = await scoreCandidate(application, criteria);
      const oldScore = application.aiMatchScore;
      
      results.push({
        applicationId: application.id,
        candidateName: application.candidateName,
        oldScore,
        newScore,
        scoreDelta: oldScore ? newScore - oldScore : 0,
        success: true,
      });
      
      completed++;
    } catch (error) {
      results.push({
        applicationId: application.id,
        candidateName: application.candidateName,
        oldScore: application.aiMatchScore,
        newScore: application.aiMatchScore || 0,
        scoreDelta: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      failed++;
    }
  }

  onProgress({
    total: applications.length,
    completed,
    failed,
  });

  return results;
}

export function getScoreChangeLabel(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return 'No change';
}

export function getScoreChangeColor(delta: number): string {
  if (delta > 10) return 'text-green-600 dark:text-green-400';
  if (delta > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (delta < -10) return 'text-red-600 dark:text-red-400';
  if (delta < 0) return 'text-orange-600 dark:text-orange-400';
  return 'text-muted-foreground';
}
