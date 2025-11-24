import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { getAssessments } from '@/lib/mockAssessmentStorage';
import { ASSESSMENT_PRICING } from '@/lib/assessments/pricingConstants';
import type { Assessment, AssessmentType } from '@/types/assessment';
import { ArrowLeft, Users, Award, TrendingUp, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CANDIDATE_COLORS = [
  'hsl(var(--primary))',
  'hsl(217, 91%, 60%)', // blue
  'hsl(142, 76%, 45%)', // green
  'hsl(38, 92%, 50%)', // orange
  'hsl(280, 87%, 65%)', // purple
];

export default function AssessmentComparisonPage() {
  const navigate = useNavigate();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allAssessments = getAssessments();
  
  // Get unique jobs and assessment types
  const jobs = useMemo(() => {
    const uniqueJobs = new Map<string, string>();
    allAssessments.forEach(a => {
      if (a.jobId && a.jobTitle) {
        uniqueJobs.set(a.jobId, a.jobTitle);
      }
    });
    return Array.from(uniqueJobs.entries()).map(([id, title]) => ({ id, title }));
  }, [allAssessments]);

  const assessmentTypes = useMemo(() => {
    const types = new Set<AssessmentType>();
    allAssessments.forEach(a => types.add(a.assessmentType));
    return Array.from(types);
  }, [allAssessments]);

  // Filter assessments
  const filteredAssessments = useMemo(() => {
    return allAssessments.filter(a => {
      if (a.status !== 'completed' || !a.overallScore) return false;
      if (selectedJob !== 'all' && a.jobId !== selectedJob) return false;
      if (selectedType !== 'all' && a.assessmentType !== selectedType) return false;
      return true;
    });
  }, [allAssessments, selectedJob, selectedType]);

  // Get unique candidates from filtered assessments
  const availableCandidates = useMemo(() => {
    const candidateMap = new Map<string, { id: string; name: string; email: string }>();
    filteredAssessments.forEach(a => {
      if (!candidateMap.has(a.candidateId)) {
        candidateMap.set(a.candidateId, {
          id: a.candidateId,
          name: a.candidateName,
          email: a.candidateEmail,
        });
      }
    });
    return Array.from(candidateMap.values()).filter(c => 
      searchTerm === '' || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredAssessments, searchTerm]);

  // Get comparison data for selected candidates
  const comparisonData = useMemo(() => {
    return selectedCandidates.map(candidateId => {
      const candidate = availableCandidates.find(c => c.id === candidateId);
      if (!candidate) return null;

      const candidateAssessments = filteredAssessments.filter(a => a.candidateId === candidateId);
      const avgScore = candidateAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0) / candidateAssessments.length;
      
      // Aggregate category scores
      const categoryScores: Record<string, number[]> = {};
      candidateAssessments.forEach(a => {
        if (a.result?.details?.categoryScores) {
          Object.entries(a.result.details.categoryScores).forEach(([category, score]) => {
            if (!categoryScores[category]) categoryScores[category] = [];
            categoryScores[category].push(score);
          });
        }
      });

      const avgCategoryScores = Object.entries(categoryScores).reduce((acc, [category, scores]) => {
        acc[category] = Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10;
        return acc;
      }, {} as Record<string, number>);

      return {
        candidateId,
        name: candidate.name,
        email: candidate.email,
        avgScore: Math.round(avgScore * 10) / 10,
        assessmentCount: candidateAssessments.length,
        passedCount: candidateAssessments.filter(a => a.passed).length,
        categoryScores: avgCategoryScores,
      };
    }).filter(Boolean);
  }, [selectedCandidates, availableCandidates, filteredAssessments]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (comparisonData.length === 0) return [];

    // Get all unique categories
    const allCategories = new Set<string>();
    comparisonData.forEach(data => {
      Object.keys(data!.categoryScores).forEach(cat => allCategories.add(cat));
    });

    return Array.from(allCategories).map(category => {
      const dataPoint: any = { category: category.replace(/([A-Z])/g, ' $1').trim() };
      comparisonData.forEach((data, index) => {
        dataPoint[data!.name] = data!.categoryScores[category] || 0;
      });
      return dataPoint;
    });
  }, [comparisonData]);

  // Prepare overall score comparison chart data
  const scoreComparisonData = useMemo(() => {
    return comparisonData.map((data, index) => ({
      name: data!.name,
      score: data!.avgScore,
      color: CANDIDATE_COLORS[index % CANDIDATE_COLORS.length],
    }));
  }, [comparisonData]);

  const toggleCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 candidates
      }
      return [...prev, candidateId];
    });
  };

  const clearFilters = () => {
    setSelectedJob('all');
    setSelectedType('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedJob !== 'all' || selectedType !== 'all' || searchTerm !== '';

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="text-base font-semibold flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/assessments')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight transition-colors duration-500">
              Assessment Comparison
            </h1>
            <p className="text-muted-foreground transition-colors duration-500">
              Compare multiple candidates' assessment performance side-by-side
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Sidebar - Filters and Candidate Selection */}
        <div className="space-y-4">
          {/* Filters */}
          <Card className="transition-[background,border-color,box-shadow,color] duration-500">
            <CardHeader>
              <div className="text-base font-semibold flex items-center justify-between">
                <CardTitle className="text-base transition-colors duration-500">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Job Position</Label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="All positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All positions</SelectItem>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assessment Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {assessmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {ASSESSMENT_PRICING[type].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Selection */}
          <Card className="transition-[background,border-color,box-shadow,color] duration-500">
            <CardHeader>
              <CardTitle className="text-base transition-colors duration-500">
                <Users className="h-4 w-4 inline mr-2" />
                Select Candidates ({selectedCandidates.length}/5)
              </CardTitle>
              <CardDescription className="transition-colors duration-500">
                Choose up to 5 candidates to compare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {availableCandidates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 transition-colors duration-500">
                    No candidates found
                  </p>
                ) : (
                  availableCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-start space-x-3 space-y-0 rounded-md border p-3 transition-[background,border-color,box-shadow,color] duration-500 hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleCandidate(candidate.id)}
                    >
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                        disabled={!selectedCandidates.includes(candidate.id) && selectedCandidates.length >= 5}
                      />
                      <div className="flex-1 space-y-1 leading-none">
                        <p className="text-sm font-medium transition-colors duration-500">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-muted-foreground transition-colors duration-500">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Comparison Results */}
        <div className="space-y-6">
          {selectedCandidates.length === 0 ? (
            <Card className="transition-[background,border-color,box-shadow,color] duration-500">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2 transition-colors duration-500">
                  No Candidates Selected
                </h3>
                <p className="text-muted-foreground text-center transition-colors duration-500">
                  Select at least one candidate from the sidebar to begin comparison
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground transition-colors duration-500">
                          Candidates
                        </p>
                        <p className="text-2xl font-bold transition-colors duration-500">
                          {selectedCandidates.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground transition-colors duration-500">
                          Avg. Score
                        </p>
                        <p className="text-2xl font-bold transition-colors duration-500">
                          {comparisonData.length > 0
                            ? Math.round(
                                comparisonData.reduce((sum, d) => sum + d!.avgScore, 0) / comparisonData.length
                              )
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground transition-colors duration-500">
                          Top Performer
                        </p>
                        <p className="text-2xl font-bold transition-colors duration-500">
                          {comparisonData.length > 0
                            ? Math.max(...comparisonData.map(d => d!.avgScore))
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Score Comparison */}
              <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                <CardHeader>
                  <CardTitle className="transition-colors duration-500">Overall Score Comparison</CardTitle>
                  <CardDescription className="transition-colors duration-500">
                    Average assessment scores across all completed assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {scoreComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Category Radar Chart */}
              {radarData.length > 0 && (
                <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                  <CardHeader>
                    <CardTitle className="transition-colors duration-500">
                      Skill Category Comparison
                    </CardTitle>
                    <CardDescription className="transition-colors duration-500">
                      Performance across different assessment categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="category" 
                          stroke="hsl(var(--muted-foreground))"
                          className="text-xs"
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        {comparisonData.map((data, index) => (
                          <Radar
                            key={data!.candidateId}
                            name={data!.name}
                            dataKey={data!.name}
                            stroke={CANDIDATE_COLORS[index % CANDIDATE_COLORS.length]}
                            fill={CANDIDATE_COLORS[index % CANDIDATE_COLORS.length]}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Comparison Table */}
              <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                <CardHeader>
                  <CardTitle className="transition-colors duration-500">Detailed Comparison</CardTitle>
                  <CardDescription className="transition-colors duration-500">
                    Side-by-side metrics for each candidate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonData.map((data, index) => (
                      <div key={data!.candidateId}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: CANDIDATE_COLORS[index % CANDIDATE_COLORS.length] }}
                            />
                            <div>
                              <p className="font-medium transition-colors duration-500">{data!.name}</p>
                              <p className="text-xs text-muted-foreground transition-colors duration-500">
                                {data!.email}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default">{data!.avgScore}% avg</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-7">
                          <div>
                            <p className="text-xs text-muted-foreground transition-colors duration-500">
                              Assessments
                            </p>
                            <p className="text-sm font-medium transition-colors duration-500">
                              {data!.assessmentCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground transition-colors duration-500">
                              Passed
                            </p>
                            <p className="text-sm font-medium transition-colors duration-500">
                              {data!.passedCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground transition-colors duration-500">
                              Pass Rate
                            </p>
                            <p className="text-sm font-medium transition-colors duration-500">
                              {Math.round((data!.passedCount / data!.assessmentCount) * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground transition-colors duration-500">
                              Categories
                            </p>
                            <p className="text-sm font-medium transition-colors duration-500">
                              {Object.keys(data!.categoryScores).length}
                            </p>
                          </div>
                        </div>

                        {index < comparisonData.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
