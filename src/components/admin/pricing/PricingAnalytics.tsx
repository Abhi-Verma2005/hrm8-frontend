import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getATSSubscriptionTiers, getAddonServices, getRecruitmentServices, getCustomPricing } from '@/lib/pricingStorage';
import { TrendingUp, DollarSign, Users, Package } from 'lucide-react';

export function PricingAnalytics() {
  const tiers = getATSSubscriptionTiers();
  const addons = getAddonServices();
  const services = getRecruitmentServices();
  const customPricing = getCustomPricing();

  // Mock analytics data (in real implementation, this would come from backend)
  const analytics = {
    totalRevenue: 147850,
    revenueGrowth: 23.5,
    activeSubscriptions: 87,
    tierDistribution: [
      { tier: 'Small', count: 32, revenue: 6368, percentage: 36.8 },
      { tier: 'Medium', count: 28, revenue: 13972, percentage: 32.2 },
      { tier: 'Large', count: 18, revenue: 17982, percentage: 20.7 },
      { tier: 'Enterprise', count: 9, revenue: 45000, percentage: 10.3 },
    ],
    popularAddons: [
      { name: 'HRMS Add-on', subscriptions: 42, revenue: 8400 },
      { name: 'Candidate Assessments', subscriptions: 35, revenue: 5250 },
      { name: 'Reference Checking', subscriptions: 28, revenue: 7000 },
    ],
    recruitmentServices: [
      { type: 'Full Service', contracts: 15, revenue: 75000 },
      { type: 'Executive Search', contracts: 8, revenue: 48000 },
      { type: 'Shortlisting', contracts: 12, revenue: 18000 },
    ],
    customPricingStats: {
      total: customPricing.length,
      active: customPricing.filter((cp) => cp.status === 'active').length,
      totalValue: 89500,
    },
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">£{analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{analytics.revenueGrowth}% vs last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{analytics.activeSubscriptions}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all tiers
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Add-on Revenue</p>
                <p className="text-2xl font-bold">
                  £{analytics.popularAddons.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From {analytics.popularAddons.reduce((sum, a) => sum + a.subscriptions, 0)} subscriptions
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custom Pricing</p>
                <p className="text-2xl font-bold">{analytics.customPricingStats.active}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  £{analytics.customPricingStats.totalValue.toLocaleString()} value
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Tier Distribution</CardTitle>
          <CardDescription>Active subscriptions by tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.tierDistribution.map((item) => (
              <div key={item.tier}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.tier}</span>
                    <Badge variant="secondary">{item.count} subscriptions</Badge>
                  </div>
                  <span className="text-sm font-medium">£{item.revenue.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.percentage}% of total subscriptions
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Add-ons */}
        <Card>
          <CardHeader>
            <CardTitle>Top Add-on Services</CardTitle>
            <CardDescription>Most subscribed add-ons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularAddons.map((addon, index) => (
                <div key={addon.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {addon.subscriptions} subscriptions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{addon.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Services */}
        <Card>
          <CardHeader>
            <CardTitle>Recruitment Services</CardTitle>
            <CardDescription>Revenue by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recruitmentServices.map((service) => (
                <div key={service.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{service.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.contracts} active contracts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      £{(service.revenue / service.contracts).toFixed(0)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Configuration Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration Overview</CardTitle>
          <CardDescription>Current pricing structure statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Active Tiers</p>
              <p className="text-2xl font-bold">{tiers.filter((t) => t.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">of {tiers.length} total</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Active Add-ons</p>
              <p className="text-2xl font-bold">{addons.filter((a) => a.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">of {addons.length} total</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Active Services</p>
              <p className="text-2xl font-bold">{services.filter((s) => s.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">of {services.length} total</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Custom Agreements</p>
              <p className="text-2xl font-bold">{customPricing.filter((cp) => cp.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">active contracts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
