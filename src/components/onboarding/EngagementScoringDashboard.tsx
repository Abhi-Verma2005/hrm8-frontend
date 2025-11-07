import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getAllEngagementScores, 
  getEngagementStatistics,
  getHighRiskEmployees,
  type EngagementScore 
} from "@/lib/engagementScoring";
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle, Award, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EngagementScoringDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D' | 'F'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const scores = useMemo(() => getAllEngagementScores(), []);
  const stats = useMemo(() => getEngagementStatistics(), []);
  const highRisk = useMemo(() => getHighRiskEmployees(), []);

  const filteredScores = useMemo(() => {
    return scores.filter(score => {
      const matchesSearch = 
        score.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        score.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === 'all' || score.grade === gradeFilter;
      const matchesRisk = riskFilter === 'all' || score.riskLevel === riskFilter;
      return matchesSearch && matchesGrade && matchesRisk;
    });
  }, [scores, searchQuery, gradeFilter, riskFilter]);

  const getGradeBadge = (grade: EngagementScore['grade']) => {
    const colors = {
      A: 'bg-green-600',
      B: 'bg-blue-600',
      C: 'bg-yellow-600',
      D: 'bg-orange-600',
      F: 'bg-red-600',
    };
    return <Badge className={colors[grade]}>Grade {grade}</Badge>;
  };

  const getTrendIcon = (trend: EngagementScore['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskBadge = (risk: EngagementScore['riskLevel']) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600">Medium Risk</Badge>;
      default:
        return <Badge className="bg-green-600">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Engagement Scoring
        </h3>
        <p className="text-sm text-muted-foreground">
          Track employee email engagement with AI-powered scoring
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}/100</div>
            <Progress value={stats.averageScore} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highEngagement}</div>
            <p className="text-xs text-muted-foreground">
              Score 80+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Low Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowEngagement}</div>
            <p className="text-xs text-muted-foreground">
              Score below 60
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.atRisk}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Alert */}
      {highRisk.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Risk Employees Detected</AlertTitle>
          <AlertDescription>
            {highRisk.length} employee(s) have high risk engagement scores. Review their email preferences and consider personalized outreach.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="A">Grade A</SelectItem>
            <SelectItem value="B">Grade B</SelectItem>
            <SelectItem value="C">Grade C</SelectItem>
            <SelectItem value="D">Grade D</SelectItem>
            <SelectItem value="F">Grade F</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scores List */}
      {filteredScores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {scores.length === 0 
                ? "No engagement data yet. Send some emails to start tracking." 
                : "No employees match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredScores.map((score, index) => (
            <Card key={score.workflowId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-bold">
                      #{index + 1}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {score.employeeName}
                        {getGradeBadge(score.grade)}
                        {getRiskBadge(score.riskLevel)}
                      </CardTitle>
                      <CardDescription>{score.employeeEmail}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(score.trend)}
                    <div className="text-right">
                      <p className="text-3xl font-bold">{score.score}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Engagement Level</span>
                    <span className="font-semibold">{score.score}/100</span>
                  </div>
                  <Progress value={score.score} className="h-3" />
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Received</p>
                    <p className="text-xl font-bold">{score.metrics.emailsReceived}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-xl font-bold text-blue-600">{score.metrics.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Click Rate</p>
                    <p className="text-xl font-bold text-purple-600">{score.metrics.clickRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-xl font-bold">{score.metrics.avgTimeToOpen}h</p>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Consecutive Ignores</span>
                    <Badge variant={score.metrics.consecutiveIgnores >= 3 ? "destructive" : "outline"}>
                      {score.metrics.consecutiveIgnores}
                    </Badge>
                  </div>
                  {score.metrics.lastEngagement && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Last Engagement</span>
                      <span className="font-medium">
                        {new Date(score.metrics.lastEngagement).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {score.recommendations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {score.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">How Engagement Scoring Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Score Calculation:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Open Rate: 40% weight - frequency of opening emails</li>
            <li>Click Rate: 30% weight - interaction with email content</li>
            <li>Response Time: 15% weight - how quickly they engage</li>
            <li>Consistency: 15% weight - engagement patterns over time</li>
          </ul>
          <p className="pt-2"><strong>Grades:</strong> A (90+), B (80-89), C (70-79), D (60-69), F (&lt;60)</p>
        </CardContent>
      </Card>
    </div>
  );
}
