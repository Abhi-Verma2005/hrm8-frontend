import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getAllSkills, addAssessment } from '@/lib/skillsStorage';
import { toast } from '@/hooks/use-toast';
import type { ProficiencyLevel, AssessmentType } from '@/types/skills';

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  consultantName: string;
  onSaved?: () => void;
}

export function SkillAssessmentDialog({
  open,
  onOpenChange,
  consultantId,
  consultantName,
  onSaved,
}: SkillAssessmentDialogProps) {
  const skills = getAllSkills();
  const [skillId, setSkillId] = useState('');
  const [currentLevel, setCurrentLevel] = useState<ProficiencyLevel>('none');
  const [targetLevel, setTargetLevel] = useState<ProficiencyLevel>('intermediate');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('manager');
  const [evidence, setEvidence] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!skillId) {
      toast({
        title: "Skill Required",
        description: "Please select a skill to assess",
        variant: "destructive",
      });
      return;
    }

    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    addAssessment({
      consultantId,
      skillId,
      skillName: skill.name,
      currentLevel,
      targetLevel,
      assessmentType,
      assessedBy: 'current-user',
      assessedByName: 'Current User',
      assessmentDate: new Date().toISOString(),
      evidence,
      notes,
      validated: false,
    });

    toast({
      title: "Assessment Saved",
      description: `Assessment for ${skill.name} has been recorded`,
    });

    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skill Assessment - {consultantName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Skill Selection */}
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            <Select value={skillId} onValueChange={setSkillId}>
              <SelectTrigger id="skill">
                <SelectValue placeholder="Select skill..." />
              </SelectTrigger>
              <SelectContent>
                {skills.map(skill => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name} - {skill.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Level */}
          <div className="space-y-2">
            <Label>Current Proficiency Level</Label>
            <RadioGroup value={currentLevel} onValueChange={(value: ProficiencyLevel) => setCurrentLevel(value)}>
              <div className="grid grid-cols-5 gap-2">
                {(['none', 'beginner', 'intermediate', 'advanced', 'expert'] as ProficiencyLevel[]).map(level => (
                  <label
                    key={level}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                      currentLevel === level ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <RadioGroupItem value={level} id={`current-${level}`} />
                    <span className="text-sm capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Target Level */}
          <div className="space-y-2">
            <Label>Target Proficiency Level</Label>
            <RadioGroup value={targetLevel} onValueChange={(value: ProficiencyLevel) => setTargetLevel(value)}>
              <div className="grid grid-cols-5 gap-2">
                {(['none', 'beginner', 'intermediate', 'advanced', 'expert'] as ProficiencyLevel[]).map(level => (
                  <label
                    key={level}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                      targetLevel === level ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <RadioGroupItem value={level} id={`target-${level}`} />
                    <span className="text-sm capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Assessment Type */}
          <div className="space-y-2">
            <Label htmlFor="assessment-type">Assessment Type</Label>
            <Select value={assessmentType} onValueChange={(value: AssessmentType) => setAssessmentType(value)}>
              <SelectTrigger id="assessment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self Assessment</SelectItem>
                <SelectItem value="manager">Manager Assessment</SelectItem>
                <SelectItem value="peer">Peer Assessment</SelectItem>
                <SelectItem value="360">360 Assessment</SelectItem>
                <SelectItem value="test">Test/Certification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence/Examples</Label>
            <Textarea
              id="evidence"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Provide examples, projects, or evidence supporting this assessment..."
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional observations or context..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
