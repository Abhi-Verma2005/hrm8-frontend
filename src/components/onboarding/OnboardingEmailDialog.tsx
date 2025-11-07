import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Eye, Plus, Save, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { OnboardingWorkflow } from "@/types/onboarding";
import { getAllTemplates, saveTemplate, deleteTemplate, EmailTemplate } from "@/lib/emailTemplates";
import { scheduleEmail } from "@/lib/scheduledEmails";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OnboardingEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  selectedWorkflows: OnboardingWorkflow[];
  onSend: (emailType: string, message: string, workflowIds: string[]) => void;
  onSchedule: (emailType: string, message: string, workflowIds: string[], scheduledFor: Date) => void;
  editingScheduledId?: string | null;
  initialData?: {
    emailType: string;
    message: string;
    recipientIds: string[];
    scheduledFor?: Date;
  };
}

export function OnboardingEmailDialog({
  open,
  onOpenChange,
  selectedCount,
  selectedWorkflows,
  onSend,
  onSchedule,
  editingScheduledId,
  initialData,
}: OnboardingEmailDialogProps) {
  const [emailType, setEmailType] = useState<string>("welcome");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("compose");
  const [excludedWorkflowIds, setExcludedWorkflowIds] = useState<Set<string>>(new Set());
  const [templates, setTemplates] = useState<EmailTemplate[]>(getAllTemplates());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("09:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  // Initialize form with editing data
  useEffect(() => {
    if (open && initialData) {
      setEmailType(initialData.emailType);
      setMessage(initialData.message);
      setIsScheduling(!!initialData.scheduledFor);
      
      if (initialData.scheduledFor) {
        setScheduleDate(initialData.scheduledFor);
        setScheduleTime(format(initialData.scheduledFor, "HH:mm"));
      }
      
      // Set excluded workflows (all workflows not in recipientIds)
      const excludedIds = new Set(
        selectedWorkflows
          .filter(w => !initialData.recipientIds.includes(w.id))
          .map(w => w.id)
      );
      setExcludedWorkflowIds(excludedIds);
    }
  }, [open, initialData, selectedWorkflows]);

  const handleSend = () => {
    if (!message.trim() || includedWorkflows.length === 0) return;
    const workflowIds = includedWorkflows.map(w => w.id);
    
    if (isScheduling && scheduleDate) {
      // Parse time and combine with date
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      const scheduledDateTime = new Date(scheduleDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // Check if scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast({
          title: "Invalid schedule time",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }
      
      onSchedule(emailType, message, workflowIds, scheduledDateTime);
    } else {
      onSend(emailType, message, workflowIds);
    }
    
    setMessage("");
    setEmailType("welcome");
    setActiveTab("compose");
    setExcludedWorkflowIds(new Set());
    setScheduleDate(undefined);
    setScheduleTime("09:00");
    setIsScheduling(false);
    onOpenChange(false);
  };

  const emailTemplates: Record<string, string> = {};
  templates.forEach(template => {
    emailTemplates[template.id] = template.message;
  });

  const handleTypeChange = (templateId: string) => {
    setEmailType(templateId);
    setMessage(emailTemplates[templateId] || "");
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !message.trim()) return;
    
    const newTemplate = saveTemplate({
      name: templateName,
      type: "custom",
      message: message,
    });
    
    setTemplates(getAllTemplates());
    setTemplateName("");
    setShowSaveDialog(false);
    
    toast({
      title: "Template saved",
      description: `"${newTemplate.name}" has been saved successfully.`,
    });
  };

  const confirmDeleteTemplate = () => {
    if (!templateToDelete) return;
    
    deleteTemplate(templateToDelete);
    setTemplates(getAllTemplates());
    
    if (emailType === templateToDelete) {
      setEmailType("welcome");
      setMessage(emailTemplates["welcome"]);
    }
    
    setShowDeleteDialog(false);
    setTemplateToDelete(null);
    
    toast({
      title: "Template deleted",
      description: "The template has been removed.",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteDialog(true);
  };

  const emailTypeLabels: Record<string, string> = {};
  templates.forEach(template => {
    emailTypeLabels[template.id] = template.name;
  });

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

  const tokens = [
    { label: "Employee Name", value: "{{employee_name}}" },
    { label: "Job Title", value: "{{job_title}}" },
    { label: "Department", value: "{{department}}" },
    { label: "Start Date", value: "{{start_date}}" },
    { label: "Manager Name", value: "{{manager_name}}" },
  ];

  const insertToken = (token: string) => {
    setMessage(prev => prev + token);
  };

  const replaceTokens = (text: string, workflow: OnboardingWorkflow): string => {
    return text
      .replace(/\{\{employee_name\}\}/g, workflow.employeeName)
      .replace(/\{\{job_title\}\}/g, workflow.jobTitle)
      .replace(/\{\{department\}\}/g, workflow.department)
      .replace(/\{\{start_date\}\}/g, workflow.startDate)
      .replace(/\{\{manager_name\}\}/g, workflow.assignedToName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {editingScheduledId ? "Edit Scheduled Email" : `Send Email to ${selectedCount} Workflow${selectedCount > 1 ? "s" : ""}`}
          </DialogTitle>
          <DialogDescription>
            {editingScheduledId 
              ? "Update the email details before it's sent."
              : "Compose an email to send to selected employees. Choose a template or write your own message."
            }
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
              <div className="flex items-center justify-between">
                <Label htmlFor="email-type">Email Template</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!message.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              </div>
              <Select value={emailType} onValueChange={handleTypeChange}>
                <SelectTrigger id="email-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        {template.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" type="button">
                      <Plus className="h-4 w-4 mr-2" />
                      Insert Token
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {tokens.map((token) => (
                      <DropdownMenuItem
                        key={token.value}
                        onClick={() => insertToken(token.value)}
                      >
                        {token.label}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {token.value}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here... Use tokens like {{employee_name}} to personalize."
                className="min-h-[200px]"
              />
              <div className="text-xs text-muted-foreground">
                Available tokens: {tokens.map(t => t.value).join(", ")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Send Options</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="schedule-email"
                    checked={isScheduling}
                    onCheckedChange={(checked) => setIsScheduling(checked as boolean)}
                  />
                  <label htmlFor="schedule-email" className="text-sm cursor-pointer">
                    Schedule for later
                  </label>
                </div>
              </div>

              {isScheduling && (
                <div className="grid grid-cols-2 gap-3 p-3 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date" className="text-xs">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="schedule-date"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule-time" className="text-xs">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}
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
                
                {includedWorkflows.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Preview for: {includedWorkflows[0].employeeName}
                    </div>
                    <div className="prose prose-sm max-w-none mt-2">
                      <p className="whitespace-pre-wrap">
                        {message ? replaceTokens(message, includedWorkflows[0]) : "No message yet..."}
                      </p>
                    </div>
                    {includedCount > 1 && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                        Note: Personalization tokens will be replaced with each recipient's information when sent.
                      </div>
                    )}
                  </>
                )}
                {includedWorkflows.length === 0 && (
                  <div className="prose prose-sm max-w-none mt-4">
                    <p className="whitespace-pre-wrap text-muted-foreground">No recipients selected</p>
                  </div>
                )}
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
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || includedCount === 0 || (isScheduling && !scheduleDate)}
          >
            {isScheduling ? (
              <>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Email
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Now
              </>
            )}
            {" "}to {includedCount}
            {excludedWorkflowIds.size > 0 && (
              <span className="ml-1 text-xs opacity-70">({excludedWorkflowIds.size} excluded)</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Email Template</DialogTitle>
            <DialogDescription>
              Give your template a name to save it for future use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Welcome Email with Tasks"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Message Preview</Label>
              <div className="text-sm text-muted-foreground border rounded-md p-3 max-h-32 overflow-y-auto">
                {message || "No message"}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTemplate} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
