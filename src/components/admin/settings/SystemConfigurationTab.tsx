import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Globe, Mail, Bell, Database, Key, Check, Copy, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { logConfigAction } from "@/lib/auditLogService";

interface SystemConfig {
  systemName: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  defaultLanguage: string;
}

interface EmailConfig {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpEncryption: string;
  fromEmail: string;
  fromName: string;
  emailSignature: string;
}

interface NotificationConfig {
  systemNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationFrequency: string;
}

interface DataConfig {
  dataRetention: string;
  autoBackupSchedule: string;
  storageUsed: number;
  storageLimit: number;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

export function SystemConfigurationTab() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    systemName: "HRM8 Platform",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12hr",
    defaultLanguage: "en",
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "system@company.com",
    smtpEncryption: "TLS",
    fromEmail: "noreply@company.com",
    fromName: "HRM8 System",
    emailSignature: "Best regards,\nThe HRM8 Team",
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    systemNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    notificationFrequency: "immediate",
  });

  const [dataConfig] = useState<DataConfig>({
    dataRetention: "1year",
    autoBackupSchedule: "daily",
    storageUsed: 45.6,
    storageLimit: 100,
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_51abc...xyz',
      createdAt: '2024-01-15',
      lastUsed: '2024-11-08',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_51def...xyz',
      createdAt: '2024-02-20',
    },
  ]);

  const handleSaveGeneral = () => {
    logConfigAction('update', 'General Settings', 'Updated general system settings');
    toast({
      title: "Settings saved",
      description: "General system settings have been updated successfully.",
    });
  };

  const handleSaveEmail = () => {
    logConfigAction('update', 'Email Configuration', 'Updated email settings');
    toast({
      title: "Email settings saved",
      description: "Email configuration has been updated successfully.",
    });
  };

  const handleTestEmail = () => {
    logConfigAction('execute', 'Email Test', 'Sent test email');
    toast({
      title: "Test email sent",
      description: "A test email has been sent to verify your configuration.",
    });
  };

  const handleSaveNotifications = () => {
    logConfigAction('update', 'Notification Settings', 'Updated notification preferences');
    toast({
      title: "Notification settings saved",
      description: "Notification preferences have been updated successfully.",
    });
  };

  const handleGenerateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setApiKeys([...apiKeys, newKey]);
    
    logConfigAction('create', 'API Key', `Generated new API key: ${newKey.name}`, {
      keyId: { before: null, after: newKey.id }
    });
    
    toast({
      title: "API key generated",
      description: "New API key has been created successfully.",
    });
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const handleRevokeApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
    
    if (key) {
      logConfigAction('delete', 'API Key', `Revoked API key: ${key.name}`, {
        keyId: { before: id, after: null }
      });
    }
    
    toast({
      title: "API key revoked",
      description: "The API key has been permanently revoked.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Storage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure system-wide preferences and defaults</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={systemConfig.systemName}
                  onChange={(e) => setSystemConfig({ ...systemConfig, systemName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={systemConfig.timezone}
                    onValueChange={(value) => setSystemConfig({ ...systemConfig, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select
                    value={systemConfig.defaultLanguage}
                    onValueChange={(value) => setSystemConfig({ ...systemConfig, defaultLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={systemConfig.dateFormat}
                    onValueChange={(value) => setSystemConfig({ ...systemConfig, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={systemConfig.timeFormat}
                    onValueChange={(value) => setSystemConfig({ ...systemConfig, timeFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12hr">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24hr">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Configuration Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>Configure SMTP settings and email templates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailConfig.smtpUsername}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpUsername: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Select
                    value={emailConfig.smtpEncryption}
                    onValueChange={(value) => setEmailConfig({ ...emailConfig, smtpEncryption: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TLS">TLS</SelectItem>
                      <SelectItem value="SSL">SSL</SelectItem>
                      <SelectItem value="NONE">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailConfig.fromName}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailSignature">Email Signature</Label>
                <Textarea
                  id="emailSignature"
                  rows={4}
                  value={emailConfig.emailSignature}
                  onChange={(e) => setEmailConfig({ ...emailConfig, emailSignature: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEmail}>Save Changes</Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure system-wide notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemNotifications">System Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show in-app notifications for important events
                    </p>
                  </div>
                  <Switch
                    id="systemNotifications"
                    checked={notificationConfig.systemNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationConfig({ ...notificationConfig, systemNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notification emails to users
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationConfig.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationConfig({ ...notificationConfig, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationConfig.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationConfig({ ...notificationConfig, pushNotifications: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                <Select
                  value={notificationConfig.notificationFrequency}
                  onValueChange={(value) =>
                    setNotificationConfig({ ...notificationConfig, notificationFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Storage Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Data & Storage</CardTitle>
                  <CardDescription>Manage data retention and backup settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Storage Usage</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{dataConfig.storageUsed} GB used</span>
                    <span>{dataConfig.storageLimit} GB total</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(dataConfig.storageUsed / dataConfig.storageLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention Period</Label>
                <Select value={dataConfig.dataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="autoBackup">Auto-Backup Schedule</Label>
                <Select value={dataConfig.autoBackupSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>Manage API keys and access control</CardDescription>
                  </div>
                </div>
                <Button onClick={handleGenerateApiKey}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="p-3 text-left text-sm font-medium">Name</th>
                      <th className="p-3 text-left text-sm font-medium">Key</th>
                      <th className="p-3 text-left text-sm font-medium">Created</th>
                      <th className="p-3 text-left text-sm font-medium">Last Used</th>
                      <th className="p-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((apiKey) => (
                      <tr key={apiKey.id} className="border-b">
                        <td className="p-3 font-medium">{apiKey.name}</td>
                        <td className="p-3">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{apiKey.key}</code>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{apiKey.createdAt}</td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {apiKey.lastUsed || 'Never'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyApiKey(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeApiKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
