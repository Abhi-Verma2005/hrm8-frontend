import { PersonalSettingsCard } from './settings/PersonalSettingsCard';
import { CapacitySettingsCard } from './settings/CapacitySettingsCard';
import { CommissionSettingsCard } from './settings/CommissionSettingsCard';
import { NotificationSettingsCard } from './settings/NotificationSettingsCard';
import type { Consultant } from '@/types/consultant';

interface SettingsTabProps {
  consultantId: string;
  consultant: Consultant;
}

export function SettingsTab({ consultantId, consultant }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <PersonalSettingsCard consultantId={consultantId} consultant={consultant} />
      <CapacitySettingsCard consultantId={consultantId} consultant={consultant} />
      <CommissionSettingsCard consultantId={consultantId} consultant={consultant} />
      <NotificationSettingsCard consultantId={consultantId} consultant={consultant} />
    </div>
  );
}
