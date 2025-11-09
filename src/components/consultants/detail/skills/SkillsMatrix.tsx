import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { getAllSkills, getConsultantAssessments } from '@/lib/skillsStorage';
import { format } from 'date-fns';
import type { ProficiencyLevel, SkillCategory } from '@/types/skills';

interface SkillsMatrixProps {
  consultantId: string;
}

export function SkillsMatrix({ consultantId }: SkillsMatrixProps) {
  const skills = getAllSkills();
  const assessments = getConsultantAssessments(consultantId);
  
  const categories: SkillCategory[] = ['technical', 'soft-skills', 'leadership', 'domain-knowledge', 'tools', 'certifications'];
  
  const getLevelColor = (level: ProficiencyLevel) => {
    switch (level) {
      case 'expert': return 'bg-green-500';
      case 'advanced': return 'bg-blue-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'beginner': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };
  
  const getLevelValue = (level: ProficiencyLevel): number => {
    const values = { 'none': 0, 'beginner': 25, 'intermediate': 50, 'advanced': 75, 'expert': 100 };
    return values[level];
  };
  
  const getStatusIcon = (current: ProficiencyLevel, required?: ProficiencyLevel) => {
    if (!required) return <Circle className="h-4 w-4 text-muted-foreground" />;
    
    const levelValues = { 'none': 0, 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
    const currentVal = levelValues[current];
    const requiredVal = levelValues[required];
    
    if (currentVal >= requiredVal) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (requiredVal - currentVal > 1) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <AlertCircle className="h-4 w-4 text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categorySkills = skills.filter(s => s.category === category);
        if (categorySkills.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category.replace('-', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySkills.map(skill => {
                  const assessment = assessments.find(a => a.skillId === skill.id);
                  const currentLevel = assessment?.currentLevel || 'none';
                  
                  return (
                    <div key={skill.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(currentLevel, skill.requiredLevel)}
                            <span className="font-medium">{skill.name}</span>
                            {skill.isCore && (
                              <Badge variant="default" className="text-xs">Core</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                          {skill.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {skill.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Current Level */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Current Level</span>
                            <span className="text-sm font-medium capitalize">{currentLevel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={getLevelValue(currentLevel)} className="flex-1" />
                            <div className={`w-3 h-3 rounded-full ${getLevelColor(currentLevel)}`} />
                          </div>
                        </div>

                        {/* Required Level */}
                        {skill.requiredLevel && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Required Level</span>
                              <span className="text-sm font-medium capitalize">{skill.requiredLevel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={getLevelValue(skill.requiredLevel)} className="flex-1" />
                              <div className={`w-3 h-3 rounded-full ${getLevelColor(skill.requiredLevel)}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Assessment Details */}
                      {assessment && (
                        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <div>
                              Last assessed: {format(new Date(assessment.assessmentDate), 'MMM dd, yyyy')}
                              {assessment.validated && (
                                <Badge variant="outline" className="ml-2">Validated</Badge>
                              )}
                            </div>
                            <span>By {assessment.assessedByName}</span>
                          </div>
                        </div>
                      )}

                      {!assessment && (
                        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                          Not yet assessed
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
