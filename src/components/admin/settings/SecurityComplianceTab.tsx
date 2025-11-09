import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, Database, FileCheck, Activity, HardDrive, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
}

interface MFASettings {
  enforceMFA: boolean;
  allowedMethods: string[];
}

interface SessionSettings {
  timeoutMinutes: number;
  maxConcurrentSessions: number;
  forceLogoutOnPasswordChange: boolean;
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  user?: string;
}

export function SecurityComplianceTab() {
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  });

  const [mfaSettings, setMFASettings] = useState<MFASettings>({
    enforceMFA: true,
    allowedMethods: ['authenticator', 'sms'],
  });

  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    timeoutMinutes: 30,
    maxConcurrentSessions: 3,
    forceLogoutOnPasswordChange: true,
  });

  const [ipWhitelist, setIpWhitelist] = useState<string[]>([
    '192.168.1.0/24',
    '10.0.0.0/8',
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'Failed Login',
      severity: 'medium',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-11-08 14:30:00',
      user: 'john.doe@company.com',
    },
    {
      id: '2',
      type: 'Permission Change',
      severity: 'high',
      description: 'Super admin role assigned to new user',
      timestamp: '2024-11-08 12:15:00',
      user: 'admin@company.com',
    },
    {
      id: '3',
      type: 'Unusual Activity',
      severity: 'low',
      description: 'Login from new location detected',
      timestamp: '2024-11-08 09:45:00',
      user: 'jane.smith@company.com',
    },
  ]);

  const [securityScore] = useState(85);

  const handleSavePasswordPolicy = () => {
    toast({
      title: "Password policy updated",
      description: "New password requirements will apply to all users.",
    });
  };

  const handleSaveMFA = () => {
    toast({
      title: "MFA settings updated",
      description: "Multi-factor authentication settings have been saved.",
    });
  };

  const handleSaveSession = () => {
    toast({
      title: "Session settings updated",
      description: "Session management settings have been saved.",
    });
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      low: { variant: 'secondary', className: '' },
      medium: { variant: 'default', className: 'bg-yellow-500' },
      high: { variant: 'default', className: 'bg-orange-500' },
      critical: { variant: 'destructive', className: '' },
    };
    const config = variants[severity] || variants.low;
    return (
      <Badge variant={config.variant} className={config.className}>
        {severity}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="privacy">Data Privacy</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Authentication & Access Tab */}
        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Authentication & Access</CardTitle>
                  <CardDescription>Configure password policies and authentication methods</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Password Policy</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Password Length: {passwordPolicy.minLength}</Label>
                    <Slider
                      value={[passwordPolicy.minLength]}
                      onValueChange={([value]) => setPasswordPolicy({ ...passwordPolicy, minLength: value })}
                      min={6}
                      max={32}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    <Switch
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireUppercase: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                    <Switch
                      id="requireLowercase"
                      checked={passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireLowercase: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireNumbers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireSpecialChars: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry</Label>
                    <Select
                      value={passwordPolicy.expiryDays.toString()}
                      onValueChange={(value) => setPasswordPolicy({ ...passwordPolicy, expiryDays: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Never</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                        <SelectItem value="180">180 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSavePasswordPolicy}>Save Password Policy</Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Multi-Factor Authentication (MFA)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enforceMFA">Enforce MFA for All Users</Label>
                      <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
                    </div>
                    <Switch
                      id="enforceMFA"
                      checked={mfaSettings.enforceMFA}
                      onCheckedChange={(checked) => setMFASettings({ ...mfaSettings, enforceMFA: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Allowed MFA Methods</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="mfa-auth" defaultChecked />
                        <Label htmlFor="mfa-auth">Authenticator App</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="mfa-sms" defaultChecked />
                        <Label htmlFor="mfa-sms">SMS</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="mfa-email" />
                        <Label htmlFor="mfa-email">Email</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveMFA}>Save MFA Settings</Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Session Management</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={sessionSettings.timeoutMinutes}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, timeoutMinutes: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxSessions">Max Concurrent Sessions</Label>
                    <Input
                      id="maxSessions"
                      type="number"
                      value={sessionSettings.maxConcurrentSessions}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, maxConcurrentSessions: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="forceLogout">Force Logout on Password Change</Label>
                    <Switch
                      id="forceLogout"
                      checked={sessionSettings.forceLogoutOnPasswordChange}
                      onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, forceLogoutOnPasswordChange: checked })}
                    />
                  </div>

                  <Button onClick={handleSaveSession}>Save Session Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Manage IP restrictions and access rules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">IP Whitelist</h3>
                <div className="space-y-2">
                  {ipWhitelist.map((ip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={ip} readOnly />
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  ))}
                  <Button variant="outline">Add IP Range</Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Failed Login Protection</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Failed Attempts Before Lockout</Label>
                    <Input id="maxAttempts" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input id="lockoutDuration" type="number" defaultValue="30" />
                  </div>
                  <Button>Save Protection Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Data Privacy</CardTitle>
                  <CardDescription>GDPR compliance and data protection settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Data Encryption</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Data at Rest</span>
                    <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Data in Transit</span>
                    <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Enabled</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">GDPR Compliance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gdprCompliance">Enable GDPR Features</Label>
                    <Switch id="gdprCompliance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cookieConsent">Cookie Consent Banner</Label>
                    <Switch id="cookieConsent" defaultChecked />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Privacy Policy Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Compliance & Certifications</CardTitle>
                  <CardDescription>View compliance status and certifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'SOC 2 Type II', status: 'certified', date: '2024-06-15' },
                  { name: 'ISO 27001', status: 'certified', date: '2024-05-20' },
                  { name: 'HIPAA', status: 'in-progress', date: null },
                  { name: 'GDPR', status: 'certified', date: '2024-01-10' },
                ].map((cert) => (
                  <div key={cert.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{cert.name}</h4>
                      <Badge variant={cert.status === 'certified' ? 'default' : 'secondary'}>
                        {cert.status === 'certified' ? 'Certified' : 'In Progress'}
                      </Badge>
                    </div>
                    {cert.date && (
                      <p className="text-sm text-muted-foreground">
                        Last audit: {cert.date}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Compliance Reports
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Security Monitoring</CardTitle>
                  <CardDescription>View security events and alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Security Score</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${securityScore * 2.51} ${251}`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{securityScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Good Security Posture</p>
                    <p className="text-sm text-muted-foreground">
                      Your security score is above average
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Recent Security Events</h3>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="p-3 text-left text-sm font-medium">Type</th>
                        <th className="p-3 text-left text-sm font-medium">Severity</th>
                        <th className="p-3 text-left text-sm font-medium">Description</th>
                        <th className="p-3 text-left text-sm font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityEvents.map((event) => (
                        <tr key={event.id} className="border-b">
                          <td className="p-3 font-medium">{event.type}</td>
                          <td className="p-3">{getSeverityBadge(event.severity)}</td>
                          <td className="p-3 text-sm">{event.description}</td>
                          <td className="p-3 text-sm text-muted-foreground">{event.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Backup & Recovery</CardTitle>
                  <CardDescription>Manage data backups and disaster recovery</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Backup Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Last Backup</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Next Scheduled Backup</span>
                    <span className="text-sm text-muted-foreground">In 22 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Backup Retention</span>
                    <span className="text-sm text-muted-foreground">30 days</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Backup Actions</h3>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Disaster Recovery Plan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload or download your disaster recovery documentation
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Upload Plan</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Current Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
