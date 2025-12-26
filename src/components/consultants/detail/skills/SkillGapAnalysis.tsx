import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { calculateSkillGaps, getAllSkills } from '@/lib/skillsStorage';

interface SkillGapAnalysisProps {
  consultantId: string;
}

export function SkillGapAnalysis({ consultantId }: SkillGapAnalysisProps) {
  const gaps = calculateSkillGaps(consultantId);
  const skills = getAllSkills();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default: return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const getLevelProgress = (current: string, required: string) => {
    const levels = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
    const currentIdx = levels.indexOf(current);
    const requiredIdx = levels.indexOf(required);
    return requiredIdx > 0 ? (currentIdx / requiredIdx) * 100 : 0;
  };

  if (gaps.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Skill Gaps Identified</h3>
          <p className="text-muted-foreground text-center">
            All assessed skills meet or exceed required proficiency levels.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Gap Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-500">
                {gaps.filter(g => g.priority === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-500">
                {gaps.filter(g => g.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">
                {gaps.filter(g => g.priority === 'medium').length}
              </div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{gaps.length}</div>
              <div className="text-xs text-muted-foreground">Total Gaps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaps by Category */}
      {['critical', 'high', 'medium', 'low'].map(priority => {
        const priorityGaps = gaps.filter(g => g.priority === priority);
        if (priorityGaps.length === 0) return null;

        return (
          <Card key={priority}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getPriorityIcon(priority)}
                <CardTitle className="capitalize">{priority} Priority Gaps</CardTitle>
                <Badge variant={getPriorityColor(priority)}>{priorityGaps.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityGaps.map(gap => (
                  <div key={gap.skillId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{gap.skillName}</span>
                          <Badge variant="outline" className="capitalize">
                            {gap.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{gap.impactOnRole}</p>
                      </div>
                    </div>

                    {/* Level Progression */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">Current: <span className="font-medium capitalize">{gap.currentLevel}</span></span>
                        <span className="text-muted-foreground">Target: <span className="font-medium capitalize">{gap.requiredLevel}</span></span>
                      </div>
                      <Progress value={getLevelProgress(gap.currentLevel, gap.requiredLevel)} />
                    </div>

                    {/* Suggested Actions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Suggested Actions:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {gap.suggestedActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" className="w-full">
                        Create Development Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
