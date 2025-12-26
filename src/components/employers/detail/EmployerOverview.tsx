import { Employer } from "@/types/entities";
import { EmployerCompanyProfile } from "./EmployerCompanyProfile";
import { EmployerEngagementPanel } from "./EmployerEngagementPanel";
import { ContactsSection } from "./contacts/ContactsSection";
import { calculateEmployerMetrics } from "@/lib/employerService";
import { ModuleStatusCard } from "@/components/employers/cards/ModuleStatusCard";
import { ModuleAccessDetailsCard } from "@/components/employers/cards/ModuleAccessDetailsCard";
import { ModuleRecommendationsCard } from "@/components/recommendations/ModuleRecommendationsCard";
import { ModuleTrialCard } from "@/components/trials/ModuleTrialCard";

interface EmployerOverviewProps {
  employer: Employer;
}

export function EmployerOverview({ employer }: EmployerOverviewProps) {
  const metrics = calculateEmployerMetrics(employer);

  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
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

      {/* Module Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleStatusCard employer={employer} />
        <ModuleAccessDetailsCard employer={employer} />
      </div>

      {/* Smart Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleRecommendationsCard employerId={employer.id} />
        <ModuleTrialCard employerId={employer.id} />
      </div>
      
      {/* Contacts Section */}
      <ContactsSection employerId={employer.id} />
    </div>
  );
}
