import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getEmployerById } from "@/lib/employerService";
import { SUBSCRIPTION_TIERS, PAYG_JOB_POSTING_COST } from "@/lib/subscriptionConfig";
import { Building2, CreditCard, AlertCircle, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";

interface JobPostingCostDialogProps {
  open: boolean;
  employerId: string;
  onContinue: () => void;
  onUpgrade: () => void;
  onCancel: () => void;
}

export function JobPostingCostDialog({
  open,
  employerId,
  onContinue,
  onUpgrade,
  onCancel
}: JobPostingCostDialogProps) {
  const employer = getEmployerById(employerId);
  
  if (!employer) {
    return null;
  }

  const subscriptionTier = employer.subscriptionTier;
  const isPayg = employer.accountType === 'payg' || (!subscriptionTier && employer.accountType === 'approved');
  const isFree = subscriptionTier === 'free';
  const isSubscription = subscriptionTier && subscriptionTier !== 'free';
  const hasUsedFreeTier = employer.hasUsedFreeTier || false;
  const currentOpenJobs = employer.currentOpenJobs || 0;
  const maxOpenJobs = employer.maxOpenJobs || 0;

  // Check if at limit
  const atLimit = isFree && hasUsedFreeTier;
  const subscriptionAtLimit = isSubscription && currentOpenJobs >= maxOpenJobs;

  // Calculate usage percentage
  const usagePercentage = isSubscription && maxOpenJobs > 0 
    ? (currentOpenJobs / maxOpenJobs) * 100 
    : 0;

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // SUBSCRIPTION USERS
  if (isSubscription) {
    const tierConfig = SUBSCRIPTION_TIERS[subscriptionTier];
    
    if (subscriptionAtLimit) {
      return (
        <Dialog open={open} onOpenChange={() => {}}>
          <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Job Limit Reached
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 overflow-y-auto">
              <div className="flex items-start gap-2 p-3 border border-destructive/50 rounded-lg bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  You've reached your plan's job posting limit. Choose an option below to proceed.
                </p>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {tierConfig.name} - ${tierConfig.monthlyFee}/month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Open Jobs</span>
                      <span className="font-semibold text-destructive">
                        {currentOpenJobs} / {maxOpenJobs} used (100%)
                      </span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Option 1: Close an existing job</h4>
                      <p className="text-sm text-muted-foreground">
                        Closing an open job will free up a slot.
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Option 2: Upgrade your plan</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {subscriptionTier === 'small' && (
                          <>
                            <p>• Medium: 25 jobs for $495/month</p>
                            <p>• Large: 50 jobs for $695/month</p>
                          </>
                        )}
                        {subscriptionTier === 'medium' && (
                          <>
                            <p>• Large: 50 jobs for $695/month</p>
                            <p>• Enterprise: Unlimited for $995/month</p>
                          </>
                        )}
                        {subscriptionTier === 'large' && (
                          <p>• Enterprise: Unlimited for $995/month</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onCancel} size="sm">
                Cancel
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/jobs'} size="sm">
                My Jobs
              </Button>
              <Button onClick={onUpgrade} size="sm">
                Upgrade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Subscription Plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{tierConfig.name} Plan</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${tierConfig.monthlyFee}/month
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {employer.nextBillingDate && (
                  <p className="text-sm text-muted-foreground">
                    Next billing: {formatDate(employer.nextBillingDate)}
                  </p>
                )}

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Open Jobs</span>
                    <span className="font-semibold">
                      {currentOpenJobs} / {maxOpenJobs === Infinity ? 'Unlimited' : maxOpenJobs} used
                    </span>
                  </div>
                  {maxOpenJobs !== Infinity && (
                    <>
                      <Progress value={usagePercentage} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground text-right">
                        {Math.round(usagePercentage)}%
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Job posting included</strong>
                    <p className="text-muted-foreground">No additional charge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // PAYG USERS
  if (isPayg) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pay-As-You-Go
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Job Posting Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-3">
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${PAYG_JOB_POSTING_COST}
                  </div>
                  <p className="text-sm text-muted-foreground">per job posting</p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-sm">This includes:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      30-day posting on HRM8
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Full ATS access
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Unlimited applicants
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      Candidate management tools
                    </li>
                  </ul>
                </div>

                <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground text-center">
                  Additional recruitment services available in next step (optional)
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel
            </Button>
            <Button variant="outline" onClick={onUpgrade} size="sm">
              Subscription
            </Button>
            <Button onClick={onContinue} size="sm" className="flex-1">
              Continue - ${PAYG_JOB_POSTING_COST}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // FREE USERS
  if (atLimit) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Upgrade Required
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto">
            <div className="flex items-start gap-2 p-3 border border-warning/50 rounded-lg bg-warning/5">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                You've used your free job posting. Choose an option below to post more jobs.
              </p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay-As-You-Go: ${PAYG_JOB_POSTING_COST} per job
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-0.5 ml-6">
                    <li>• No commitment required</li>
                    <li>• Pay only when you post</li>
                    <li>• All features included</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Subscription: From $295/month
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-0.5 ml-6">
                    <li>• 5-50 open jobs included</li>
                    <li>• Unlimited users</li>
                    <li>• Advanced features</li>
                    <li>• Save up to 75%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {/* Set to PAYG */}} size="sm">
              PAYG
            </Button>
            <Button onClick={onUpgrade} size="sm">
              Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // FREE USER - FIRST JOB
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            First Job FREE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto">
          <div className="flex items-start gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Your first job posting is on us!
            </p>
          </div>

          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <p className="font-medium text-sm">This includes:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    30-day posting on HRM8
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Full ATS access
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Up to 50 applicants
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    Basic candidate management
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t space-y-1">
                <p className="text-sm font-medium">For additional jobs:</p>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>• Pay ${PAYG_JOB_POSTING_COST} per job (PAYG)</p>
                  <p>• Subscribe from $295/month (5+ jobs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button variant="outline" onClick={onUpgrade} size="sm">
            View Plans
          </Button>
          <Button onClick={onContinue} size="sm" className="flex-1">
            Post FREE
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
