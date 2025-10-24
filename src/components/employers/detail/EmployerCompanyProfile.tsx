import { Employer } from "@/types/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Globe, Briefcase, MapPin, Calendar, Activity } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

interface EmployerMetrics {
  daysAsCustomer: number;
  lastActivityDate: Date;
}

interface EmployerCompanyProfileProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerCompanyProfile({ employer, metrics }: EmployerCompanyProfileProps) {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Company Profile</CardTitle>
        <Button variant="ghost" size="sm">
          Edit Profile →
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Company Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Industry:</span>
              <span className="text-sm font-medium">{employer.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{employer.email}</span>
            </div>
            {employer.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Website:</span>
                <a 
                  href={employer.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {employer.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="text-sm font-medium">{employer.location}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Organization */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Organization
          </h4>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{employer.departments?.length || 0}</strong> Departments
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{employer.locations?.length || 0}</strong> Locations
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(employer.createdAt)} ({metrics.daysAsCustomer < 365 ? 
                    `${Math.floor(metrics.daysAsCustomer / 30)} months` : 
                    `${Math.floor(metrics.daysAsCustomer / 365)} years`} ago)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Last activity</p>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeDate(metrics.lastActivityDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
