import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { getBlockoutPeriods } from "@/lib/timeoffStorage";
import type { BlockoutPeriod } from "@/types/timeoff";

export function BlockoutPeriodsSection() {
  const [periods] = useState<BlockoutPeriod[]>(getBlockoutPeriods(true));

  if (periods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blockout Periods</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No blockout periods configured</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blockout Periods</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className="rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{period.name}</h4>
                    {period.appliesToAll && (
                      <Badge variant="secondary">All Consultants</Badge>
                    )}
                    {period.allowExceptions && (
                      <Badge variant="outline">Exceptions Allowed</Badge>
                    )}
                  </div>
                  {period.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {period.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(new Date(period.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(period.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-sm">
                  <span className="text-muted-foreground">Reason:</span>{' '}
                  {period.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
