import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Users, Award, Plus, Download } from "lucide-react";
import { getSalaryBands, getCompensationReviews, calculateCompensationStats } from "@/lib/compensationStorage";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Compensation() {
  const [refreshKey, setRefreshKey] = useState(0);

  const salaryBands = useMemo(() => getSalaryBands(), [refreshKey]);
  const reviews = useMemo(() => getCompensationReviews(), [refreshKey]);
  const stats = useMemo(() => calculateCompensationStats(), [refreshKey]);

  return (
    <DashboardPageLayout>
      <div className="space-y-6 p-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Compensation Management</h1>
          <p className="text-muted-foreground">Manage salary structures, reviews, and equity compensation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalCompensationBudget.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Increase</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageIncrease.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedReviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reviews" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="reviews">Compensation Reviews</TabsTrigger>
              <TabsTrigger value="bands">Salary Bands</TabsTrigger>
              <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
              <TabsTrigger value="equity">Equity</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Review
              </Button>
            </div>
          </div>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compensation Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{review.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{review.justification}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">${review.currentSalary.toLocaleString()}</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Proposed</p>
                          <p className="font-bold text-primary">${review.proposedSalary.toLocaleString()}</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Increase</p>
                          <p className="font-bold text-success">{review.increasePercentage.toFixed(1)}%</p>
                        </div>
                        <Badge
                          variant={
                            review.status === 'approved' ? 'default' :
                            review.status === 'rejected' ? 'destructive' :
                            review.status === 'implemented' ? 'secondary' : 'outline'
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Bands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salaryBands.map(band => (
                    <div key={band.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{band.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{band.jobLevel}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground">Min</p>
                          <p className="font-medium">${band.minSalary.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Mid</p>
                          <p className="font-medium">${band.midSalary.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Max</p>
                          <p className="font-medium">${band.maxSalary.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">{band.currency}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bonus Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Manage bonus plans and payouts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equity Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Stock options and equity compensation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
