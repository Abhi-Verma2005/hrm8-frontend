import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Globe, MapPin, Users, Building2 } from "lucide-react";
import { Employer } from "@/types/entities";
import { EmployerStatusBadge } from "../EmployerStatusBadge";
import { AccountTypeBadge } from "../AccountTypeBadge";
import { SubscriptionTierBadge } from "../SubscriptionTierBadge";
import { formatRelativeDate } from "@/lib/jobUtils";

interface EmployerProfileCardProps {
  employer: Employer;
  onEdit?: () => void;
}

export function EmployerProfileCard({ employer, onEdit }: EmployerProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Company Profile</CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Logo and Name */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-20 h-20 border border-border rounded-lg bg-card overflow-hidden">
            {employer.logo ? (
              <img 
                src={employer.logo}
                alt={`${employer.name} logo`}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <span className="text-xl font-bold text-primary">
                  {employer.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold mb-2">{employer.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <EmployerStatusBadge status={employer.status} />
              <AccountTypeBadge accountType={employer.accountType} />
              <SubscriptionTierBadge tier={employer.subscriptionTier} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="text-sm font-medium">{employer.industry}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Primary Location</p>
              <p className="text-sm font-medium">{employer.location}</p>
            </div>
          </div>

          {employer.email && (
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{employer.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="text-sm font-medium">
                {employer.currentUsers} {employer.maxUsers !== Infinity && `/ ${employer.maxUsers}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-sm font-medium">{employer.departments?.length || 0}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Locations</p>
              <p className="text-sm font-medium">{employer.locations?.length || 0}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Manager */}
        {employer.accountManagerName && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Manager</p>
            <p className="text-sm font-medium">{employer.accountManagerName}</p>
          </div>
        )}

        {/* Member Since */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Member Since</p>
          <p className="text-sm font-medium">{formatRelativeDate(employer.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
