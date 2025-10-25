import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployerSettings, updateAccountManager } from "@/lib/employerSettingsStorage";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface AccountSettingsCardProps {
  employerId: string;
}

// Mock account managers
const accountManagers = [
  { id: 'user_1', name: 'Sarah Johnson' },
  { id: 'user_2', name: 'Michael Chen' },
  { id: 'user_3', name: 'Emily Rodriguez' },
  { id: 'user_4', name: 'David Kim' },
  { id: 'user_5', name: 'Lisa Anderson' },
];

export function AccountSettingsCard({ employerId }: AccountSettingsCardProps) {
  const [settings, setSettings] = useState(getEmployerSettings(employerId));
  const [selectedManager, setSelectedManager] = useState<string | undefined>(
    settings.accountManagerId
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(selectedManager !== settings.accountManagerId);
  }, [selectedManager, settings.accountManagerId]);

  const handleSave = () => {
    const manager = accountManagers.find(m => m.id === selectedManager);
    const success = updateAccountManager(
      employerId,
      selectedManager,
      manager?.name
    );

    if (success) {
      setSettings(getEmployerSettings(employerId));
      setHasChanges(false);
      toast({ title: "Account manager updated successfully" });
    } else {
      toast({
        title: "Failed to update account manager",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Manager</label>
          <Select
            value={selectedManager || 'unassigned'}
            onValueChange={(value) => setSelectedManager(value === 'unassigned' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {accountManagers.map(manager => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {settings.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated: {formatDistanceToNow(new Date(settings.updatedAt), { addSuffix: true })}
          </p>
        )}

        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
