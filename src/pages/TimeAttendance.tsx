import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, UserCheck, TrendingUp, Download, Plus } from "lucide-react";
import { getAttendanceRecords, getOvertimeRequests } from "@/lib/attendanceStorage";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function TimeAttendance() {
  const [refreshKey, setRefreshKey] = useState(0);

  const attendanceRecords = useMemo(() => getAttendanceRecords(), [refreshKey]);
  const overtimeRequests = useMemo(() => getOvertimeRequests(), [refreshKey]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    
    return {
      totalPresent: todayRecords.filter(r => ['present', 'late'].includes(r.status)).length,
      totalAbsent: todayRecords.filter(r => r.status === 'absent').length,
      totalLate: todayRecords.filter(r => r.status === 'late').length,
      pendingOT: overtimeRequests.filter(r => r.status === 'pending').length,
    };
  }, [attendanceRecords, overtimeRequests]);

  return (
    <DashboardPageLayout
      title="Time & Attendance"
      description="Track employee attendance, shifts, and overtime"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.totalPresent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <UserCheck className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.totalAbsent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.totalLate}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending OT</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendingOT}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="overtime">Overtime Requests</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
          </div>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceRecords
                    .filter(r => r.date === new Date().toISOString().split('T')[0])
                    .map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{record.shiftName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {record.checkIn && (
                            <div className="text-sm">
                              <p className="text-muted-foreground">Check In</p>
                              <p className="font-medium">{format(new Date(record.checkIn), 'HH:mm')}</p>
                            </div>
                          )}
                          {record.checkOut && (
                            <div className="text-sm">
                              <p className="text-muted-foreground">Check Out</p>
                              <p className="font-medium">{format(new Date(record.checkOut), 'HH:mm')}</p>
                            </div>
                          )}
                          <Badge
                            variant={
                              record.status === 'present' ? 'default' :
                              record.status === 'late' ? 'secondary' :
                              record.status === 'absent' ? 'destructive' : 'outline'
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overtime" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overtime Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overtimeRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">{format(new Date(request.date), 'MMM dd, yyyy')}</p>
                          <p className="font-medium">{request.hours} hours</p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shifts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shift Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Shift management interface</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Attendance analytics and reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
