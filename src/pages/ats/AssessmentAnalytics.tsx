import React, { useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  performanceTrends,
  questionDifficulties,
  timeMetrics,
  providerEffectiveness,
  scoreDistribution,
  categoryPerformance,
  getAnalyticsSummary,
} from '@/lib/assessments/analyticsData';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Clock,
  Award,
  Target,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AssessmentAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const summary = getAnalyticsSummary();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardPageLayout
      title="Assessment Analytics"
      subtitle="Comprehensive insights into assessment performance and effectiveness"
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Assessments"
            value={summary.totalAssessments}
            change=""
            icon={<BarChart3 className="h-6 w-6" />}
            variant="neutral"
          />
          <EnhancedStatCard
            title="Average Score"
            value={`${summary.averageScore}%`}
            change=""
            icon={<Award className="h-6 w-6" />}
            variant="primary"
          />
          <EnhancedStatCard
            title="Pass Rate"
            value={`${summary.averagePassRate}%`}
            change=""
            icon={<Target className="h-6 w-6" />}
            variant="success"
          />
          <EnhancedStatCard
            title="Completion Rate"
            value={`${summary.averageCompletionRate}%`}
            change=""
            icon={<CheckCircle2 className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="difficulty">Question Difficulty</TabsTrigger>
            <TabsTrigger value="time">Time Metrics</TabsTrigger>
            <TabsTrigger value="providers">Provider Comparison</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          </TabsList>

          {/* Performance Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Score & Pass Rate Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Average Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="passRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Pass Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Volume</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="totalAssessments" fill="#3b82f6" name="Assessments" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {scoreDistribution.map((dist, index) => (
                    <div key={dist.range} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{dist.range}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{dist.count} candidates</span>
                        <Badge variant="secondary">{dist.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Question Difficulty Tab */}
          <TabsContent value="difficulty" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Question Difficulty Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comparing labeled difficulty vs. actual performance-based difficulty
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="averageScore"
                    name="Average Score"
                    className="text-xs"
                    label={{ value: 'Average Score (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    dataKey="actualDifficulty"
                    name="Actual Difficulty"
                    className="text-xs"
                    label={{ value: 'Difficulty (1-10)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis dataKey="timesUsed" range={[100, 1000]} name="Times Used" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm mb-1">{data.questionText}</p>
                            <div className="space-y-1 text-xs">
                              <p>Category: {data.category}</p>
                              <p>Labeled: {data.difficulty}</p>
                              <p>Avg Score: {data.averageScore}%</p>
                              <p>Actual Difficulty: {data.actualDifficulty}/10</p>
                              <p>Times Used: {data.timesUsed}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={questionDifficulties} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Question Performance Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Times Used</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Avg Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionDifficulties.map((q) => (
                    <TableRow key={q.questionId}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {q.questionText}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{q.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{q.timesUsed}</TableCell>
                      <TableCell>{q.averageScore}%</TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-semibold",
                          q.passRate >= 70 ? "text-success" : q.passRate >= 50 ? "text-warning" : "text-destructive"
                        )}>
                          {q.passRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {Math.floor(q.averageTime / 60)}:{(q.averageTime % 60).toString().padStart(2, '0')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Time Metrics Tab */}
          <TabsContent value="time" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Average Completion Time by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeMetrics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" label={{ value: 'Minutes', position: 'insideBottom', offset: -5 }} />
                    <YAxis dataKey="assessmentType" type="category" className="text-xs" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="averageTime" fill="#3b82f6" name="Avg Time" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Completion Rate by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="assessmentType" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="completionRate" fill="#10b981" name="Completion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time Distribution Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Type</TableHead>
                    <TableHead>Average Time</TableHead>
                    <TableHead>Median Time</TableHead>
                    <TableHead>Min Time</TableHead>
                    <TableHead>Max Time</TableHead>
                    <TableHead>Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeMetrics.map((metric) => (
                    <TableRow key={metric.assessmentType}>
                      <TableCell className="font-medium">{metric.assessmentType}</TableCell>
                      <TableCell>{metric.averageTime} min</TableCell>
                      <TableCell>{metric.medianTime} min</TableCell>
                      <TableCell>{metric.minTime} min</TableCell>
                      <TableCell>{metric.maxTime} min</TableCell>
                      <TableCell>
                        <Badge variant={metric.completionRate >= 90 ? "default" : "secondary"}>
                          {metric.completionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Provider Comparison Tab */}
          <TabsContent value="providers" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Provider Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={providerEffectiveness}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="provider" className="text-xs" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Average Score"
                    dataKey="averageScore"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Pass Rate"
                    dataKey="passRate"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Provider Effectiveness Metrics</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Assessments</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerEffectiveness.map((provider) => (
                    <TableRow key={provider.provider}>
                      <TableCell className="font-medium">{provider.provider}</TableCell>
                      <TableCell>{provider.assessmentCount}</TableCell>
                      <TableCell>{provider.averageScore}%</TableCell>
                      <TableCell>{provider.passRate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{provider.candidateSatisfaction}</span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.costPerAssessment === 0
                          ? <Badge variant="secondary">Free</Badge>
                          : `$${provider.costPerAssessment}`
                        }
                      </TableCell>
                      <TableCell>{provider.averageCompletionTime} min</TableCell>
                      <TableCell>
                        {provider.technicalIssues === 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <span className="text-sm">{provider.technicalIssues}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Category Analysis Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Performance Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="averageScore" fill="#8b5cf6" name="Average Score" />
                  <Bar dataKey="passRate" fill="#10b981" name="Pass Rate" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryPerformance.map((category) => (
                <Card key={category.category} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{category.category}</h4>
                    {getTrendIcon(category.trend)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-semibold">{category.averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate</span>
                      <span className="font-semibold">{category.passRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions</span>
                      <Badge variant="secondary">{category.questionsCount}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
