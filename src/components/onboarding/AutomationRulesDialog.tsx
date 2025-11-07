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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Settings, Zap } from "lucide-react";
import {
  getAutomationRules,
  saveAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  AutomationRule,
  processAutomations,
} from "@/lib/automatedReminders";
import { getAllTemplates } from "@/lib/emailTemplates";
import { OnboardingWorkflow } from "@/types/onboarding";
import { useToast } from "@/hooks/use-toast";

interface AutomationRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflows: OnboardingWorkflow[];
}

export function AutomationRulesDialog({
  open,
  onOpenChange,
  workflows,
}: AutomationRulesDialogProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    daysBeforeStart: 7,
    emailTemplateId: "welcome",
    targetStatuses: ["not-started", "in-progress"],
  });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const templates = getAllTemplates();

  useEffect(() => {
    if (open) {
      setRules(getAutomationRules());
    }
  }, [open]);

  const handleToggleRule = (id: string, enabled: boolean) => {
    updateAutomationRule(id, { enabled });
    setRules(getAutomationRules());
  };

  const handleDeleteRule = (id: string) => {
    deleteAutomationRule(id);
    setRules(getAutomationRules());
    toast({
      title: "Rule deleted",
      description: "The automation rule has been removed.",
    });
  };

  const handleAddRule = () => {
    if (!newRule.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the automation rule.",
        variant: "destructive",
      });
      return;
    }

    saveAutomationRule({
      name: newRule.name,
      enabled: true,
      daysBeforeStart: newRule.daysBeforeStart,
      emailTemplateId: newRule.emailTemplateId,
      targetStatuses: newRule.targetStatuses,
    });

    setRules(getAutomationRules());
    setShowAddDialog(false);
    setNewRule({
      name: "",
      daysBeforeStart: 7,
      emailTemplateId: "welcome",
      targetStatuses: ["not-started", "in-progress"],
    });

    toast({
      title: "Rule added",
      description: "The automation rule has been created.",
    });
  };

  const handleProcessAutomations = () => {
    setProcessing(true);
    
    setTimeout(() => {
      const result = processAutomations(workflows);
      
      setProcessing(false);
      
      if (result.errors.length > 0) {
        toast({
          title: "Processing completed with errors",
          description: `Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Automations processed",
          description: `${result.created} email(s) scheduled, ${result.skipped} skipped (already scheduled or past date).`,
        });
      }
    }, 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Automation Rules
            </DialogTitle>
            <DialogDescription>
              Configure automated email reminders based on employee start dates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
                <CardDescription>
                  Rules automatically create scheduled emails X days before an employee's start date.
                  Click "Process Automations" to check all workflows and create scheduled emails.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleProcessAutomations} disabled={processing}>
                  <Zap className="h-4 w-4 mr-2" />
                  {processing ? "Processing..." : "Process Automations Now"}
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Active Rules</h3>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Days Before</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Target Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No automation rules configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.daysBeforeStart} days</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {templates.find(t => t.id === rule.emailTemplateId)?.name || rule.emailTemplateId}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {rule.targetStatuses.map(status => (
                              <Badge key={status} variant="secondary" className="text-xs">
                                {status}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Automation Rule</DialogTitle>
            <DialogDescription>
              Create a new rule to automatically schedule reminder emails
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Welcome Email Reminder"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days-before">Days Before Start Date</Label>
              <Input
                id="days-before"
                type="number"
                min="1"
                max="90"
                value={newRule.daysBeforeStart}
                onChange={(e) => setNewRule({ ...newRule, daysBeforeStart: parseInt(e.target.value) || 7 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Email Template</Label>
              <Select
                value={newRule.emailTemplateId}
                onValueChange={(value) => setNewRule({ ...newRule, emailTemplateId: value })}
              >
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Workflow Status</Label>
              <div className="flex gap-2 flex-wrap">
                {["not-started", "in-progress", "completed", "overdue"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRule.targetStatuses.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRule({
                            ...newRule,
                            targetStatuses: [...newRule.targetStatuses, status],
                          });
                        } else {
                          setNewRule({
                            ...newRule,
                            targetStatuses: newRule.targetStatuses.filter(s => s !== status),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
