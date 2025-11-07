import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updateJobTemplate, templateCategories, JobTemplate } from "@/lib/jobTemplateService";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditTemplateDialogProps {
  template: JobTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTemplateDialog({
  template,
  open,
  onOpenChange,
}: EditTemplateDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || "",
    category: template.category,
    isShared: template.isShared,
    title: template.data.title || "",
    department: template.data.department || "",
    employmentType: (template.data.employmentType || "full-time") as
      | "full-time"
      | "part-time"
      | "contract"
      | "casual",
    experienceLevel: (template.data.experienceLevel || "mid") as
      | "entry"
      | "mid"
      | "senior"
      | "executive",
  });

  useEffect(() => {
    setFormData({
      name: template.name,
      description: template.description || "",
      category: template.category,
      isShared: template.isShared,
      title: template.data.title || "",
      department: template.data.department || "",
      employmentType: (template.data.employmentType || "full-time") as any,
      experienceLevel: (template.data.experienceLevel || "mid") as any,
    });
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Template name is required.",
        variant: "destructive",
      });
      return;
    }

    updateJobTemplate(template.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      isShared: formData.isShared,
      data: {
        title: formData.title || undefined,
        department: formData.department || undefined,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
      },
    });

    toast({
      title: "Template updated",
      description: `"${formData.name}" has been updated successfully.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update template details and default values
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Template Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Template Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer Template"
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe when to use this template..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isShared"
                  checked={formData.isShared}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isShared: checked as boolean })
                  }
                />
                <label htmlFor="isShared" className="text-sm cursor-pointer">
                  Share this template with team members
                </label>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Default Job Details</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g., Engineering"
                  maxLength={50}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, employmentType: value })
                    }
                  >
                    <SelectTrigger id="employmentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, experienceLevel: value })
                    }
                  >
                    <SelectTrigger id="experienceLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
