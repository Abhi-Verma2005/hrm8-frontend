import { useState, useEffect } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Lightbulb, Activity, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPredictiveMetrics, getDepartmentComparisons, getSkillGaps, getWorkforceInsights } from '@/lib/advancedAnalyticsStorage';
import type { PredictiveMetric, DepartmentComparison, SkillGapAnalysis, WorkforceInsight } from '@/types/advancedAnalytics';

export default function AdvancedAnalytics() {
  const [predictiveMetrics, setPredictiveMetrics] = useState<PredictiveMetric[]>([]);
  const [departments, setDepartments] = useState<DepartmentComparison[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapAnalysis[]>([]);
  const [insights, setInsights] = useState<WorkforceInsight[]>([]);

  useEffect(() => {
    setPredictiveMetrics(getPredictiveMetrics());
    setDepartments(getDepartmentComparisons());
    setSkillGaps(getSkillGaps());
    setInsights(getWorkforceInsights());
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-success" />;
      case 'trend': return <Activity className="h-5 w-5 text-primary" />;
      default: return <AlertCircle className="h-5 w-5 text-warning" />;
    }
  };

  return (
    <DashboardPageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Predictive insights, workforce intelligence, and strategic recommendations
          </p>
        </div>

        {/* Predictive Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Trends</CardTitle>
            <CardDescription>Forecasted vs. current metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictiveMetrics.map(m => ({
                name: m.metricName.split(' ').slice(0, 2).join(' '),
                current: m.currentValue,
                predicted: m.predictedValue,
                confidence: m.confidence
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} name="Current Value" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Value" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Predictive Metrics Details */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Metrics</CardTitle>
            <CardDescription>AI-powered forecasts for key workforce indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveMetrics.map((metric) => (
                <div key={metric.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{metric.metricName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Predicted for {new Date(metric.predictedDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-lg font-semibold">{metric.currentValue}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Predicted</p>
                      <p className="text-lg font-semibold">{metric.predictedValue}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-lg font-semibold">{metric.confidence}%</p>
                    </div>
                  </div>
                  <Progress value={metric.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workforce Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Workforce Insights</CardTitle>
            <CardDescription>Actionable intelligence and strategic recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2">Suggested Actions:</p>
                          <ul className="space-y-1">
                            {insight.suggestedActions.map((action, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Metrics</CardTitle>
              <CardDescription>Performance and engagement scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performanceScore" fill="hsl(var(--chart-1))" name="Performance" />
                  <Bar dataKey="engagementScore" fill="hsl(var(--chart-2))" name="Engagement" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Radar</CardTitle>
              <CardDescription>Multi-dimensional performance view</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={departments}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="department" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="Performance" dataKey="performanceScore" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                  <Radar name="Engagement" dataKey="engagementScore" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance Comparison</CardTitle>
            <CardDescription>Detailed benchmarking across organizational units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Department</th>
                    <th className="text-right py-3 px-2 font-medium">Headcount</th>
                    <th className="text-right py-3 px-2 font-medium">Avg Salary</th>
                    <th className="text-right py-3 px-2 font-medium">Avg Tenure</th>
                    <th className="text-right py-3 px-2 font-medium">Turnover</th>
                    <th className="text-right py-3 px-2 font-medium">Performance</th>
                    <th className="text-right py-3 px-2 font-medium">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium">{dept.department}</td>
                      <td className="text-right py-3 px-2">{dept.headcount}</td>
                      <td className="text-right py-3 px-2">${(dept.avgSalary / 1000).toFixed(0)}k</td>
                      <td className="text-right py-3 px-2">{dept.avgTenure.toFixed(1)} yrs</td>
                      <td className="text-right py-3 px-2">{dept.turnoverRate.toFixed(1)}%</td>
                      <td className="text-right py-3 px-2">{dept.performanceScore.toFixed(1)}/5</td>
                      <td className="text-right py-3 px-2">{dept.engagementScore.toFixed(1)}/10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Skill Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Critical skills requiring development or acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillGaps.map((gap) => (
                <div key={gap.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{gap.skillName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {gap.affectedEmployees} employees • {gap.departmentsAffected.join(', ')}
                      </p>
                    </div>
                    <Badge variant={gap.priority === 'critical' || gap.priority === 'high' ? 'destructive' : 'default'}>
                      {gap.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Level</p>
                      <p className="text-lg font-semibold">{gap.currentLevel}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Required Level</p>
                      <p className="text-lg font-semibold">{gap.requiredLevel}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gap</p>
                      <p className="text-lg font-semibold text-destructive">{gap.gap}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {gap.recommendedActions.map((action, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
