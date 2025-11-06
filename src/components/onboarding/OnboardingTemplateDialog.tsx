import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOnboardingTemplates } from "@/lib/onboardingStorage";
import { Calendar, FileText, ListTodo } from "lucide-react";

interface OnboardingTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OnboardingTemplateDialog({ open, onOpenChange, onSuccess }: OnboardingTemplateDialogProps) {
  const templates = getOnboardingTemplates();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Onboarding Templates</DialogTitle>
          <DialogDescription>
            View and manage onboarding workflow templates
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {templates.map(template => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{template.duration} days</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{template.tasks.length} tasks</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{template.documents.length} documents</p>
                      <p className="text-xs text-muted-foreground">Documents</p>
                    </div>
                  </div>
                </div>

                {template.department && (
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{template.department}</Badge>
                    {template.jobTitle && <Badge variant="outline">{template.jobTitle}</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {templates.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No templates available. Create your first template to get started.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
