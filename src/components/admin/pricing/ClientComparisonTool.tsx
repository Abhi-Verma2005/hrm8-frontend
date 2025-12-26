import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getATSSubscriptionTiers } from '@/lib/pricingStorage';
import { Check, X, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ClientComparisonTool() {
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [highlightedFeatures, setHighlightedFeatures] = useState<string[]>([]);
  const { toast } = useToast();

  const tiers = getATSSubscriptionTiers().filter((t) => t.status === 'active');

  // Get all unique features
  const allFeatures = Array.from(
    new Set(tiers.flatMap((tier) => tier.features))
  );

  const toggleTier = (tierId: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tierId) ? prev.filter((id) => id !== tierId) : [...prev, tierId]
    );
  };

  const toggleFeature = (feature: string) => {
    setHighlightedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const displayedTiers =
    selectedTiers.length > 0
      ? tiers.filter((t) => selectedTiers.includes(t.id))
      : tiers.slice(0, 4);

  const exportComparison = () => {
    const html = `
      <html>
        <head>
          <title>Pricing Comparison</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            .highlight { background-color: #fff3cd; }
            .check { color: green; }
            .cross { color: red; }
          </style>
        </head>
        <body>
          <h1>ATS Subscription Comparison</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                ${displayedTiers.map((tier) => `<th>${tier.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Monthly Price</strong></td>
                ${displayedTiers.map((tier) => `<td>£${tier.monthlyPrice}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Annual Price</strong></td>
                ${displayedTiers.map((tier) => `<td>£${tier.annualPrice}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Max Jobs</strong></td>
                ${displayedTiers.map((tier) => `<td>${tier.maxJobs}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Max Users</strong></td>
                ${displayedTiers.map((tier) => `<td>${tier.maxUsers}</td>`).join('')}
              </tr>
              ${allFeatures
                .map(
                  (feature) => `
                <tr class="${highlightedFeatures.includes(feature) ? 'highlight' : ''}">
                  <td>${feature}</td>
                  ${displayedTiers
                    .map((tier) =>
                      tier.features.includes(feature)
                        ? '<td class="check">✓</td>'
                        : '<td class="cross">✗</td>'
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-comparison-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Comparison exported',
      description: 'The comparison table has been downloaded as HTML.',
    });
  };

  const copyShareableLink = () => {
    const tierIds = displayedTiers.map((t) => t.id).join(',');
    const link = `${window.location.origin}/pricing?compare=${tierIds}`;
    navigator.clipboard.writeText(link);

    toast({
      title: 'Link copied',
      description: 'Shareable comparison link copied to clipboard.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Client Comparison Tool</CardTitle>
            <CardDescription>
              Generate customizable comparison tables for client presentations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportComparison} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
            <Button onClick={copyShareableLink} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tier Selection */}
          <div>
            <Label className="mb-2 block">Select Tiers to Compare (max 4)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tiers.map((tier) => (
                <div key={tier.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tier-${tier.id}`}
                    checked={selectedTiers.includes(tier.id)}
                    onCheckedChange={() => toggleTier(tier.id)}
                    disabled={
                      selectedTiers.length >= 4 && !selectedTiers.includes(tier.id)
                    }
                  />
                  <label htmlFor={`tier-${tier.id}`} className="text-sm">
                    {tier.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium">Feature</th>
                  {displayedTiers.map((tier) => (
                    <th key={tier.id} className="p-4 text-center font-medium min-w-[150px]">
                      <div>
                        <div className="font-semibold">{tier.name}</div>
                        {tier.popularBadge && (
                          <Badge variant="secondary" className="mt-1">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Monthly Price</td>
                  {displayedTiers.map((tier) => (
                    <td key={tier.id} className="p-4 text-center">
                      <span className="font-semibold text-lg">£{tier.monthlyPrice}</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Annual Price</td>
                  {displayedTiers.map((tier) => (
                    <td key={tier.id} className="p-4 text-center">
                      <span className="font-semibold text-lg">£{tier.annualPrice}</span>
                      <span className="text-sm text-muted-foreground">/yr</span>
                      {tier.annualDiscount > 0 && (
                        <div className="text-xs text-green-600">
                          Save {tier.annualDiscount}%
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Max Jobs</td>
                  {displayedTiers.map((tier) => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.maxJobs >= 999999 ? 'Unlimited' : tier.maxJobs}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Max Users</td>
                  {displayedTiers.map((tier) => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.maxUsers >= 999999 ? 'Unlimited' : tier.maxUsers}
                    </td>
                  ))}
                </tr>
                {allFeatures.map((feature) => {
                  const isHighlighted = highlightedFeatures.includes(feature);
                  return (
                    <tr
                      key={feature}
                      className={`border-b hover:bg-muted/50 cursor-pointer ${
                        isHighlighted ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                      }`}
                      onClick={() => toggleFeature(feature)}
                    >
                      <td className="p-4 text-sm">{feature}</td>
                      {displayedTiers.map((tier) => (
                        <td key={tier.id} className="p-4 text-center">
                          {tier.features.includes(feature) ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>💡 Tip: Click on features to highlight them in the exported comparison</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
