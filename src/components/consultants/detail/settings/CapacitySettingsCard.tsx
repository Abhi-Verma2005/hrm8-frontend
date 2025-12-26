import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateConsultantSettings, getConsultantSettings } from '@/lib/consultantSettingsStorage';
import { toast } from '@/hooks/use-toast';
import type { Consultant } from '@/types/consultant';

interface CapacitySettingsCardProps {
  consultantId: string;
  consultant: Consultant;
}

export function CapacitySettingsCard({ consultantId, consultant }: CapacitySettingsCardProps) {
  const settings = getConsultantSettings(consultantId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    maxEmployers: settings.maxEmployers,
    maxJobs: settings.maxJobs,
    autoAssign: settings.autoAssign,
  });

  const handleSave = () => {
    updateConsultantSettings(consultantId, formData);
    setIsEditing(false);
    toast({ title: 'Capacity settings updated successfully' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Capacity Settings</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Employers</Label>
              <Input
                type="number"
                value={formData.maxEmployers}
                onChange={(e) => setFormData({ ...formData, maxEmployers: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
              <p className="text-xs text-muted-foreground">Currently assigned: {consultant.currentEmployers}</p>
            </div>
            <div className="space-y-2">
              <Label>Max Jobs</Label>
              <Input
                type="number"
                value={formData.maxJobs}
                onChange={(e) => setFormData({ ...formData, maxJobs: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
              <p className="text-xs text-muted-foreground">Currently assigned: {consultant.currentJobs}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Assignment</Label>
              <p className="text-sm text-muted-foreground">Automatically assign new leads</p>
            </div>
            <Switch
              checked={formData.autoAssign}
              onCheckedChange={(checked) => setFormData({ ...formData, autoAssign: checked })}
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
