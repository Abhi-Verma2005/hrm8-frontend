import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Briefcase, MapPin, DollarSign, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { Job } from "@/types/job";
import { Candidate } from "@/types/entities";
import { getJobs } from "@/lib/mockJobStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CandidateMatchingPanelProps {
  candidate: Candidate;
  onMatchSelect?: (jobId: string) => void;
}

interface JobMatch {
  job: Job;
  score: number;
  strengths: string[];
  gaps: string[];
  reasoning: string;
}

function calculateJobMatch(candidate: Candidate, job: Job): JobMatch {
  let score = 0;
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Skills match (40% weight)
  const jobSkills = job.requirements?.map(s => s.toLowerCase()) || [];
  const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
  const matchedSkills = jobSkills.filter(skill => 
    candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );
  
  const skillMatchPercent = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) : 0;
  score += skillMatchPercent * 40;
  
  if (skillMatchPercent > 0.7) {
    strengths.push(`Strong skills match (${matchedSkills.length}/${jobSkills.length})`);
  } else if (skillMatchPercent < 0.4) {
    gaps.push(`Missing key skills (${jobSkills.length - matchedSkills.length} required)`);
  }

  // Experience level match (20% weight)
  const expMap: Record<string, number> = { 'entry': 1, 'mid': 2, 'senior': 3, 'lead': 4, 'executive': 5 };
  const candidateLevel = expMap[candidate.experienceLevel || 'mid'] || 2;
  const jobLevel = expMap[job.experienceLevel || 'mid'] || 2;
  const levelDiff = Math.abs(candidateLevel - jobLevel);
  
  if (levelDiff === 0) {
    score += 20;
    strengths.push('Perfect experience level match');
  } else if (levelDiff === 1) {
    score += 15;
  } else if (levelDiff > 2) {
    gaps.push('Experience level mismatch');
  }

  // Location match (15% weight)
  if (job.workArrangement === 'remote' || candidate.workArrangement === 'remote') {
    score += 15;
    strengths.push('Remote work compatible');
  } else if (candidate.location?.includes(job.location?.split(',')[0] || '')) {
    score += 15;
    strengths.push('Location match');
  } else {
    gaps.push('Location/work arrangement mismatch');
  }

  // Salary expectations (15% weight)
  const candidateMinSalary = candidate.salaryMin;
  if (candidateMinSalary && job.salaryMin) {
    if (candidateMinSalary >= job.salaryMin && candidateMinSalary <= (job.salaryMax || job.salaryMin * 1.5)) {
      score += 15;
      strengths.push('Salary expectations aligned');
    } else if (candidateMinSalary > (job.salaryMax || job.salaryMin * 1.5)) {
      gaps.push('Salary expectations too high');
    }
  } else {
    score += 10; // Neutral if no salary data
  }

  // Availability (10% weight)
  const availableDate = candidate.availabilityDate ? new Date(candidate.availabilityDate) : null;
  const now = new Date();
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  if (availableDate && availableDate <= twoWeeksFromNow) {
    score += 10;
    strengths.push('Available soon');
  } else if (!candidate.availabilityDate) {
    score += 5; // Neutral if no availability data
  }

  const reasoning = `This candidate ${score >= 80 ? 'is an excellent' : score >= 60 ? 'is a good' : score >= 40 ? 'is a potential' : 'may not be the best'} match based on skills, experience, and requirements alignment.`;

  return {
    job,
    score: Math.round(score),
    strengths,
    gaps,
    reasoning
  };
}

export function CandidateMatchingPanel({ candidate, onMatchSelect }: CandidateMatchingPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'top' | 'all'>('top');
  
  const allJobs = useMemo(() => getJobs().filter(j => j.status === 'open'), []);
  
  const jobMatches = useMemo(() => {
    return allJobs
      .map(job => calculateJobMatch(candidate, job))
      .sort((a, b) => b.score - a.score);
  }, [candidate, allJobs]);

  const topMatches = jobMatches.slice(0, 5);
  const displayMatches = selectedTab === 'top' ? topMatches : jobMatches;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Potential Match';
    return 'Low Match';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI-Powered Job Matching</h3>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'top' | 'all')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="top">Top 5 Matches</TabsTrigger>
          <TabsTrigger value="all">All Open Positions ({jobMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="space-y-4">
          {topMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No open positions available</p>
          ) : (
            displayMatches.map((match) => (
              <JobMatchCard key={match.job.id} match={match} onSelect={onMatchSelect} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {displayMatches.map((match) => (
            <JobMatchCard key={match.job.id} match={match} onSelect={onMatchSelect} />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function JobMatchCard({ match, onSelect }: { match: JobMatch; onSelect?: (jobId: string) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-muted';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-base">{match.job.title}</h4>
              <p className="text-sm text-muted-foreground">{match.job.employerName}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${match.score >= 80 ? 'text-green-600' : match.score >= 60 ? 'text-blue-600' : match.score >= 40 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {match.score}%
              </div>
              <Badge variant={match.score >= 80 ? 'default' : 'secondary'} className="text-xs">
                {match.score >= 80 ? 'Excellent' : match.score >= 60 ? 'Good' : match.score >= 40 ? 'Potential' : 'Low'}
              </Badge>
            </div>
          </div>

          <Progress value={match.score} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{match.job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span className="capitalize">{match.job.workArrangement}</span>
            </div>
            {match.job.salaryMin && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>${match.job.salaryMin.toLocaleString()} - ${(match.job.salaryMax || match.job.salaryMin * 1.3).toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{match.job.applicantsCount} applicants</span>
            </div>
          </div>

          {match.strengths.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Strengths
              </p>
              <div className="flex flex-wrap gap-1">
                {match.strengths.map((strength, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {match.gaps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium flex items-center gap-1">
                <XCircle className="h-3 w-3 text-amber-600" />
                Areas to Address
              </p>
              <div className="flex flex-wrap gap-1">
                {match.gaps.map((gap, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    {gap}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground italic">{match.reasoning}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onSelect?.(match.job.id)}
        >
          View Job Details
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => window.open(`/applications?action=create&jobId=${match.job.id}&candidateId=${match.job.id}`, '_blank')}
        >
          Create Application
        </Button>
      </div>
    </Card>
  );
}
