import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveSkillsAssessment } from "@/lib/performanceStorage";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { SkillAssessment, ProficiencyLevel } from "@/types/performance";

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  onSuccess?: () => void;
}

type SkillCategoryType = 'technical' | 'soft-skills' | 'leadership' | 'domain' | 'other';

interface SkillInput {
  id: string;
  name: string;
  category: SkillCategoryType;
  proficiency: ProficiencyLevel;
  targetProficiency?: ProficiencyLevel;
}

const defaultSkills: Omit<SkillInput, 'id'>[] = [
  { name: "CRM Systems", category: "technical" as SkillCategoryType, proficiency: "intermediate" as ProficiencyLevel },
  { name: "Sales Techniques", category: "technical" as SkillCategoryType, proficiency: "intermediate" as ProficiencyLevel },
  { name: "Communication", category: "soft-skills" as SkillCategoryType, proficiency: "intermediate" as ProficiencyLevel },
  { name: "Negotiation", category: "soft-skills" as SkillCategoryType, proficiency: "intermediate" as ProficiencyLevel },
  { name: "Time Management", category: "soft-skills" as SkillCategoryType, proficiency: "intermediate" as ProficiencyLevel },
];

export function SkillAssessmentDialog({ open, onOpenChange, consultantId, onSuccess }: SkillAssessmentDialogProps) {
  const [skills, setSkills] = useState<SkillInput[]>(
    defaultSkills.map((s, i) => ({ ...s, id: `${i + 1}` }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: Date.now().toString(),
        name: "",
        category: "technical" as SkillCategoryType,
        proficiency: "intermediate" as ProficiencyLevel,
      },
    ]);
  };

  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  const updateSkill = (id: string, field: keyof SkillInput, value: any) => {
    setSkills(skills.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validSkills = skills.filter(s => s.name.trim());
    if (validSkills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setIsSubmitting(true);

    try {
      const assessment: SkillAssessment = {
        id: `assessment-${Date.now()}`,
        employeeId: consultantId,
        employeeName: "Consultant",
        role: "Consultant",
        department: "Sales",
        assessmentDate: new Date().toISOString(),
        assessmentType: 'manager',
        assessorId: "current-user",
        assessorName: "Manager",
        skillRatings: validSkills.map((s) => ({
          skillId: s.id,
          skillName: s.name,
          categoryId: s.category,
          currentLevel: s.proficiency,
          targetLevel: s.targetProficiency,
          lastAssessed: new Date().toISOString(),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveSkillsAssessment(assessment);
      toast.success("Skills assessed successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assess Skills</DialogTitle>
            <DialogDescription>
              Evaluate current skill levels and set development targets
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Skills</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Skill Name"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      />
                      <Select
                        value={skill.category}
                        onValueChange={(v) => updateSkill(skill.id, "category", v as SkillCategoryType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="soft-skills">Soft Skills</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="domain">Domain Knowledge</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Current Level</Label>
                        <Select
                          value={skill.proficiency}
                          onValueChange={(v) => updateSkill(skill.id, "proficiency", v as ProficiencyLevel)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Target Level (Optional)</Label>
                        <Select
                          value={skill.targetProficiency || ""}
                          onValueChange={(v) => updateSkill(skill.id, "targetProficiency", v as ProficiencyLevel)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No target</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(skill.id)}
                    className="shrink-0"
                    disabled={skills.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
