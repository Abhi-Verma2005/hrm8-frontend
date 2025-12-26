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
import { getEmployerSettings, updateAccountManager, updatePrimaryRecruiter } from "@/lib/employerSettingsStorage";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { mockRecruiters } from "@/data/mockRecruiters";

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
  const [selectedRecruiter, setSelectedRecruiter] = useState<string | undefined>(
    settings.primaryRecruiterId
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(
      selectedManager !== settings.accountManagerId ||
      selectedRecruiter !== settings.primaryRecruiterId
    );
  }, [selectedManager, selectedRecruiter, settings.accountManagerId, settings.primaryRecruiterId]);

  const handleSave = () => {
    const manager = accountManagers.find(m => m.id === selectedManager);
    const recruiter = mockRecruiters.find(r => r.id === selectedRecruiter);
    
    const managerSuccess = updateAccountManager(
      employerId,
      selectedManager,
      manager?.name
    );
    
    const recruiterSuccess = updatePrimaryRecruiter(
      employerId,
      selectedRecruiter,
      recruiter?.name
    );

    if (managerSuccess && recruiterSuccess) {
      setSettings(getEmployerSettings(employerId));
      setHasChanges(false);
      toast({ title: "Account settings updated successfully" });
    } else {
      toast({
        title: "Failed to update account settings",
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Recruiter</label>
          <Select
            value={selectedRecruiter || 'unassigned'}
            onValueChange={(value) => setSelectedRecruiter(value === 'unassigned' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {mockRecruiters.map(recruiter => (
                <SelectItem key={recruiter.id} value={recruiter.id}>
                  {recruiter.name}
                  {recruiter.specialization && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({recruiter.specialization})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRecruiter && selectedRecruiter !== 'unassigned' && (
            <p className="text-xs text-muted-foreground">
              {mockRecruiters.find(r => r.id === selectedRecruiter)?.specialization}
            </p>
          )}
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
