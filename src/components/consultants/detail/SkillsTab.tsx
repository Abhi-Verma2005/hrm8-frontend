import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillsMatrix } from './skills/SkillsMatrix';
import { SkillGapAnalysis } from './skills/SkillGapAnalysis';
import { DevelopmentPlans } from './skills/DevelopmentPlans';
import { CertificationTracking } from './skills/CertificationTracking';
import { SkillAssessmentDialog } from './skills/SkillAssessmentDialog';
import { Target, TrendingUp, Award, BookOpen, Plus } from 'lucide-react';
import { getCompetencyProfile } from '@/lib/skillsStorage';

interface SkillsTabProps {
  consultantId: string;
  consultantName: string;
}

export function SkillsTab({ consultantId, consultantName }: SkillsTabProps) {
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const profile = getCompetencyProfile(consultantId);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.skillCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {profile.assessedSkills} of {profile.totalSkills} skills assessed
            </p>
            <Progress value={profile.skillCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.criticalGaps + profile.highPriorityGaps}</div>
            <p className="text-xs text-muted-foreground">
              {profile.criticalGaps} critical • {profile.highPriorityGaps} high
            </p>
            {(profile.criticalGaps > 0 || profile.highPriorityGaps > 0) && (
              <Badge variant="destructive" className="mt-2">
                Needs Attention
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Plans</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.activeDevelopmentPlans}</div>
            <p className="text-xs text-muted-foreground">Active plans in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.activeCertifications}</div>
            <p className="text-xs text-muted-foreground">
              {profile.expiringCertifications > 0 && (
                <span className="text-orange-500">{profile.expiringCertifications} expiring soon</span>
              )}
              {profile.expiringCertifications === 0 && 'All certifications current'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => setShowAssessmentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assessment
        </Button>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="matrix">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matrix">
            <Target className="h-4 w-4 mr-2" />
            Skills Matrix
          </TabsTrigger>
          <TabsTrigger value="gaps">
            <TrendingUp className="h-4 w-4 mr-2" />
            Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="plans">
            <BookOpen className="h-4 w-4 mr-2" />
            Development Plans
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <SkillsMatrix consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="gaps">
          <SkillGapAnalysis consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="plans">
          <DevelopmentPlans consultantId={consultantId} consultantName={consultantName} />
        </TabsContent>

        <TabsContent value="certifications">
          <CertificationTracking consultantId={consultantId} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SkillAssessmentDialog
        open={showAssessmentDialog}
        onOpenChange={setShowAssessmentDialog}
        consultantId={consultantId}
        consultantName={consultantName}
        onSaved={() => {
          setShowAssessmentDialog(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
