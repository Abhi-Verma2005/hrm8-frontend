import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, Shield } from "lucide-react";
import { TimeOffBalanceCards } from "./timeoff/TimeOffBalanceCards";
import { TimeOffRequestsList } from "./timeoff/TimeOffRequestsList";
import { TimeOffRequestDialog } from "./timeoff/TimeOffRequestDialog";
import { TimeOffCalendar } from "./timeoff/TimeOffCalendar";
import { BlockoutPeriodsSection } from "./timeoff/BlockoutPeriodsSection";
import { CoverageSection } from "./timeoff/CoverageSection";
import { getTimeOffBalances, getTimeOffRequests, getTimeOffStats } from "@/lib/timeoffStorage";
import type { Consultant } from "@/types/consultant";

interface TimeOffTabProps {
  consultant: Consultant;
}

export function TimeOffTab({ consultant }: TimeOffTabProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentYear = new Date().getFullYear();
  
  const balances = useMemo(() => 
    getTimeOffBalances(consultant.id, currentYear), 
    [consultant.id, currentYear, refreshKey]
  );
  
  const requests = useMemo(() => 
    getTimeOffRequests({ consultantId: consultant.id }), 
    [consultant.id, refreshKey]
  );
  
  const stats = useMemo(() => 
    getTimeOffStats(consultant.id, currentYear), 
    [consultant.id, currentYear, refreshKey]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Days Off
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDaysOff}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.utilizationRate.toFixed(0)}% utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDaysOff}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled ahead
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Cards */}
      <TimeOffBalanceCards balances={balances} />

      {/* Main Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="requests">
              <Clock className="mr-2 h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="coverage">
              <Shield className="mr-2 h-4 w-4" />
              Coverage
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setRequestDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        <TabsContent value="requests" className="space-y-6">
          <TimeOffRequestsList 
            requests={requests} 
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <TimeOffCalendar consultantId={consultant.id} />
          <BlockoutPeriodsSection />
        </TabsContent>

        <TabsContent value="coverage" className="space-y-6">
          <CoverageSection 
            consultantId={consultant.id}
            consultantName={`${consultant.firstName} ${consultant.lastName}`}
          />
        </TabsContent>
      </Tabs>

      <TimeOffRequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        consultant={consultant}
        balances={balances}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
