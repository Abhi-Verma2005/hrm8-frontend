import { Employer } from "@/types/entities";
import { ModuleUsageAnalytics } from "@/components/analytics/ModuleUsageAnalytics";
import { BillingHistoryCard } from "@/components/billing/BillingHistoryCard";

interface AnalyticsTabProps {
  employer: Employer;
}

export function AnalyticsTab({ employer }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <ModuleUsageAnalytics employerId={employer.id} />
      <BillingHistoryCard employerId={employer.id} />
    </div>
  );
}
