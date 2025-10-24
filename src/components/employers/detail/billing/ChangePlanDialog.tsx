import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscriptionConfig";
import { Employer } from "@/types/entities";
import { Check, Briefcase, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employer: Employer;
  onPlanChanged: (newTier: SubscriptionTier) => void;
}

export function ChangePlanDialog({ open, onOpenChange, employer, onPlanChanged }: ChangePlanDialogProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(employer.subscriptionTier);
  const currentTier = employer.subscriptionTier;

  const handleChangePlan = () => {
    if (selectedTier === currentTier) {
      toast({
        title: "No changes",
        description: "You're already on this plan.",
      });
      return;
    }

    // In real app, this would call an API
    onPlanChanged(selectedTier);
    toast({
      title: "Plan changed successfully",
      description: `Subscription updated to ${SUBSCRIPTION_TIERS[selectedTier].name} plan.`,
    });
    onOpenChange(false);
  };

  const tiers = Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionTier, typeof SUBSCRIPTION_TIERS[SubscriptionTier]][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            Select a new plan for {employer.name}. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {tiers.map(([key, config]) => {
            const isCurrentPlan = key === currentTier;
            const isSelected = key === selectedTier;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {isCurrentPlan && (
                  <Badge className="absolute top-2 right-2 text-xs">Current</Badge>
                )}
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{config.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold tabular-nums">${config.monthlyFee}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>
                        {config.maxOpenJobs === Infinity ? 'Unlimited' : config.maxOpenJobs} open job{config.maxOpenJobs !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {config.maxUsers === Infinity ? 'Unlimited' : config.maxUsers} user{config.maxUsers !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>
                        {config.jobPostingCost === 0 ? 'Free job postings' : `$${config.jobPostingCost}/posting`}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangePlan} disabled={selectedTier === currentTier}>
            Change to {SUBSCRIPTION_TIERS[selectedTier].name} Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
