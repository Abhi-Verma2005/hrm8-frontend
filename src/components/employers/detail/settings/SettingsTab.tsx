import { Employer } from "@/types/entities";
import { AccountSettingsCard } from "./AccountSettingsCard";
import { RecruiterTeamCard } from "./RecruiterTeamCard";
import { TerritorySettingsCard } from "./TerritorySettingsCard";
import { TagsManagerCard } from "./TagsManagerCard";
import { NotificationSettingsCard } from "./NotificationSettingsCard";

interface SettingsTabProps {
  employerId: string;
  employer: Employer;
}

export function SettingsTab({ employerId }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <AccountSettingsCard employerId={employerId} />
      <RecruiterTeamCard employerId={employerId} />
      <TerritorySettingsCard employerId={employerId} />
      <TagsManagerCard employerId={employerId} />
      <NotificationSettingsCard employerId={employerId} />
    </div>
  );
}
