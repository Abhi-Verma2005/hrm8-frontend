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
import { getEmployerSettings, updateTerritory } from "@/lib/employerSettingsStorage";
import { toast } from "@/hooks/use-toast";

interface TerritorySettingsCardProps {
  employerId: string;
}

const territories = {
  'West Coast': ['California', 'Oregon', 'Washington', 'Nevada', 'Arizona'],
  'East Coast': ['New York', 'Massachusetts', 'Pennsylvania', 'New Jersey', 'Florida'],
  'Midwest': ['Illinois', 'Ohio', 'Michigan', 'Wisconsin', 'Minnesota'],
  'South': ['Texas', 'Georgia', 'North Carolina', 'Tennessee', 'Louisiana'],
  'International': ['Canada', 'UK', 'Australia', 'Europe'],
};

export function TerritorySettingsCard({ employerId }: TerritorySettingsCardProps) {
  const [settings, setSettings] = useState(getEmployerSettings(employerId));
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>(
    settings.territory
  );
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    settings.region
  );
  const [hasChanges, setHasChanges] = useState(false);

  const availableRegions = selectedTerritory
    ? territories[selectedTerritory as keyof typeof territories] || []
    : [];

  useEffect(() => {
    setHasChanges(
      selectedTerritory !== settings.territory ||
      selectedRegion !== settings.region
    );
  }, [selectedTerritory, selectedRegion, settings]);

  useEffect(() => {
    // Reset region if territory changes and current region is not valid
    if (selectedTerritory && selectedRegion) {
      const validRegions = territories[selectedTerritory as keyof typeof territories] || [];
      if (!validRegions.includes(selectedRegion)) {
        setSelectedRegion(undefined);
      }
    }
  }, [selectedTerritory, selectedRegion]);

  const handleSave = () => {
    const success = updateTerritory(employerId, selectedTerritory, selectedRegion);

    if (success) {
      setSettings(getEmployerSettings(employerId));
      setHasChanges(false);
      toast({ title: "Territory updated successfully" });
    } else {
      toast({
        title: "Failed to update territory",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Territory & Region</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Territory</label>
          <Select
            value={selectedTerritory || 'unassigned'}
            onValueChange={(value) => setSelectedTerritory(value === 'unassigned' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {Object.keys(territories).map(territory => (
                <SelectItem key={territory} value={territory}>
                  {territory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select
            value={selectedRegion || 'unassigned'}
            onValueChange={(value) => setSelectedRegion(value === 'unassigned' ? undefined : value)}
            disabled={!selectedTerritory}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedTerritory ? "Select region" : "Select territory first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {availableRegions.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
