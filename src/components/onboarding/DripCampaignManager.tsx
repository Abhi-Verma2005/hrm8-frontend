import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getDripCampaigns, createDripCampaign, updateDripCampaign, deleteDripCampaign, enrollInDripCampaign, type DripCampaign, type DripEmail } from "@/lib/dripCampaigns";
import { getOnboardingWorkflows } from "@/lib/onboardingStorage";
import { toast } from "sonner";
import { Workflow, Plus, Trash2, Play, Pause, Mail, Clock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DripCampaignManager() {
  const [campaigns, setCampaigns] = useState<DripCampaign[]>(getDripCampaigns());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [trigger, setTrigger] = useState<DripCampaign['trigger']>('workflow_created');
  const [emails, setEmails] = useState<Omit<DripEmail, 'id'>[]>([
    { name: "Day 1", emailType: "welcome", message: "", delayDays: 0, delayHours: 0 }
  ]);

  const workflows = useMemo(() => getOnboardingWorkflows(), []);

  const refreshCampaigns = () => {
    setCampaigns(getDripCampaigns());
  };

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    if (emails.some(e => !e.message.trim())) {
      toast.error("Please fill in all email messages");
      return;
    }

    const dripEmails: DripEmail[] = emails.map((email, index) => ({
      ...email,
      id: `email-${Date.now()}-${index}`,
    }));

    createDripCampaign({
      name: campaignName,
      description: campaignDescription,
      trigger,
      emails: dripEmails,
      isActive: false,
      targetDepartments: [],
    });

    toast.success("Drip campaign created successfully");
    setShowCreateDialog(false);
    resetForm();
    refreshCampaigns();
  };

  const resetForm = () => {
    setCampaignName("");
    setCampaignDescription("");
    setTrigger('workflow_created');
    setEmails([{ name: "Day 1", emailType: "welcome", message: "", delayDays: 0, delayHours: 0 }]);
  };

  const handleToggleActive = (campaignId: string, currentState: boolean) => {
    updateDripCampaign(campaignId, { isActive: !currentState });
    toast.success(currentState ? "Campaign paused" : "Campaign activated");
    refreshCampaigns();
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteDripCampaign(campaignId);
    toast.success("Campaign deleted");
    refreshCampaigns();
  };

  const handleEnrollWorkflows = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign || !campaign.isActive) {
      toast.error("Campaign must be active to enroll workflows");
      return;
    }

    const newWorkflows = workflows.slice(0, 3); // Demo: enroll first 3
    newWorkflows.forEach(workflow => {
      try {
        enrollInDripCampaign(campaignId, workflow.id);
      } catch (error) {
        console.error("Enrollment error:", error);
      }
    });

    toast.success(`Enrolled ${newWorkflows.length} workflows`);
    refreshCampaigns();
  };

  const addEmail = () => {
    setEmails([...emails, { 
      name: `Day ${emails.length + 1}`, 
      emailType: "welcome", 
      message: "", 
      delayDays: emails.length, 
      delayHours: 0 
    }]);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, updates: Partial<Omit<DripEmail, 'id'>>) => {
    const updated = [...emails];
    updated[index] = { ...updated[index], ...updates };
    setEmails(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Drip Campaigns
          </h3>
          <p className="text-sm text-muted-foreground">
            Automated email sequences triggered by employee actions
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No drip campaigns yet.<br />
              Create automated email sequences to nurture new employees.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {campaign.name}
                      <Badge variant={campaign.isActive ? "default" : "secondary"}>
                        {campaign.isActive ? "Active" : "Paused"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${campaign.id}`} className="text-sm">
                        {campaign.isActive ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Label>
                      <Switch
                        id={`active-${campaign.id}`}
                        checked={campaign.isActive}
                        onCheckedChange={() => handleToggleActive(campaign.id, campaign.isActive)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnrollWorkflows(campaign.id)}
                      disabled={!campaign.isActive}
                    >
                      Enroll Workflows
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Enrolled</p>
                      <p className="text-xl font-bold">{campaign.stats.totalEnrolled}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Play className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-xl font-bold">{campaign.stats.activeEnrollments}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Emails Sent</p>
                      <p className="text-xl font-bold">{campaign.stats.emailsSent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-xl font-bold">{campaign.stats.completedEnrollments}</p>
                    </div>
                  </div>
                </div>

                {/* Email Sequence */}
                <div>
                  <h4 className="font-semibold mb-3">Email Sequence ({campaign.emails.length} emails)</h4>
                  <div className="space-y-3">
                    {campaign.emails.map((email, index) => (
                      <div key={email.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{email.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{email.message}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {email.delayDays}d {email.delayHours}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger Info */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Trigger: </span>
                  <Badge variant="outline">
                    {campaign.trigger.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Drip Campaign</DialogTitle>
            <DialogDescription>
              Build an automated email sequence that sends over time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g., New Hire Welcome Series"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the purpose of this campaign..."
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select value={trigger} onValueChange={(v) => setTrigger(v as DripCampaign['trigger'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow_created">When workflow is created</SelectItem>
                  <SelectItem value="status_change">On status change</SelectItem>
                  <SelectItem value="task_completed">When task completed</SelectItem>
                  <SelectItem value="manual">Manual enrollment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Sequence</Label>
                <Button size="sm" variant="outline" onClick={addEmail}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Email
                </Button>
              </div>

              {emails.map((email, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Email {index + 1}</h4>
                    {index > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => removeEmail(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={email.name}
                        onChange={(e) => updateEmail(index, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={email.emailType} 
                        onValueChange={(v) => updateEmail(index, { emailType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="document">Document Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Delay (Days)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={email.delayDays}
                        onChange={(e) => updateEmail(index, { delayDays: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delay (Hours)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={email.delayHours}
                        onChange={(e) => updateEmail(index, { delayHours: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Enter email message..."
                      value={email.message}
                      onChange={(e) => updateEmail(index, { message: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
