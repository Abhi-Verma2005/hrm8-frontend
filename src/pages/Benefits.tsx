import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Gift, Users, DollarSign, TrendingUp, Plus } from "lucide-react";
import { getBenefitPlans, getBenefitEnrollments, calculateBenefitsStats } from "@/lib/benefitsStorage";
import { Badge } from "@/components/ui/badge";

export default function Benefits() {
  const [refreshKey, setRefreshKey] = useState(0);

  const plans = useMemo(() => getBenefitPlans(), [refreshKey]);
  const enrollments = useMemo(() => getBenefitEnrollments(), [refreshKey]);
  const stats = useMemo(() => calculateBenefitsStats(), [refreshKey]);

  return (
    <DashboardPageLayout
      title="Benefits Administration"
      description="Manage employee benefits, enrollments, and providers"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrolled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.employeeCost.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employer Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.employerCost.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plans" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map(plan => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.provider}</p>
                      </div>
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{plan.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Employee Cost:</span>
                      <span className="font-medium">${plan.employeeCost}/mo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Employer Cost:</span>
                      <span className="font-medium">${plan.employerCost}/mo</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{plan.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benefit Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enrollments.map(enrollment => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{enrollment.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.benefitPlanName}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-medium capitalize">{enrollment.coverageLevel.replace('-', ' + ')}</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Cost</p>
                          <p className="font-medium">${enrollment.employeeCost}/mo</p>
                        </div>
                        <Badge
                          variant={
                            enrollment.status === 'enrolled' ? 'default' :
                            enrollment.status === 'pending' ? 'secondary' :
                            'outline'
                          }
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benefit Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Manage benefit providers and contacts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benefits Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Benefits analytics and cost reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
