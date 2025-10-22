import { Employer } from "@/types/entities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubscriptionTierBadge } from "../SubscriptionTierBadge";
import { EmployerStatusBadge } from "../EmployerStatusBadge";
import { Sparkles, Briefcase, Users, DollarSign } from "lucide-react";
import { DetailRow } from "./shared/DetailRow";
import { CapacityBar } from "./shared/CapacityBar";

interface EmployerSubscriptionCardProps {
  employer: Employer;
}

export function EmployerSubscriptionCard({ employer }: EmployerSubscriptionCardProps) {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <CardTitle>Subscription & Capacity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Tier */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-center mb-2">
            <SubscriptionTierBadge tier={employer.subscriptionTier} />
          </div>
          <p className="text-2xl font-bold capitalize">
            {employer.subscriptionTier} Plan
          </p>
          {employer.monthlySubscriptionFee && (
            <p className="text-muted-foreground mt-1">
              ${employer.monthlySubscriptionFee}/month
            </p>
          )}
        </div>
        
        <Separator />
        
        {/* Subscription Details */}
        <div className="space-y-3">
          <DetailRow 
            label="Status" 
            value={<EmployerStatusBadge status={employer.status} />}
          />
          <DetailRow 
            label="Period" 
            value={`${formatDate(employer.subscriptionStartDate)} - ${formatDate(employer.subscriptionEndDate)}`}
          />
        </div>
        
        <Separator />
        
        {/* Capacity Bars */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Capacity Usage</h4>
          
          {/* Jobs Capacity */}
          <CapacityBar
            label="Open Jobs"
            current={employer.currentOpenJobs}
            max={employer.maxOpenJobs}
            icon={Briefcase}
          />
          
          {/* Users Capacity */}
          <CapacityBar
            label="Users"
            current={employer.currentUsers}
            max={employer.maxUsers}
            icon={Users}
          />
          
          {/* Credit Utilization (if approved) */}
          {employer.accountType === 'approved' && employer.creditLimit && (
            <CapacityBar
              label="Credit"
              current={employer.outstandingBalance || 0}
              max={employer.creditLimit}
              icon={DollarSign}
              format="currency"
              warning={(employer.outstandingBalance || 0) > employer.creditLimit * 0.8}
            />
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Change Plan
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
