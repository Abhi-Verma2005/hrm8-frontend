import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { getEmployerJobs } from "@/lib/employerJobService";

interface ServicesOverviewCardProps {
  employerId: string;
}

export function ServicesOverviewCard({ employerId }: ServicesOverviewCardProps) {
  const jobs = getEmployerJobs(employerId);
  
  const activeServices = jobs.filter(j => 
    j.status === 'open' && j.serviceType !== 'self-managed'
  ).length;
  
  const completedServices = jobs.filter(j => 
    j.status === 'closed' && j.serviceType !== 'self-managed'
  ).length;
  
  const totalRevenue = jobs
    .filter(j => j.serviceType !== 'self-managed')
    .reduce((sum, j) => sum + (j.serviceFee || 0), 0);
  
  const avgServiceValue = totalRevenue > 0 && (activeServices + completedServices) > 0
    ? Math.round(totalRevenue / (activeServices + completedServices))
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Services Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Active
            </div>
            <div className="text-2xl font-bold">{activeServices}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </div>
            <div className="text-2xl font-bold">{completedServices}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </div>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Avg Value
            </div>
            <div className="text-2xl font-bold">${avgServiceValue.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
