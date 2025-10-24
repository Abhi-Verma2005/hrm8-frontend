import { Employer } from "@/types/entities";
import { EmployerAccountSnapshot } from "./EmployerAccountSnapshot";
import { EmployerCompanyProfile } from "./EmployerCompanyProfile";
import { EmployerEngagementPanel } from "./EmployerEngagementPanel";
import { calculateEmployerMetrics } from "@/lib/employerService";

interface EmployerOverviewProps {
  employer: Employer;
}

export function EmployerOverview({ employer }: EmployerOverviewProps) {
  const metrics = calculateEmployerMetrics(employer);

  return (
    <div className="space-y-6">
      {/* Zone 1: Account Snapshot */}
      <EmployerAccountSnapshot employer={employer} metrics={metrics} />

      {/* Zones 2 & 3: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone 2: Company Profile (Takes 2 columns) */}
        <div className="lg:col-span-2">
          <EmployerCompanyProfile employer={employer} metrics={metrics} />
        </div>

        {/* Zone 3: Engagement Panel (Takes 1 column) */}
        <div className="lg:col-span-1">
          <EmployerEngagementPanel employer={employer} />
        </div>
      </div>
    </div>
  );
}
