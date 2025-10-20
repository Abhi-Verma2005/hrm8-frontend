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
          <DialogContent className="max-w-lg [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Job Limit Reached
              </DialogTitle>
            </DialogHeader>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-base">
                  Your current plan: {tierConfig.name} (${tierConfig.monthlyFee}/month)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Open Jobs</span>
                    <span className="font-semibold text-destructive">
                      {currentOpenJobs} / {maxOpenJobs} used (100%)
                    </span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <Alert variant="destructive">
                  <AlertDescription>
                    You've reached your plan's job posting limit. Choose an option below to proceed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 pt-2">
                  <div>
                    <h4 className="font-semibold mb-2">Option 1: Close an existing job</h4>
                    <p className="text-sm text-muted-foreground">
                      Closing or archiving an open job will free up a slot for this new posting.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Option 2: Upgrade your plan</h4>
                    <div className="space-y-1.5 text-sm">
                      {subscriptionTier === 'small' && (
                        <>
                          <p>• <strong>Medium:</strong> 25 jobs for $495/month</p>
                          <p>• <strong>Large:</strong> 50 jobs for $695/month</p>
                        </>
                      )}
                      {subscriptionTier === 'medium' && (
                        <>
                          <p>• <strong>Large:</strong> 50 jobs for $695/month</p>
                          <p>• <strong>Enterprise:</strong> Unlimited jobs for $995/month</p>
                        </>
                      )}
                      {subscriptionTier === 'large' && (
                        <p>• <strong>Enterprise:</strong> Unlimited jobs for $995/month</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/jobs'} className="flex-1">
                View My Jobs
              </Button>
              <Button onClick={onUpgrade} className="flex-1">
                Upgrade Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Subscription Plan
            </DialogTitle>
          </DialogHeader>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tierConfig.name} Plan</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${tierConfig.monthlyFee}/month
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Job posting included in your plan</strong>
                  <br />
                  <span className="text-sm">No additional charge for this posting</span>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue to Select Service
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
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pay-As-You-Go
            </DialogTitle>
          </DialogHeader>

          <Card>
            <CardHeader>
              <CardTitle>Job Posting Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  ${PAYG_JOB_POSTING_COST}
                </div>
                <p className="text-sm text-muted-foreground">per job posting</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm">This includes:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
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

              <Alert>
                <AlertDescription className="text-sm">
                  Additional recruitment services available in next step (optional)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button variant="outline" onClick={onUpgrade} className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              Switch to Subscription
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue - Charge ${PAYG_JOB_POSTING_COST}
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
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-5 w-5 text-warning" />
              Upgrade Required
            </DialogTitle>
          </DialogHeader>

          <Card className="border-warning/50">
            <CardContent className="pt-6 space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  You've used your free job posting. Choose an option below to post more jobs.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay-As-You-Go: ${PAYG_JOB_POSTING_COST} per job
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• No commitment required</li>
                    <li>• Pay only when you post</li>
                    <li>• All features included</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Subscription Plans: From $295/month
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• 5-50 open jobs included</li>
                    <li>• Unlimited users</li>
                    <li>• Advanced features</li>
                    <li>• <strong>Save up to 75%</strong></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {/* Set to PAYG */}}>
              Choose PAYG
            </Button>
            <Button onClick={onUpgrade}>
              View Subscriptions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // FREE USER - FIRST JOB
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Welcome! First Job FREE
          </DialogTitle>
        </DialogHeader>

        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6 space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription>
                <strong>Your first job posting is on us!</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="font-medium text-sm">This includes:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
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

            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">For additional jobs:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Pay ${PAYG_JOB_POSTING_COST} per job (PAYG)</p>
                <p>• Subscribe from $295/month (5+ jobs)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="outline" onClick={onUpgrade}>
            View Pricing Plans
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Continue - Post for FREE
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
