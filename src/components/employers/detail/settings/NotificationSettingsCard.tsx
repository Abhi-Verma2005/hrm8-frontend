import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getEmployerSettings, updateNotificationSettings } from "@/lib/employerSettingsStorage";
import { NotificationSettings } from "@/types/employerCRM";
import { toast } from "@/hooks/use-toast";

interface NotificationSettingsCardProps {
  employerId: string;
}

export function NotificationSettingsCard({ employerId }: NotificationSettingsCardProps) {
  const [settings, setSettings] = useState(getEmployerSettings(employerId));
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    settings.notificationSettings
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    const success = updateNotificationSettings(employerId, notificationSettings);

    if (success) {
      setSettings(getEmployerSettings(employerId));
      setHasChanges(false);
      toast({ title: "Notification preferences updated" });
    } else {
      toast({
        title: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">New Job Posted</label>
              <p className="text-xs text-muted-foreground">
                Notify when a new job is posted
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailOnJobPosted}
              onCheckedChange={() => handleToggle('emailOnJobPosted')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Invoice Due</label>
              <p className="text-xs text-muted-foreground">
                Notify 7 days before invoice is due
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailOnInvoiceDue}
              onCheckedChange={() => handleToggle('emailOnInvoiceDue')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Subscription Change</label>
              <p className="text-xs text-muted-foreground">
                Notify when subscription is changed
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailOnSubscriptionChange}
              onCheckedChange={() => handleToggle('emailOnSubscriptionChange')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Low Balance Warning</label>
              <p className="text-xs text-muted-foreground">
                Notify when balance is below $100
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailOnLowBalance}
              onCheckedChange={() => handleToggle('emailOnLowBalance')}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
