import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, CheckCircle2, XCircle, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscriptionConfig";
import { getPackageTier, getPackageDisplayName, type SubscriptionTier as PackageTier } from "@/lib/packageUtils";
import { updateEmployer } from "@/lib/employerService";
import { cn } from "@/lib/utils";

const MOCK_PAYMENT_PASSWORD = "vAbhi2678";

interface PackageUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onUpgradeSuccess?: () => void;
}

export function PackageUpgradeDialog({
  open,
  onOpenChange,
  companyId,
  onUpgradeSuccess,
}: PackageUpgradeDialogProps) {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [paymentPassword, setPaymentPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentTier = getPackageTier(companyId) as SubscriptionTier;
  const isFreePackage = currentTier === 'ats-lite';

  // Available upgrade tiers (excluding current tier and payg)
  const availableTiers: SubscriptionTier[] = ['small', 'medium', 'large', 'enterprise'].filter(
    tier => tier !== currentTier
  ) as SubscriptionTier[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTier) {
      setError("Please select a subscription tier.");
      return;
    }

    if (!paymentPassword) {
      setError("Please enter the mock payment password.");
      return;
    }

    if (paymentPassword !== MOCK_PAYMENT_PASSWORD) {
      setError("Payment failed. Invalid mock payment password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update employer subscription tier
      const updated = updateEmployer(companyId, {
        subscriptionTier: selectedTier,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
      });

      if (!updated) {
        throw new Error('Failed to update subscription. Company not found.');
      }

      setSuccess(true);
      toast({
        title: "Upgrade successful!",
        description: `Your subscription has been upgraded to ${SUBSCRIPTION_TIERS[selectedTier].name}.`,
      });

      setTimeout(() => {
        setSuccess(false);
        setPaymentPassword("");
        setSelectedTier(null);
        onUpgradeSuccess?.();
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Unexpected error during upgrade.");
      toast({
        title: "Upgrade error",
        description: err?.message || "Unexpected error during upgrade.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTierConfig = selectedTier ? SUBSCRIPTION_TIERS[selectedTier] : null;
  const currentTierConfig = SUBSCRIPTION_TIERS[currentTier];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upgrade Your Subscription
            </DialogTitle>
            <DialogDescription>
              Upgrade to unlock consultant services and advanced features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Current Package */}
            <div className="space-y-2">
              <Label>Current Package</Label>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{getPackageDisplayName(currentTier)}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTierConfig.description}
                      </p>
                    </div>
                    <Badge variant={isFreePackage ? "secondary" : "default"}>
                      {isFreePackage ? "Free" : "Paid"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mock Payment Alert */}
            <Alert className="bg-muted/60">
              <Lock className="h-4 w-4" />
              <AlertTitle>Mock payment flow</AlertTitle>
              <AlertDescription>
                To simulate a successful payment, enter the password{" "}
                <span className="font-mono font-semibold">vAbhi2678</span>. Any other value will simulate a failed payment.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Upgrade error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <AlertTitle className="text-emerald-700 dark:text-emerald-200">
                  Upgrade successful
                </AlertTitle>
                <AlertDescription className="text-emerald-700/90 dark:text-emerald-200/90">
                  Your subscription has been upgraded successfully.
                </AlertDescription>
              </Alert>
            )}

            {/* Select Upgrade Tier */}
            {availableTiers.length > 0 && (
              <div className="space-y-3">
                <Label>Select Upgrade Package</Label>
                <RadioGroup value={selectedTier || ""} onValueChange={(value) => setSelectedTier(value as SubscriptionTier)}>
                  {availableTiers.map((tier) => {
                    const tierConfig = SUBSCRIPTION_TIERS[tier];
                    return (
                      <div
                        key={tier}
                        className={cn(
                          "flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors",
                          selectedTier === tier
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedTier(tier)}
                      >
                        <RadioGroupItem value={tier} id={tier} />
                        <Label htmlFor={tier} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{tierConfig.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {tierConfig.maxOpenJobs === 9999 ? "Unlimited" : tierConfig.maxOpenJobs} open jobs
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${tierConfig.monthlyPrice}</p>
                              <p className="text-xs text-muted-foreground">/month</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Selected Tier Details */}
            {selectedTierConfig && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Selected Package:</span>
                      <span className="font-bold text-primary">{selectedTierConfig.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Price:</span>
                      <span className="font-semibold">${selectedTierConfig.monthlyPrice}/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Open Jobs:</span>
                      <span className="font-semibold">
                        {selectedTierConfig.maxOpenJobs === 9999 ? "Unlimited" : selectedTierConfig.maxOpenJobs}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Key Features:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {selectedTierConfig.features.coreATS && (
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Core ATS Features
                          </li>
                        )}
                        {selectedTierConfig.features.aiScreening && (
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            AI Screening & Matching
                          </li>
                        )}
                        {selectedTierConfig.features.teamCollaboration && (
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Team Collaboration
                          </li>
                        )}
                        <li className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Consultant Services Access
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Password */}
            <div className="space-y-2">
              <Label htmlFor="payment-password">Mock Payment Password *</Label>
              <Input
                id="payment-password"
                type="password"
                placeholder="Enter mock payment password"
                value={paymentPassword}
                onChange={(e) => setPaymentPassword(e.target.value)}
                required
                disabled={isSubmitting || success}
              />
              <p className="text-xs text-muted-foreground">
                Use password: <span className="font-mono">vAbhi2678</span> for successful payment
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || success || !selectedTier}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Processing..." : "Upgrade & Pay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
