import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  getEmailPreferences, 
  createOrUpdatePreference, 
  unsubscribeFromAll, 
  resubscribe,
  getUnsubscribeStats,
  type EmailPreference 
} from "@/lib/emailPreferences";
import { getOnboardingWorkflows } from "@/lib/onboardingStorage";
import { toast } from "sonner";
import { Bell, BellOff, Mail, Search, Shield } from "lucide-react";

export function EmailPreferencesManager() {
  const [preferences, setPreferences] = useState<EmailPreference[]>(getEmailPreferences());
  const [searchQuery, setSearchQuery] = useState("");
  
  const workflows = useMemo(() => getOnboardingWorkflows(), []);
  const stats = useMemo(() => getUnsubscribeStats(), [preferences]);

  const refreshPreferences = () => {
    setPreferences(getEmailPreferences());
  };

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(w => 
      w.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workflows, searchQuery]);

  const getPreferenceForWorkflow = (workflowId: string): EmailPreference | null => {
    return preferences.find(p => p.workflowId === workflowId) || null;
  };

  const handleTogglePreference = (
    workflowId: string, 
    email: string, 
    preferenceKey: keyof EmailPreference['preferences'], 
    currentValue: boolean
  ) => {
    createOrUpdatePreference(workflowId, email, {
      [preferenceKey]: !currentValue,
    });
    toast.success("Preference updated");
    refreshPreferences();
  };

  const handleUnsubscribeAll = (workflowId: string, email: string) => {
    unsubscribeFromAll(workflowId, email);
    toast.success("Unsubscribed from all emails");
    refreshPreferences();
  };

  const handleResubscribe = (workflowId: string) => {
    resubscribe(workflowId);
    toast.success("Resubscribed to all emails");
    refreshPreferences();
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Email Preferences Center
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage employee email subscription preferences
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-green-600" />
                Subscribed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subscribed}</div>
              <p className="text-xs text-muted-foreground">Fully subscribed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Partial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.partiallyUnsubscribed}</div>
              <p className="text-xs text-muted-foreground">Some preferences off</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BellOff className="h-4 w-4 text-red-600" />
                Unsubscribed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.fullyUnsubscribed}</div>
              <p className="text-xs text-muted-foreground">All emails off</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">Total employees</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Employee List */}
      {filteredWorkflows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No employees found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map(workflow => {
            const pref = getPreferenceForWorkflow(workflow.id);
            const defaultPref: EmailPreference['preferences'] = {
              welcomeEmails: true,
              taskReminders: true,
              documentRequests: true,
              statusUpdates: true,
              generalAnnouncements: true,
            };
            const currentPref = pref?.preferences || defaultPref;
            const isUnsubscribed = pref?.isFullyUnsubscribed || false;

            return (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workflow.employeeName}
                        {isUnsubscribed && <Badge variant="destructive">Unsubscribed</Badge>}
                        {pref && !isUnsubscribed && Object.values(currentPref).some(v => !v) && (
                          <Badge variant="secondary">Custom Preferences</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{workflow.employeeEmail}</CardDescription>
                    </div>
                    {isUnsubscribed ? (
                      <Button onClick={() => handleResubscribe(workflow.id)}>
                        <Bell className="h-4 w-4 mr-2" />
                        Resubscribe
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={() => handleUnsubscribeAll(workflow.id, workflow.employeeEmail)}
                      >
                        <BellOff className="h-4 w-4 mr-2" />
                        Unsubscribe All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!isUnsubscribed && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`welcome-${workflow.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Welcome Emails</p>
                            <p className="text-sm text-muted-foreground">Initial onboarding messages</p>
                          </div>
                        </Label>
                        <Switch
                          id={`welcome-${workflow.id}`}
                          checked={currentPref.welcomeEmails}
                          onCheckedChange={() => handleTogglePreference(
                            workflow.id, 
                            workflow.employeeEmail, 
                            'welcomeEmails', 
                            currentPref.welcomeEmails
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`reminders-${workflow.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Task Reminders</p>
                            <p className="text-sm text-muted-foreground">Notifications for pending tasks</p>
                          </div>
                        </Label>
                        <Switch
                          id={`reminders-${workflow.id}`}
                          checked={currentPref.taskReminders}
                          onCheckedChange={() => handleTogglePreference(
                            workflow.id, 
                            workflow.employeeEmail, 
                            'taskReminders', 
                            currentPref.taskReminders
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`documents-${workflow.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Document Requests</p>
                            <p className="text-sm text-muted-foreground">Document upload reminders</p>
                          </div>
                        </Label>
                        <Switch
                          id={`documents-${workflow.id}`}
                          checked={currentPref.documentRequests}
                          onCheckedChange={() => handleTogglePreference(
                            workflow.id, 
                            workflow.employeeEmail, 
                            'documentRequests', 
                            currentPref.documentRequests
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`status-${workflow.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Status Updates</p>
                            <p className="text-sm text-muted-foreground">Progress notifications</p>
                          </div>
                        </Label>
                        <Switch
                          id={`status-${workflow.id}`}
                          checked={currentPref.statusUpdates}
                          onCheckedChange={() => handleTogglePreference(
                            workflow.id, 
                            workflow.employeeEmail, 
                            'statusUpdates', 
                            currentPref.statusUpdates
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`announcements-${workflow.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">General Announcements</p>
                            <p className="text-sm text-muted-foreground">Company-wide updates</p>
                          </div>
                        </Label>
                        <Switch
                          id={`announcements-${workflow.id}`}
                          checked={currentPref.generalAnnouncements}
                          onCheckedChange={() => handleTogglePreference(
                            workflow.id, 
                            workflow.employeeEmail, 
                            'generalAnnouncements', 
                            currentPref.generalAnnouncements
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {isUnsubscribed && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BellOff className="h-12 w-12 mx-auto mb-3" />
                      <p>This employee has unsubscribed from all emails</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
