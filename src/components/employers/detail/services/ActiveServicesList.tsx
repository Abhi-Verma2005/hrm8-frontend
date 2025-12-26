import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreVertical } from "lucide-react";
import { ServiceTypeBadge } from "@/components/jobs/ServiceTypeBadge";
import { getEmployerJobs } from "@/lib/employerJobService";
import { Link } from "react-router-dom";

interface ActiveServicesListProps {
  employerId: string;
}

export function ActiveServicesList({ employerId }: ActiveServicesListProps) {
  const jobs = getEmployerJobs(employerId).filter(j => 
    j.status === 'open' && j.serviceType !== 'self-managed'
  );

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Services</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No active recruitment services
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Services ({jobs.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map(job => {
          const progress = Math.floor(Math.random() * 60) + 20;
          
          return (
            <div key={job.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      to={`/jobs/${job.id}`}
                      className="font-medium hover:underline"
                    >
                      {job.title}
                    </Link>
                    <ServiceTypeBadge type={job.serviceType} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Started: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-semibold">${job.serviceFee?.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
