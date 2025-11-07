import { useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollaborativeFeedbackPanel } from '@/components/feedback/CollaborativeFeedbackPanel';
import { CandidateComparisonReport } from '@/components/feedback/CandidateComparisonReport';
import { Users, BarChart3, Settings, TrendingUp } from 'lucide-react';

export default function CollaborativeFeedback() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [comparisonCandidateIds, setComparisonCandidateIds] = useState<string[]>([]);
  const [candidateIdInput, setCandidateIdInput] = useState('');
  const [comparisonInput, setComparisonInput] = useState('');

  const handleLoadCandidate = () => {
    if (candidateIdInput.trim()) {
      setSelectedCandidateId(candidateIdInput.trim());
    }
  };

  const handleLoadComparison = () => {
    if (comparisonInput.trim()) {
      const ids = comparisonInput.split(',').map(id => id.trim()).filter(Boolean);
      setComparisonCandidateIds(ids);
    }
  };

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Collaborative Feedback - ATS</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Collaborative Feedback</h1>
          <p className="text-muted-foreground">Multi-criteria candidate evaluation with team voting and consensus tracking</p>
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Multi-Criteria</p>
              <p className="text-xs text-muted-foreground mt-1">
                Rate candidates on customizable criteria with confidence levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Consensus Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Agreement Metrics</p>
              <p className="text-xs text-muted-foreground mt-1">
                Track team alignment and voting consensus in real-time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Comparison Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Side-by-Side</p>
              <p className="text-xs text-muted-foreground mt-1">
                Compare multiple candidates with aggregated team feedback
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback">Candidate Feedback</TabsTrigger>
            <TabsTrigger value="comparison">Comparison Report</TabsTrigger>
            <TabsTrigger value="settings">Rating Criteria</TabsTrigger>
          </TabsList>

          {/* Candidate Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Load Candidate for Feedback</CardTitle>
                <CardDescription>
                  Enter a candidate ID to view and provide collaborative feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter candidate ID (e.g., candidate-1)"
                    value={candidateIdInput}
                    onChange={(e) => setCandidateIdInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoadCandidate()}
                  />
                  <Button onClick={handleLoadCandidate}>Load Candidate</Button>
                </div>
              </CardContent>
            </Card>

            {selectedCandidateId ? (
              <CollaborativeFeedbackPanel
                candidateId={selectedCandidateId}
                candidateName={`Candidate ${selectedCandidateId}`}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a candidate ID above to start collaborative feedback</p>
                  <p className="text-sm mt-2">
                    Example: Try "candidate-1" or "candidate-2"
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comparison Report Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Load Candidates for Comparison</CardTitle>
                <CardDescription>
                  Enter multiple candidate IDs separated by commas to compare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter candidate IDs separated by commas (e.g., candidate-1, candidate-2)"
                    value={comparisonInput}
                    onChange={(e) => setComparisonInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoadComparison()}
                  />
                  <Button onClick={handleLoadComparison}>Compare</Button>
                </div>
              </CardContent>
            </Card>

            {comparisonCandidateIds.length > 0 ? (
              <CandidateComparisonReport candidateIds={comparisonCandidateIds} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter candidate IDs above to generate a comparison report</p>
                  <p className="text-sm mt-2">
                    Example: Try "candidate-1, candidate-2, candidate-3"
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rating Criteria Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rating Criteria Settings
                </CardTitle>
                <CardDescription>
                  Configure custom rating criteria for candidate evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Default Criteria</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>• Technical Skills</span>
                        <span className="text-muted-foreground">Weight: 0.25</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Problem Solving</span>
                        <span className="text-muted-foreground">Weight: 0.20</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Communication</span>
                        <span className="text-muted-foreground">Weight: 0.15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Cultural Fit</span>
                        <span className="text-muted-foreground">Weight: 0.15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Leadership Potential</span>
                        <span className="text-muted-foreground">Weight: 0.15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Growth Mindset</span>
                        <span className="text-muted-foreground">Weight: 0.10</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Custom criteria management will allow you to add, edit, and remove rating
                      criteria with custom weights and scales. This feature enables complete
                      customization of your evaluation framework to match your organization's
                      specific hiring needs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
