import { Employer } from "@/types/entities";
import { EmployerAccountDetailsCard } from "./EmployerAccountDetailsCard";
import { EmployerSubscriptionCard } from "./EmployerSubscriptionCard";
import { EmployerFinancialCard } from "./EmployerFinancialCard";
import { EmployerActivityCard } from "./EmployerActivityCard";
import { calculateEmployerMetrics } from "@/lib/employerService";

interface EmployerOverviewProps {
  employer: Employer;
}

export function EmployerOverview({ employer }: EmployerOverviewProps) {
  const metrics = calculateEmployerMetrics(employer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Row */}
      <EmployerAccountDetailsCard employer={employer} metrics={metrics} />
      <EmployerSubscriptionCard employer={employer} />
      
      {/* Bottom Row */}
      <EmployerFinancialCard employer={employer} metrics={metrics} />
      <EmployerActivityCard employer={employer} metrics={metrics} />
    </div>
  );
}
