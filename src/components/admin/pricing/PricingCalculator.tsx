import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getATSSubscriptionTiers, getAddonServices } from '@/lib/pricingStorage';
import { Calculator, CheckCircle2 } from 'lucide-react';

export function PricingCalculator() {
  const [requirements, setRequirements] = useState({
    jobCount: '',
    userCount: '',
    billingCycle: 'monthly' as 'monthly' | 'annual',
    selectedAddons: [] as string[],
  });

  const [recommendation, setRecommendation] = useState<any>(null);

  const tiers = getATSSubscriptionTiers().filter(t => t.status === 'active');
  const addons = getAddonServices().filter(a => a.status === 'active');

  const calculateRecommendation = () => {
    const jobCount = parseInt(requirements.jobCount) || 0;
    const userCount = parseInt(requirements.userCount) || 0;

    // Find suitable tiers
    const suitableTiers = tiers.filter(
      (tier) => tier.maxJobs >= jobCount && tier.maxUsers >= userCount
    );

    if (suitableTiers.length === 0) {
      setRecommendation({
        recommended: null,
        alternatives: [],
        totalCost: 0,
        message: 'No suitable tier found. Consider Enterprise plan or contact sales.',
      });
      return;
    }

    // Sort by price and get best fit
    const sorted = [...suitableTiers].sort((a, b) => {
      const priceA = requirements.billingCycle === 'monthly' ? a.monthlyPrice : a.annualPrice;
      const priceB = requirements.billingCycle === 'monthly' ? b.monthlyPrice : b.annualPrice;
      return priceA - priceB;
    });

    const recommended = sorted[0];
    const alternatives = sorted.slice(1, 3);

    // Calculate addon costs
    const addonCosts = requirements.selectedAddons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.basePrice || 0);
    }, 0);

    const basePrice =
      requirements.billingCycle === 'monthly'
        ? recommended.monthlyPrice
        : recommended.annualPrice;

    const totalCost = basePrice + addonCosts;
    const annualSavings =
      requirements.billingCycle === 'annual' && recommended.annualDiscount > 0
        ? (recommended.monthlyPrice * 12 - recommended.annualPrice).toFixed(2)
        : null;

    setRecommendation({
      recommended,
      alternatives,
      totalCost,
      addonCosts,
      annualSavings,
      message: `Based on your requirements, we recommend the ${recommended.name} plan.`,
    });
  };

  const toggleAddon = (addonId: string) => {
    setRequirements((prev) => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter((id) => id !== addonId)
        : [...prev.selectedAddons, addonId],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Pricing Calculator</CardTitle>
            <CardDescription>
              Input employer requirements to get instant pricing recommendations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobCount">Number of Jobs</Label>
              <Input
                id="jobCount"
                type="number"
                placeholder="e.g., 15"
                value={requirements.jobCount}
                onChange={(e) =>
                  setRequirements((prev) => ({ ...prev, jobCount: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="userCount">Number of Users</Label>
              <Input
                id="userCount"
                type="number"
                placeholder="e.g., 8"
                value={requirements.userCount}
                onChange={(e) =>
                  setRequirements((prev) => ({ ...prev, userCount: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select
                value={requirements.billingCycle}
                onValueChange={(value: 'monthly' | 'annual') =>
                  setRequirements((prev) => ({ ...prev, billingCycle: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual (Save up to 16.5%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Add-on Services (Optional)</Label>
              <div className="space-y-2 mt-2">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`calc-addon-${addon.id}`}
                      checked={requirements.selectedAddons.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`calc-addon-${addon.id}`} className="text-sm flex-1">
                      {addon.name} - £{addon.basePrice}
                      {addon.pricePerUnit && ` + £${addon.pricePerUnit} ${addon.unitLabel}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={calculateRecommendation} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Pricing
            </Button>
          </div>

          {/* Results Section */}
          <div>
            {recommendation ? (
              <div className="space-y-4">
                {recommendation.recommended ? (
                  <>
                    <div className="border rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Recommended Plan</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {recommendation.message}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xl">
                            {recommendation.recommended.name}
                          </span>
                          <Badge>Best Fit</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {recommendation.recommended.description}
                        </div>
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Base Plan ({requirements.billingCycle}):</span>
                            <span className="font-medium">
                              £
                              {requirements.billingCycle === 'monthly'
                                ? recommendation.recommended.monthlyPrice
                                : recommendation.recommended.annualPrice}
                            </span>
                          </div>
                          {recommendation.addonCosts > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Add-ons:</span>
                              <span className="font-medium">£{recommendation.addonCosts}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                            <span>Total Cost:</span>
                            <span className="text-primary">£{recommendation.totalCost}</span>
                          </div>
                          {recommendation.annualSavings && (
                            <div className="text-sm text-green-600 font-medium">
                              Annual savings: £{recommendation.annualSavings}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {recommendation.alternatives.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Alternative Plans</h4>
                        <div className="space-y-2">
                          {recommendation.alternatives.map((tier: any) => (
                            <div key={tier.id} className="border rounded p-3 text-sm">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{tier.name}</p>
                                  <p className="text-muted-foreground text-xs">
                                    {tier.maxJobs} jobs, {tier.maxUsers} users
                                  </p>
                                </div>
                                <span className="font-medium">
                                  £
                                  {requirements.billingCycle === 'monthly'
                                    ? tier.monthlyPrice
                                    : tier.annualPrice}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-2">{recommendation.message}</p>
                    <Button variant="outline" size="sm">
                      Contact Sales
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter requirements and click Calculate to see recommendations</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
