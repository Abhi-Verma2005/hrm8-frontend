import { useState, useEffect } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bell, Plus, Trash2, Save, Settings2, Moon, Mail, Smartphone, MessageSquare } from 'lucide-react';
import type { NotificationPreferences, AlertRule, NotificationEventType, NotificationChannel } from '@/types/notificationPreferences';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getAlertRules,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
} from '@/lib/notificationPreferencesStorage';
import { notify } from '@/lib/notifications';
import { initializeMockAlertRules } from '@/data/mockAlertRules';

const EVENT_LABELS: Record<NotificationEventType, string> = {
  support_ticket_created: 'Support Ticket Created',
  support_ticket_urgent: 'Urgent Support Ticket',
  recruitment_service_pending: 'Recruitment Service Pending',
  user_signup: 'New User Signup',
  payment_failed: 'Payment Failed',
  integration_down: 'Integration Down',
  system_error: 'System Error',
  security_alert: 'Security Alert',
  trial_expiring: 'Trial Expiring',
  subscription_cancelled: 'Subscription Cancelled',
};

const CHANNEL_ICONS = {
  email: Mail,
  'in-app': Bell,
  sms: Smartphone,
  slack: MessageSquare,
};

export default function NotificationPreferences() {
  const userId = 'super-admin';
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  useEffect(() => {
    initializeMockAlertRules();
    loadPreferences();
    loadAlertRules();
  }, []);

  const loadPreferences = () => {
    const prefs = getNotificationPreferences(userId);
    setPreferences(prefs);
  };

  const loadAlertRules = () => {
    const rules = getAlertRules();
    setAlertRules(rules);
  };

  const handleToggleEvent = (eventType: NotificationEventType, enabled: boolean) => {
    if (!preferences) return;

    const updated = {
      ...preferences,
      eventPreferences: {
        ...preferences.eventPreferences,
        [eventType]: {
          ...preferences.eventPreferences[eventType],
          enabled,
        },
      },
    };

    setPreferences(updated);
  };

  const handleToggleChannel = (eventType: NotificationEventType, channel: NotificationChannel) => {
    if (!preferences) return;

    const currentChannels = preferences.eventPreferences[eventType].channels;
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];

    const updated = {
      ...preferences,
      eventPreferences: {
        ...preferences.eventPreferences,
        [eventType]: {
          ...preferences.eventPreferences[eventType],
          channels: newChannels,
        },
      },
    };

    setPreferences(updated);
  };

  const handleSavePreferences = () => {
    if (!preferences) return;
    updateNotificationPreferences(userId, preferences);
    notify.success('Notification preferences saved');
  };

  const handleToggleQuietHours = (enabled: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours!,
        enabled,
      },
    });
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours!,
        [field]: value,
      },
    });
  };

  const handleCreateRule = () => {
    setEditingRule({
      id: '',
      name: '',
      description: '',
      enabled: true,
      eventType: 'support_ticket_urgent',
      conditions: [],
      actions: {
        channels: ['email', 'in-app'],
        recipients: [],
        priority: 'high',
      },
      createdAt: '',
      updatedAt: '',
      createdBy: userId,
    });
    setIsRuleDialogOpen(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;

    if (editingRule.id) {
      updateAlertRule(editingRule.id, editingRule);
      notify.success('Alert rule updated');
    } else {
      createAlertRule(editingRule);
      notify.success('Alert rule created');
    }

    loadAlertRules();
    setIsRuleDialogOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: string) => {
    if (deleteAlertRule(id)) {
      notify.success('Alert rule deleted');
      loadAlertRules();
    }
  };

  const handleToggleRule = (id: string, enabled: boolean) => {
    updateAlertRule(id, { enabled });
    loadAlertRules();
  };

  if (!preferences) return null;

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader 
          title="Notification Preferences" 
          subtitle="Configure notification channels and automated alert rules"
        >
          <Button onClick={handleSavePreferences}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </AtsPageHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Event Notifications
              </CardTitle>
              <CardDescription className="text-sm">Configure which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences.eventPreferences).map(([eventType, config]) => (
                <div key={eventType} className="space-y-2 pb-4 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{EVENT_LABELS[eventType as NotificationEventType]}</Label>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => handleToggleEvent(eventType as NotificationEventType, checked)}
                    />
                  </div>
                  {config.enabled && (
                    <div className="flex gap-2 ml-6">
                      {(['email', 'in-app', 'sms', 'slack'] as NotificationChannel[]).map((channel) => {
                        const Icon = CHANNEL_ICONS[channel];
                        const isActive = config.channels.includes(channel);
                        return (
                          <Button
                            key={channel}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleChannel(eventType as NotificationEventType, channel)}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {channel}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Quiet Hours
              </CardTitle>
              <CardDescription className="text-sm">Pause non-critical notifications during specific hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Quiet Hours</Label>
                <Switch
                  checked={preferences.quietHours?.enabled}
                  onCheckedChange={handleToggleQuietHours}
                />
              </div>
              {preferences.quietHours?.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Alert Rules
                </CardTitle>
                <CardDescription className="text-sm">Configure automated alert rules with custom conditions</CardDescription>
              </div>
              <Button onClick={handleCreateRule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertRules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alert rules configured yet</p>
                </div>
              ) : (
                alertRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-semibold">{rule.name}</h4>
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                            <Badge variant="outline">{rule.actions.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                          <div className="flex gap-2 text-xs">
                            <span className="text-muted-foreground">Event: {EVENT_LABELS[rule.eventType]}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              Channels: {rule.actions.channels.join(', ')}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              Recipients: {rule.actions.recipients.length}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRule(rule)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule?.id ? 'Edit Alert Rule' : 'Create Alert Rule'}</DialogTitle>
              <DialogDescription>Configure automated alerts based on specific conditions</DialogDescription>
            </DialogHeader>
            {editingRule && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                    placeholder="e.g., Critical Ticket Alert"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingRule.description}
                    onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                    placeholder="Describe when this rule should trigger"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={editingRule.eventType}
                    onValueChange={(value) => setEditingRule({ ...editingRule, eventType: value as NotificationEventType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={editingRule.actions.priority}
                    onValueChange={(value: any) => setEditingRule({
                      ...editingRule,
                      actions: { ...editingRule.actions, priority: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recipients (comma-separated emails)</Label>
                  <Input
                    value={editingRule.actions.recipients.join(', ')}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      actions: {
                        ...editingRule.actions,
                        recipients: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    })}
                    placeholder="admin@example.com, manager@example.com"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveRule}>Save Rule</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  );
}
