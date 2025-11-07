import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Eye, Mail, User } from "lucide-react";
import type { OnboardingWorkflow } from "@/types/onboarding";
import { format } from "date-fns";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailType: string;
  message: string;
  workflows: OnboardingWorkflow[];
}

export function EmailPreviewDialog({
  open,
  onOpenChange,
  emailType,
  message,
  workflows,
}: EmailPreviewDialogProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
    workflows[0]?.id || ""
  );

  const selectedWorkflow = useMemo(() => {
    return workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
  }, [selectedWorkflowId, workflows]);

  const replaceTokens = (text: string, workflow: OnboardingWorkflow): string => {
    if (!workflow) return text;

    return text
      .replace(/\{\{employee_name\}\}/g, workflow.employeeName)
      .replace(/\{\{job_title\}\}/g, workflow.jobTitle)
      .replace(/\{\{department\}\}/g, workflow.department)
      .replace(/\{\{start_date\}\}/g, workflow.startDate)
      .replace(/\{\{manager_name\}\}/g, workflow.assignedToName)
      .replace(/\{\{employee_email\}\}/g, workflow.employeeEmail)
      .replace(/\{\{company_name\}\}/g, "HRMS Company")
      .replace(/\{\{current_date\}\}/g, format(new Date(), 'MMMM dd, yyyy'));
  };

  const previewMessage = useMemo(() => {
    if (!selectedWorkflow) return message;
    return replaceTokens(message, selectedWorkflow);
  }, [message, selectedWorkflow]);

  const detectTokens = (text: string): string[] => {
    const tokenRegex = /\{\{([^}]+)\}\}/g;
    const tokens: string[] = [];
    let match;
    while ((match = tokenRegex.exec(text)) !== null) {
      if (!tokens.includes(match[1])) {
        tokens.push(match[1]);
      }
    }
    return tokens;
  };

  const tokensUsed = useMemo(() => detectTokens(message), [message]);

  if (!selectedWorkflow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Email Preview
          </DialogTitle>
          <DialogDescription>
            Preview how your email will look with actual employee data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Selector */}
          <div className="space-y-2">
            <Label>Preview as:</Label>
            <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workflows.map(workflow => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.employeeName} ({workflow.employeeEmail})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tokens Used */}
          {tokensUsed.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm font-medium mb-2">Dynamic Tokens Used:</p>
                <div className="flex flex-wrap gap-2">
                  {tokensUsed.map(token => (
                    <Badge key={token} variant="outline" className="font-mono text-xs">
                      {`{{${token}}}`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Preview */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original Template */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Email Template</h3>
              </div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge>{emailType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">To:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {`{{employee_email}}`}
                      </code>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                      {message || "No message content"}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rendered Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">As Received by Employee</h3>
              </div>
              <Card className="border-2 border-primary">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="default">{emailType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">To:</span>
                      <span className="text-sm font-medium">{selectedWorkflow.employeeEmail}</span>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="bg-background p-4 rounded-lg border whitespace-pre-wrap text-sm">
                      {previewMessage || "No message content"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Employee Context Card */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Employee Information (for reference)</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedWorkflow.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job Title</p>
                  <p className="font-medium">{selectedWorkflow.jobTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedWorkflow.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">{selectedWorkflow.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Manager</p>
                  <p className="font-medium">{selectedWorkflow.assignedToName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline">{selectedWorkflow.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Tokens Reference */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Available Tokens</h4>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{employee_name}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{selectedWorkflow.employeeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{job_title}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{selectedWorkflow.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{department}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{selectedWorkflow.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{start_date}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{selectedWorkflow.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{manager_name}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{selectedWorkflow.assignedToName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {`{{current_date}}`}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span>{format(new Date(), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
