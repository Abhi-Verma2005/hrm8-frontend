import { Employer } from "@/types/entities";
import { AccountSettingsCard } from "./AccountSettingsCard";
import { RecruiterTeamCard } from "./RecruiterTeamCard";
import { TerritorySettingsCard } from "./TerritorySettingsCard";
import { TagsManagerCard } from "./TagsManagerCard";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
import ModuleSettingsCard from "@/components/employers/cards/ModuleSettingsCard";

interface SettingsTabProps {
  employerId: string;
  employer: Employer;
}

export function SettingsTab({ employerId, employer }: SettingsTabProps) {
  const handleModuleChange = (atsEnabled: boolean, hrmsEnabled: boolean, hrmsEmployeeCount: number) => {
    // In production, this would call an API to update the employer's module configuration
    console.log('Module configuration updated:', { atsEnabled, hrmsEnabled, hrmsEmployeeCount });
    // TODO: Integrate with actual employer update service
  };

  return (
    <div className="space-y-6">
      <ModuleSettingsCard 
        currentTier={employer.subscriptionTier}
        atsEnabled={employer.modules.atsEnabled}
        hrmsEnabled={employer.modules.hrmsEnabled}
        hrmsEmployeeCount={employer.modules.hrmsEmployeeCount || 0}
        onModuleChange={handleModuleChange}
      />
      <AccountSettingsCard employerId={employerId} />
      <RecruiterTeamCard employerId={employerId} />
      <TerritorySettingsCard employerId={employerId} />
      <TagsManagerCard employerId={employerId} />
      <NotificationSettingsCard employerId={employerId} />
    </div>
  );
}
