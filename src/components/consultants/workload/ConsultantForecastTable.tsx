import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import type { MonthlyForecast } from '@/lib/workloadForecastUtils';
import { cn } from '@/lib/utils';

interface ConsultantForecastTableProps {
  forecasts: MonthlyForecast[];
}

export function ConsultantForecastTable({ forecasts }: ConsultantForecastTableProps) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(forecasts[0]?.monthLabel || null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'at-capacity':
        return 'warning';
      case 'overloaded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'at-capacity':
        return 'At Capacity';
      case 'overloaded':
        return 'Overloaded';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Consultant Forecast Details
        </CardTitle>
        <CardDescription>Month-by-month capacity breakdown per consultant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forecasts.map(forecast => (
            <Collapsible
              key={forecast.monthLabel}
              open={expandedMonth === forecast.monthLabel}
              onOpenChange={() =>
                setExpandedMonth(
                  expandedMonth === forecast.monthLabel ? null : forecast.monthLabel
                )
              }
            >
              <div className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      {expandedMonth === forecast.monthLabel ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="text-left">
                        <h4 className="font-semibold">{forecast.monthLabel}</h4>
                        <p className="text-sm text-muted-foreground">
                          Team Utilization: {forecast.teamAverageUtilization}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {forecast.overloadedConsultants > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {forecast.overloadedConsultants} Overloaded
                        </Badge>
                      )}
                      {forecast.atCapacityConsultants > 0 && (
                        <Badge variant="warning" className="gap-1">
                          {forecast.atCapacityConsultants} At Capacity
                        </Badge>
                      )}
                      <div className="w-32">
                        <Progress value={forecast.teamAverageUtilization} className="h-2" />
                      </div>
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Consultant</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Utilization</TableHead>
                          <TableHead>Services</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forecast.consultantForecasts
                          .sort((a, b) => b.utilizationPercent - a.utilizationPercent)
                          .map(consultant => (
                            <TableRow key={consultant.consultantId}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{consultant.consultantName}</p>
                                  {consultant.timeOffDays > 0 && (
                                    <p className="text-xs text-warning">
                                      {consultant.timeOffDays} days off ({consultant.timeOffHours}h)
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(consultant.status)}>
                                  {getStatusLabel(consultant.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <span className="font-medium">{consultant.hoursAssigned}h</span>
                                  <span className="text-muted-foreground">
                                    {' '}
                                    / {consultant.adjustedCapacity}h
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                      {consultant.utilizationPercent}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={consultant.utilizationPercent}
                                    className="h-2 w-24"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {consultant.activeServices.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {consultant.activeServices.map(service => (
                                        <Badge
                                          key={service.id}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {service.serviceType}: {service.hours}h
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  {consultant.pipelineServices.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {consultant.pipelineServices.map(service => (
                                        <Badge
                                          key={service.id}
                                          variant="secondary"
                                          className="text-xs opacity-70"
                                        >
                                          Pipeline: {service.serviceType} ({service.probability}%)
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  {consultant.activeServices.length === 0 &&
                                    consultant.pipelineServices.length === 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        No services
                                      </span>
                                    )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
