import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateConsultantSettings, getConsultantSettings } from '@/lib/consultantSettingsStorage';
import { toast } from '@/hooks/use-toast';
import type { Consultant } from '@/types/consultant';

interface NotificationSettingsCardProps {
  consultantId: string;
  consultant: Consultant;
}

export function NotificationSettingsCard({ consultantId, consultant }: NotificationSettingsCardProps) {
  const settings = getConsultantSettings(consultantId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications: settings.emailNotifications,
    smsNotifications: settings.smsNotifications,
    notifyOnAssignment: settings.notifyOnAssignment,
    notifyOnCommission: settings.notifyOnCommission,
    notifyOnPerformanceAlert: settings.notifyOnPerformanceAlert,
  });

  const handleSave = () => {
    updateConsultantSettings(consultantId, formData);
    setIsEditing(false);
    toast({ title: 'Notification settings updated successfully' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notification Settings</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={formData.smsNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, smsNotifications: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Assignment Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about new assignments</p>
            </div>
            <Switch
              checked={formData.notifyOnAssignment}
              onCheckedChange={(checked) => setFormData({ ...formData, notifyOnAssignment: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Commission Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about commission updates</p>
            </div>
            <Switch
              checked={formData.notifyOnCommission}
              onCheckedChange={(checked) => setFormData({ ...formData, notifyOnCommission: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Performance Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about performance milestones</p>
            </div>
            <Switch
              checked={formData.notifyOnPerformanceAlert}
              onCheckedChange={(checked) => setFormData({ ...formData, notifyOnPerformanceAlert: checked })}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
