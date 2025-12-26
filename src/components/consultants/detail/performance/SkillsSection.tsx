import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { Award, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { getSkillsAssessments } from "@/lib/performanceStorage";
import type { ProficiencyLevel } from "@/types/performance";

interface SkillsSectionProps {
  consultantId: string;
}

const proficiencyLevels: { value: ProficiencyLevel; label: string; color: string; score: number }[] = [
  { value: 'none', label: 'None', color: 'bg-muted', score: 0 },
  { value: 'beginner', label: 'Beginner', color: 'bg-red-500', score: 1 },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500', score: 2 },
  { value: 'advanced', label: 'Advanced', color: 'bg-blue-500', score: 3 },
  { value: 'expert', label: 'Expert', color: 'bg-green-500', score: 4 },
];

export function SkillsSection({ consultantId }: SkillsSectionProps) {
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);

  const assessments = getSkillsAssessments(consultantId);
  const latestAssessment = assessments[0]; // Assuming sorted by date

  const getProficiencyInfo = (level: ProficiencyLevel) => {
    return proficiencyLevels.find(p => p.value === level) || proficiencyLevels[0];
  };

  const calculateProgress = (current: ProficiencyLevel, target?: ProficiencyLevel) => {
    const currentInfo = getProficiencyInfo(current);
    const targetInfo = target ? getProficiencyInfo(target) : proficiencyLevels[4]; // Default to expert
    return (currentInfo.score / targetInfo.score) * 100;
  };

  const groupedSkills = latestAssessment?.skillRatings.reduce((acc, skill) => {
    if (!acc[skill.categoryId]) {
      acc[skill.categoryId] = [];
    }
    acc[skill.categoryId].push(skill);
    return acc;
  }, {} as Record<string, typeof latestAssessment.skillRatings>);

  const skillGaps = latestAssessment?.skillRatings.filter(s => {
    const current = getProficiencyInfo(s.currentLevel).score;
    const target = s.targetLevel ? getProficiencyInfo(s.targetLevel).score : 4;
    return current < target;
  }) || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills & Development
              </CardTitle>
              {latestAssessment && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last assessed: {new Date(latestAssessment.assessmentDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button onClick={() => setAssessmentDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Assess Skills
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!latestAssessment ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-3">No skills assessed yet</p>
              <Button variant="outline" onClick={() => setAssessmentDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Assessment
              </Button>
            </div>
          ) : (
            <>
              {/* Skills by Category */}
              {groupedSkills && Object.entries(groupedSkills).map(([category, skills]: [string, any[]]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {skills.map((skill) => {
                      const profInfo = getProficiencyInfo(skill.currentLevel);
                      const progress = calculateProgress(skill.currentLevel, skill.targetLevel);
                      const hasGap = skill.targetLevel && 
                                    getProficiencyInfo(skill.currentLevel).score < 
                                    getProficiencyInfo(skill.targetLevel).score;

                      return (
                        <div key={skill.skillId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{skill.skillName}</span>
                              {hasGap && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                  <TrendingUp className="h-3 w-3" />
                                  Growth Opportunity
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={profInfo.color}>
                                {profInfo.label}
                              </Badge>
                              {skill.targetLevel && (
                                <span className="text-xs text-muted-foreground">
                                  → {getProficiencyInfo(skill.targetLevel).label}
                                </span>
                              )}
                            </div>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Skill Gaps */}
              {skillGaps.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <h4 className="text-sm font-semibold">Development Priorities</h4>
                    <Badge variant="secondary">{skillGaps.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {skillGaps.slice(0, 3).map((skill) => {
                      const currentInfo = getProficiencyInfo(skill.currentLevel);
                      const targetInfo = skill.targetLevel ? 
                                        getProficiencyInfo(skill.targetLevel) : 
                                        proficiencyLevels[4];
                      return (
                        <div key={skill.skillId} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                          <span className="font-medium">{skill.skillName}</span>
                          <span className="text-muted-foreground">
                            {currentInfo.label} → {targetInfo.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Create Development Plan
                  </Button>
                </div>
              )}

              {/* Overall Progress */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {latestAssessment.skillRatings.filter(s => getProficiencyInfo(s.currentLevel).score >= 3).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Advanced+ Skills</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{skillGaps.length}</div>
                    <div className="text-xs text-muted-foreground">Growth Areas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{latestAssessment.skillRatings.length}</div>
                    <div className="text-xs text-muted-foreground">Total Skills</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <SkillAssessmentDialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
        consultantId={consultantId}
        onSuccess={() => {
          setAssessmentDialogOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
