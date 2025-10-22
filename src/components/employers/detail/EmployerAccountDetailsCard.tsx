import { Employer } from "@/types/entities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, Activity } from "lucide-react";
import { DetailRow } from "./shared/DetailRow";
import { formatRelativeDate } from "@/lib/utils";

interface EmployerMetrics {
  lastActivityDate: Date;
}

interface EmployerAccountDetailsCardProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerAccountDetailsCard({ employer, metrics }: EmployerAccountDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          <CardTitle>Account Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information Section */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Company Information</h4>
          <div className="space-y-3">
            <DetailRow label="Industry" value={employer.industry} />
            {employer.website && (
              <DetailRow label="Website" value={employer.website} link />
            )}
            <DetailRow label="Email" value={employer.email} />
          </div>
        </div>
        
        <Separator />
        
        {/* Organization Structure */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Organization</h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailRow label="Departments" value={employer.departments?.length || 0} />
            <DetailRow label="Locations" value={employer.locations?.length || 0} />
          </div>
        </div>
        
        <Separator />
        
        {/* Timeline */}
        <div className="space-y-3">
          <DetailRow 
            label="Member Since" 
            value={formatRelativeDate(employer.createdAt)}
            icon={Calendar}
          />
          <DetailRow 
            label="Last Activity" 
            value={formatRelativeDate(metrics.lastActivityDate)}
            icon={Activity}
          />
        </div>
      </CardContent>
    </Card>
  );
}
