import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Employer } from "@/types/entities";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptionConfig";
import { Sparkles, Calendar, Users, Briefcase, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionManagementCardProps {
  employer: Employer;
  onChangePlan: () => void;
}

export function SubscriptionManagementCard({ employer, onChangePlan }: SubscriptionManagementCardProps) {
  const tierConfig = SUBSCRIPTION_TIERS[employer.subscriptionTier];
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Mock: 30 days from now

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Current Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan and billing</CardDescription>
          </div>
          <Button onClick={onChangePlan} variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Change Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Overview */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{tierConfig.name} Plan</h3>
              <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Monthly billing cycle</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary tabular-nums">
              ${tierConfig.monthlyFee}
            </p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Briefcase className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Open Job Postings</p>
              <p className="text-lg font-bold tabular-nums">
                {tierConfig.maxOpenJobs === Infinity ? 'Unlimited' : tierConfig.maxOpenJobs}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Team Members</p>
              <p className="text-lg font-bold tabular-nums">
                {tierConfig.maxUsers === Infinity ? 'Unlimited' : tierConfig.maxUsers}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm font-semibold">
                {format(nextBillingDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subscription started</span>
            <span className="font-medium">{format(employer.createdAt, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment method</span>
            <span className="font-medium">Visa •••• 4242</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Auto-renewal</span>
            <Badge variant="outline" className="text-xs">Enabled</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
