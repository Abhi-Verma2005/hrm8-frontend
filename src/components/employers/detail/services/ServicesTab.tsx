import { ServicesOverviewCard } from "./ServicesOverviewCard";
import { ActiveServicesList } from "./ActiveServicesList";

interface ServicesTabProps {
  employerId: string;
}

export function ServicesTab({ employerId }: ServicesTabProps) {
  return (
    <div className="space-y-6">
      <ServicesOverviewCard employerId={employerId} />
      <ActiveServicesList employerId={employerId} />
    </div>
  );
}
