import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateConsultantSettings, getConsultantSettings } from '@/lib/consultantSettingsStorage';
import { toast } from '@/hooks/use-toast';
import type { Consultant } from '@/types/consultant';

interface CommissionSettingsCardProps {
  consultantId: string;
  consultant: Consultant;
}

export function CommissionSettingsCard({ consultantId, consultant }: CommissionSettingsCardProps) {
  const settings = getConsultantSettings(consultantId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    commissionStructure: settings.commissionStructure,
    defaultCommissionRate: settings.defaultCommissionRate || 15,
  });

  const handleSave = () => {
    updateConsultantSettings(consultantId, formData);
    setIsEditing(false);
    toast({ title: 'Commission settings updated successfully' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Commission Settings</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Commission Structure</Label>
            <Select
              value={formData.commissionStructure}
              onValueChange={(value: any) => setFormData({ ...formData, commissionStructure: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat Rate</SelectItem>
                <SelectItem value="tiered">Tiered</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.commissionStructure === 'percentage' && (
            <div className="space-y-2">
              <Label>Default Commission Rate (%)</Label>
              <Input
                type="number"
                value={formData.defaultCommissionRate}
                onChange={(e) => setFormData({ ...formData, defaultCommissionRate: parseFloat(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
          )}

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
