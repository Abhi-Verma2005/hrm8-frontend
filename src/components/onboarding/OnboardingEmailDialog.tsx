import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Eye } from "lucide-react";
import { OnboardingWorkflow } from "@/types/onboarding";

interface OnboardingEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  selectedWorkflows: OnboardingWorkflow[];
  onSend: (emailType: string, message: string, workflowIds: string[]) => void;
}

export function OnboardingEmailDialog({
  open,
  onOpenChange,
  selectedCount,
  selectedWorkflows,
  onSend,
}: OnboardingEmailDialogProps) {
  const [emailType, setEmailType] = useState<string>("welcome");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("compose");
  const [excludedWorkflowIds, setExcludedWorkflowIds] = useState<Set<string>>(new Set());

  const handleSend = () => {
    if (!message.trim() || includedWorkflows.length === 0) return;
    const workflowIds = includedWorkflows.map(w => w.id);
    onSend(emailType, message, workflowIds);
    setMessage("");
    setEmailType("welcome");
    setActiveTab("compose");
    setExcludedWorkflowIds(new Set());
    onOpenChange(false);
  };

  const emailTemplates = {
    welcome: "Welcome to the team! We're excited to have you onboard. Your onboarding process has been prepared and we look forward to working with you.",
    reminder: "This is a friendly reminder about your pending onboarding tasks. Please complete them at your earliest convenience to ensure a smooth start.",
    checkin: "We hope your onboarding is going well! Please let us know if you have any questions or need any assistance.",
  };

  const handleTypeChange = (type: string) => {
    setEmailType(type);
    setMessage(emailTemplates[type as keyof typeof emailTemplates]);
  };

  const emailTypeLabels = {
    welcome: "Welcome Email",
    reminder: "Onboarding Reminder",
    checkin: "Check-in Email",
  };

  const includedWorkflows = selectedWorkflows.filter(w => !excludedWorkflowIds.has(w.id));
  const includedCount = includedWorkflows.length;

  const handleToggleWorkflow = (workflowId: string, checked: boolean) => {
    const newExcluded = new Set(excludedWorkflowIds);
    if (checked) {
      newExcluded.delete(workflowId);
    } else {
      newExcluded.add(workflowId);
    }
    setExcludedWorkflowIds(newExcluded);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setExcludedWorkflowIds(new Set());
    } else {
      setExcludedWorkflowIds(new Set(selectedWorkflows.map(w => w.id)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to {selectedCount} Workflow{selectedCount > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Compose an email to send to selected employees. Choose a template or write your own message.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-type">Email Type</Label>
              <Select value={emailType} onValueChange={handleTypeChange}>
                <SelectTrigger id="email-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="reminder">Onboarding Reminder</SelectItem>
                  <SelectItem value="checkin">Check-in Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="min-h-[200px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="py-4">
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 pb-4 border-b">
                  <div className="text-sm text-muted-foreground mb-1">Subject</div>
                  <div className="font-semibold">{emailTypeLabels[emailType as keyof typeof emailTypeLabels]}</div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  To: {includedCount} of {selectedCount} recipient{selectedCount > 1 ? "s" : ""}
                  {excludedWorkflowIds.size > 0 && (
                    <span className="text-destructive ml-2">({excludedWorkflowIds.size} excluded)</span>
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none mt-4">
                  <p className="whitespace-pre-wrap">{message || "No message yet..."}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">Recipients ({selectedCount}):</div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-recipients"
                      checked={excludedWorkflowIds.size === 0}
                      onCheckedChange={handleToggleAll}
                    />
                    <label htmlFor="select-all-recipients" className="text-sm cursor-pointer">
                      Select All
                    </label>
                  </div>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedWorkflows.map((workflow) => {
                    const isIncluded = !excludedWorkflowIds.has(workflow.id);
                    return (
                      <div 
                        key={workflow.id} 
                        className={`flex items-center gap-3 text-sm p-2 rounded-md transition-colors ${
                          isIncluded ? 'bg-muted' : 'bg-muted/40 opacity-60'
                        }`}
                      >
                        <Checkbox
                          id={`recipient-${workflow.id}`}
                          checked={isIncluded}
                          onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{workflow.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{workflow.employeeEmail}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {workflow.department}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!message.trim() || includedCount === 0}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email to {includedCount}
            {excludedWorkflowIds.size > 0 && (
              <span className="ml-1 text-xs opacity-70">({excludedWorkflowIds.size} excluded)</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
