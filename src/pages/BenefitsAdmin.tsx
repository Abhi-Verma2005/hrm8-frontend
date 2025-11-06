import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Heart, Plus, Calendar, AlertCircle, FileCheck, Users, DollarSign } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { getEnrollmentPeriods, getLifeEvents, getCOBRAEvents } from "@/lib/benefitsEnhancedStorage";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/tables/DataTable";
import { EnrollmentPeriod, LifeEvent, COBRAEvent } from "@/types/benefitsEnhanced";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BenefitsAdmin() {
  const { isHRAdmin, isSuperAdmin } = useRBAC();
  const [activeTab, setActiveTab] = useState("enrollment");

  const enrollmentPeriods = getEnrollmentPeriods();
  const lifeEvents = getLifeEvents({ processed: false });
  const cobraEvents = getCOBRAEvents();

  const hasAccess = isHRAdmin || isSuperAdmin;

  const enrollmentColumns: Column<EnrollmentPeriod>[] = [
    {
      key: "name",
      label: "Period Name",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (period) => {
        const colors = {
          open: "bg-blue-50 text-blue-700",
          "new-hire": "bg-green-50 text-green-700",
          "life-event": "bg-purple-50 text-purple-700",
        };
        return <Badge className={colors[period.type]}>{period.type}</Badge>;
      },
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (period) => new Date(period.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      render: (period) => new Date(period.endDate).toLocaleDateString(),
    },
    {
      key: "effectiveDate",
      label: "Effective",
      sortable: true,
      render: (period) => new Date(period.effectiveDate).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (period) => {
        const colors = {
          upcoming: "bg-gray-50 text-gray-700",
          active: "bg-green-50 text-green-700",
          closed: "bg-red-50 text-red-700",
        };
        return <Badge className={colors[period.status]}>{period.status}</Badge>;
      },
    },
  ];

  const lifeEventColumns: Column<LifeEvent>[] = [
    {
      key: "employeeName",
      label: "Employee",
      sortable: true,
    },
    {
      key: "eventType",
      label: "Event Type",
      sortable: true,
      render: (event) => (
        <Badge variant="secondary">{event.eventType}</Badge>
      ),
    },
    {
      key: "eventDate",
      label: "Event Date",
      sortable: true,
      render: (event) => new Date(event.eventDate).toLocaleDateString(),
    },
    {
      key: "specialEnrollmentPeriod",
      label: "SEP Days",
      sortable: true,
      render: (event) => `${event.specialEnrollmentPeriod} days`,
    },
    {
      key: "documentationReceived",
      label: "Documentation",
      render: (event) => (
        event.documentationReceived ? (
          <FileCheck className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-orange-500" />
        )
      ),
    },
    {
      key: "processed",
      label: "Status",
      sortable: true,
      render: (event) => (
        <Badge variant={event.processed ? "default" : "secondary"}>
          {event.processed ? "Processed" : "Pending"}
        </Badge>
      ),
    },
  ];

  const cobraColumns: Column<COBRAEvent>[] = [
    {
      key: "employeeName",
      label: "Employee",
      sortable: true,
    },
    {
      key: "qualifyingEvent",
      label: "Qualifying Event",
      sortable: true,
      render: (cobra) => (
        <Badge variant="outline">{cobra.qualifyingEvent}</Badge>
      ),
    },
    {
      key: "eventDate",
      label: "Event Date",
      sortable: true,
      render: (cobra) => new Date(cobra.eventDate).toLocaleDateString(),
    },
    {
      key: "cobraStartDate",
      label: "COBRA Start",
      sortable: true,
      render: (cobra) => new Date(cobra.cobraStartDate).toLocaleDateString(),
    },
    {
      key: "premiumAmount",
      label: "Premium",
      sortable: true,
      render: (cobra) => `$${cobra.premiumAmount.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (cobra) => {
        const colors = {
          pending: "bg-gray-50 text-gray-700",
          active: "bg-green-50 text-green-700",
          expired: "bg-red-50 text-red-700",
          terminated: "bg-orange-50 text-orange-700",
        };
        return <Badge className={colors[cobra.status]}>{cobra.status}</Badge>;
      },
    },
  ];

  if (!hasAccess) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Heart className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-sm">You don't have permission to manage benefits administration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8" />
              Benefits Administration
            </h1>
            <p className="text-muted-foreground">
              Manage enrollments, life events, and COBRA administration
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Enrollment Period
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Enrollment</p>
                  <p className="text-2xl font-bold">
                    {enrollmentPeriods.filter((e) => e.status === 'active').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Life Events</p>
                  <p className="text-2xl font-bold">{lifeEvents.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active COBRA</p>
                  <p className="text-2xl font-bold">
                    {cobraEvents.filter((c) => c.status === 'active').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="enrollment">Enrollment Periods</TabsTrigger>
            <TabsTrigger value="life-events">Life Events</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility Rules</TabsTrigger>
            <TabsTrigger value="cobra">COBRA</TabsTrigger>
            <TabsTrigger value="costs">Cost Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Periods</CardTitle>
                <CardDescription>
                  Manage open enrollment and special enrollment periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={enrollmentColumns}
                  data={enrollmentPeriods}
                  searchKeys={["name", "type"]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="life-events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Life Events</CardTitle>
                <CardDescription>
                  Process qualifying life events and special enrollment periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lifeEvents.length > 0 ? (
                  <DataTable
                    columns={lifeEventColumns}
                    data={lifeEvents}
                    searchKeys={["employeeName", "eventType"]}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No pending life events.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Rules</CardTitle>
                <CardDescription>
                  Define and manage plan eligibility criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Configure eligibility rules based on tenure, employment type, and other criteria.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cobra" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>COBRA Administration</CardTitle>
                <CardDescription>
                  Manage COBRA qualifying events and continuation coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cobraEvents.length > 0 ? (
                  <DataTable
                    columns={cobraColumns}
                    data={cobraEvents}
                    searchKeys={["employeeName", "qualifyingEvent"]}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No COBRA events to display.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benefits Cost Calculator</CardTitle>
                <CardDescription>
                  Calculate employee and employer contributions by coverage tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Use the cost calculator to estimate benefits costs for different coverage tiers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
