import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  getCandidateFeedback,
  calculateConsensusMetrics,
  getCandidateVotes,
  getCandidateDecisionHistory,
  getRecommendationColor,
  getRecommendationLabel,
  getRatingCriteria,
} from '@/lib/collaborativeFeedbackService';
import { TeamMemberFeedback, ConsensusMetrics } from '@/types/collaborativeFeedback';
import { CollaborativeFeedbackForm } from './CollaborativeFeedbackForm';
import { TeamVoting } from './TeamVoting';
import { DecisionRecorder } from './DecisionRecorder';
import { VotingPanel } from './VotingPanel';
import { TeamConsensusView } from './TeamConsensusView';
import { FeedbackFilterBar } from './FeedbackFilterBar';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, AlertCircle, MessageSquare, TrendingUp, Users } from 'lucide-react';

interface CollaborativeFeedbackPanelProps {
  candidateId: string;
  candidateName: string;
  applicationId?: string;
}

export function CollaborativeFeedbackPanel({
  candidateId,
  candidateName,
  applicationId,
}: CollaborativeFeedbackPanelProps) {
  const [feedback, setFeedback] = useState<TeamMemberFeedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<TeamMemberFeedback[]>([]);
  const [consensus, setConsensus] = useState<ConsensusMetrics | null>(null);
  const [showForm, setShowForm] = useState(false);
  const criteria = getRatingCriteria();

  const loadData = () => {
    const feedbackData = getCandidateFeedback(candidateId);
    const consensusData = calculateConsensusMetrics(candidateId);
    setFeedback(feedbackData);
    setFilteredFeedback(feedbackData);
    setConsensus(consensusData);
  };

  useEffect(() => {
    loadData();
  }, [candidateId]);

  return (
    <div className="space-y-6">
      {/* Consensus Overview */}
      {consensus && consensus.totalFeedbacks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Team Consensus
            </CardTitle>
            <CardDescription>Aggregated team feedback and alignment metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{consensus.averageScore.toFixed(1)}</p>
                <Progress value={consensus.averageScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Agreement Level</p>
                <p className="text-3xl font-bold">{(consensus.agreementLevel * 100).toFixed(0)}%</p>
                <Progress value={consensus.agreementLevel * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-3xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  {consensus.totalFeedbacks}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Std Deviation</p>
                <p className="text-3xl font-bold">{consensus.scoreStdDev.toFixed(1)}</p>
              </div>
            </div>

            {/* Recommendation Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Recommendation Distribution</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(consensus.recommendationDistribution).map(([rec, count]) => (
                  <Badge key={rec} className={getRecommendationColor(rec)}>
                    {getRecommendationLabel(rec)}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Criteria Averages */}
            <div>
              <h4 className="font-semibold mb-3">Criteria Averages</h4>
              <div className="space-y-3">
                {criteria.map(criterion => {
                  const avg = consensus.criteriaAverages[criterion.id] || 0;
                  return (
                    <div key={criterion.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{criterion.name}</span>
                        <span className="text-sm font-bold">{avg.toFixed(1)}/10</span>
                      </div>
                      <Progress value={avg * 10} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Strengths & Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  Top Strengths
                </h4>
                <ul className="space-y-1">
                  {consensus.topStrengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Top Concerns
                </h4>
                <ul className="space-y-1">
                  {consensus.topConcerns.slice(0, 3).map((concern, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {concern}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feedback">Team Feedback ({feedback.length})</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="decision">Decision</TabsTrigger>
          <TabsTrigger value="provide">Provide Feedback</TabsTrigger>
        </TabsList>

        {/* Individual Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {feedback.length > 0 && (
            <FeedbackFilterBar
              feedback={feedback}
              onFilteredChange={setFilteredFeedback}
            />
          )}
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No feedback yet. Be the first to provide feedback!
              </CardContent>
            </Card>
          ) : (
            filteredFeedback.map((fb) => (
              <Card key={fb.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{fb.reviewerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{fb.reviewerName}</CardTitle>
                        <CardDescription>
                          {fb.reviewerRole} • {formatDistanceToNow(new Date(fb.submittedAt), { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{fb.overallScore}</div>
                      <Badge className={getRecommendationColor(fb.recommendation)}>
                        {getRecommendationLabel(fb.recommendation)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ratings */}
                  <div>
                    <h4 className="font-semibold mb-2">Ratings</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {fb.ratings.map((rating) => {
                        const criterion = criteria.find(c => c.id === rating.criterionId);
                        return (
                          <div key={rating.criterionId} className="flex justify-between items-center p-2 bg-muted rounded">
                            <span className="text-sm">{criterion?.name}</span>
                            <span className="font-bold">{rating.value}/10</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments */}
                  {fb.comments.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comments
                      </h4>
                      <div className="space-y-2">
                        {fb.comments.map((comment) => (
                          <div key={comment.id} className="p-3 border rounded-lg">
                            <div className="flex gap-2 mb-1">
                              <Badge variant="outline">{comment.type}</Badge>
                              <Badge variant="secondary">{comment.importance}</Badge>
                              {comment.category && <Badge variant="secondary">{comment.category}</Badge>}
                            </div>
                            <p className="text-sm mt-2">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Confidence: {fb.confidence}/5</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Consensus Tab */}
        <TabsContent value="consensus" className="space-y-4">
          {consensus ? (
            <TeamConsensusView metrics={consensus} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No consensus data available yet. At least one feedback is required.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting">
          <VotingPanel
            candidateId={candidateId}
            candidateName={candidateName}
            onVoteCast={loadData}
          />
        </TabsContent>

        {/* Decision Tab */}
        <TabsContent value="decision">
          <DecisionRecorder
            candidateId={candidateId}
            candidateName={candidateName}
            onDecisionRecorded={loadData}
          />
        </TabsContent>

        {/* Provide Feedback Tab */}
        <TabsContent value="provide">
          <CollaborativeFeedbackForm
            candidateId={candidateId}
            candidateName={candidateName}
            applicationId={applicationId}
            onSubmitSuccess={() => {
              loadData();
              setShowForm(false);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
