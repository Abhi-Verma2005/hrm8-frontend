import { useParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timeline } from '@/components/ui/timeline';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Download, Send, Ban, ClipboardCheck, 
  Clock, Calendar, User, Briefcase, Target, Award,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { getAssessmentById, getAssessmentsByJob } from '@/lib/mockAssessmentStorage';
import { AssessmentType, AssessmentStatus } from '@/types/assessment';
import { format } from 'date-fns';

const getStatusBadgeVariant = (status: AssessmentStatus) => {
  switch (status) {
    case 'completed': return 'default';
    case 'in-progress': return 'secondary';
    case 'invited': return 'outline';
    case 'expired': return 'destructive';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getAssessmentTypeIcon = (type: AssessmentType) => {
  switch (type) {
    case 'cognitive': return '🧠';
    case 'personality': return '👤';
    case 'technical-skills': return '💻';
    case 'situational-judgment': return '🎯';
    case 'behavioral': return '🤝';
    case 'culture-fit': return '🏢';
    default: return '📋';
  }
};

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const assessment = id ? getAssessmentById(id) : undefined;
  const jobAssessments = assessment?.jobId ? getAssessmentsByJob(assessment.jobId) : [];
  const otherCandidates = jobAssessments.filter(a => a.id !== id && a.status === 'completed' && a.overallScore);

  if (!assessment) {
    return (
      <DashboardPageLayout title="Assessment Not Found">
        <Card className="p-6">
          <p className="text-muted-foreground">The requested assessment could not be found.</p>
          <Button onClick={() => navigate('/assessments')} className="mt-4">
            Back to Assessments
          </Button>
        </Card>
      </DashboardPageLayout>
    );
  }

  const timelineItems = [
    {
      id: '1',
      title: 'Assessment Created',
      description: `Created by ${assessment.invitedByName}`,
      timestamp: new Date(assessment.createdAt),
      variant: 'default' as const,
    },
    {
      id: '2',
      title: 'Invitation Sent',
      description: `Sent to ${assessment.candidateEmail}`,
      timestamp: new Date(assessment.invitedDate),
      variant: 'default' as const,
    },
    ...(assessment.status === 'in-progress' || assessment.status === 'completed' ? [{
      id: '3',
      title: 'Assessment Started',
      description: 'Candidate began the assessment',
      timestamp: new Date(assessment.invitedDate),
      variant: 'default' as const,
    }] : []),
    ...(assessment.completedDate ? [{
      id: '4',
      title: 'Assessment Completed',
      description: `Score: ${assessment.overallScore}%`,
      timestamp: new Date(assessment.completedDate),
      variant: assessment.passed ? 'success' as const : 'destructive' as const,
    }] : []),
    ...(assessment.status === 'expired' ? [{
      id: '5',
      title: 'Assessment Expired',
      description: 'Deadline passed without completion',
      timestamp: new Date(assessment.expiryDate),
      variant: 'destructive' as const,
    }] : []),
  ];

  const avgScore = otherCandidates.length > 0 
    ? otherCandidates.reduce((sum, a) => sum + (a.overallScore || 0), 0) / otherCandidates.length 
    : null;

  const scoreComparison = assessment.overallScore && avgScore 
    ? assessment.overallScore - avgScore 
    : null;

  return (
    <DashboardPageLayout
      title="Assessment Details"
      breadcrumbActions={
        <Button variant="ghost" onClick={() => navigate('/assessments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                {getAssessmentTypeIcon(assessment.assessmentType)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{assessment.candidateName}</h2>
                <p className="text-muted-foreground">{assessment.candidateEmail}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusBadgeVariant(assessment.status)}>
                    {assessment.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {assessment.assessmentType.replace(/-/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {assessment.status === 'completed' && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
              {(assessment.status === 'invited' || assessment.status === 'pending-invitation') && (
                <>
                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Resend Invitation
                  </Button>
                  <Button variant="outline">
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Invited By</p>
                <p className="text-sm font-medium">{assessment.invitedByName}</p>
              </div>
            </div>
            {assessment.jobTitle && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Job Position</p>
                  <p className="text-sm font-medium">{assessment.jobTitle}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Invited Date</p>
                <p className="text-sm font-medium">{format(new Date(assessment.invitedDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="text-sm font-medium">{format(new Date(assessment.expiryDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Section - Only show if completed */}
        {assessment.status === 'completed' && assessment.result && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Assessment Results</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {assessment.overallScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  {assessment.passed !== undefined && (
                    <Badge variant={assessment.passed ? 'default' : 'destructive'} className="mt-2">
                      {assessment.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  )}
                </div>
              </Card>

              {assessment.result.percentile && (
                <Card className="p-4 bg-muted/50">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {assessment.result.percentile}th
                    </div>
                    <p className="text-sm text-muted-foreground">Percentile Rank</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Better than {assessment.result.percentile}% of candidates
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-4 bg-muted/50">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {assessment.result.timeSpent}
                  </div>
                  <p className="text-sm text-muted-foreground">Minutes Taken</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed on {format(new Date(assessment.result.completedDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </Card>
            </div>

            {/* Category Scores */}
            {assessment.result.details?.categoryScores && (
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Category Breakdown</h4>
                <div className="space-y-4">
                  {Object.entries(assessment.result.details.categoryScores).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{category.replace(/-/g, ' ')}</span>
                        <span className="text-sm font-bold">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              {assessment.result.details?.strengths && assessment.result.details.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-success">
                    <Award className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {assessment.result.details.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-success mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {assessment.result.details?.weaknesses && assessment.result.details.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-warning">
                    <Target className="h-4 w-4" />
                    Areas for Development
                  </h4>
                  <ul className="space-y-2">
                    {assessment.result.details.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-warning mt-0.5">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {assessment.result.details?.recommendations && assessment.result.details.recommendations.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {assessment.result.details.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Comparison with Other Candidates */}
        {otherCandidates.length > 0 && assessment.overallScore && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Comparison with Other Candidates</h3>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Performance vs Average</span>
                {scoreComparison !== null && (
                  <div className="flex items-center gap-2">
                    {scoreComparison > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : scoreComparison < 0 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={scoreComparison > 0 ? 'text-success font-semibold' : scoreComparison < 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                      {scoreComparison > 0 ? '+' : ''}{scoreComparison.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              {avgScore && (
                <p className="text-sm text-muted-foreground mb-4">
                  This candidate scored {assessment.overallScore}% compared to the average of {avgScore.toFixed(1)}% 
                  across {otherCandidates.length} other candidate{otherCandidates.length > 1 ? 's' : ''} for this position.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Other Candidates ({otherCandidates.length})</h4>
              {otherCandidates.slice(0, 5).map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{candidate.candidateName}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed {format(new Date(candidate.completedDate!), 'MMM d')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{candidate.overallScore}%</div>
                    <Badge variant={candidate.passed ? 'default' : 'secondary'} className="text-xs">
                      {candidate.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              ))}
              {otherCandidates.length > 5 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  + {otherCandidates.length - 5} more candidate{otherCandidates.length - 5 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Assessment Timeline</h3>
          </div>
          <Timeline items={timelineItems} />
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
