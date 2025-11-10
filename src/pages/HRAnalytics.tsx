import { useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployees } from "@/lib/employeeStorage";
import { Users, Briefcase, TrendingUp, DollarSign, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";

export default function HRAnalytics() {
  const employees = getEmployees();
  const { formatCurrency } = useCurrencyFormat();

  const analytics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onLeave = employees.filter(e => e.status === 'on-leave').length;
    const noticePeriod = employees.filter(e => e.status === 'notice-period').length;

    const byDepartment = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byLocation = employees.reduce((acc, emp) => {
      acc[emp.location] = (acc[emp.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byEmploymentType = employees.reduce((acc, emp) => {
      acc[emp.employmentType] = (acc[emp.employmentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / total;
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);

    const allSkills = employees.flatMap(e => e.skills || []);
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      total,
      active,
      onLeave,
      noticePeriod,
      byDepartment,
      byLocation,
      byEmploymentType,
      avgSalary,
      totalPayroll,
      topSkills,
    };
  }, [employees]);

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HR Analytics</h1>
          <p className="text-muted-foreground">
            Insights and statistics about your workforce
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={analytics.total}
            icon={Users}
            description={`${analytics.active} active`}
          />
          <StatCard
            title="On Leave"
            value={analytics.onLeave}
            icon={Briefcase}
            description={`${analytics.noticePeriod} in notice period`}
          />
          <StatCard
            title="Average Salary"
            value={formatCurrency(analytics.avgSalary)}
            icon={DollarSign}
          />
          <StatCard
            title="Total Payroll"
            value={formatCurrency(analytics.totalPayroll)}
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employees by Department</CardTitle>
              <CardDescription>Distribution across departments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.byDepartment)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({Math.round((count / analytics.total) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(count / analytics.total) * 100} />
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employees by Location</CardTitle>
              <CardDescription>Geographic distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.byLocation)
                .sort((a, b) => b[1] - a[1])
                .map(([location, count]) => (
                  <div key={location} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{location}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} ({Math.round((count / analytics.total) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(count / analytics.total) * 100} />
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Type Distribution</CardTitle>
              <CardDescription>Breakdown by employment type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.byEmploymentType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                    <Badge variant="secondary">
                      {count} ({Math.round((count / analytics.total) * 100)}%)
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Skills</CardTitle>
              <CardDescription>Most common skills in workforce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.topSkills.length > 0 ? (
                analytics.topSkills.map(([skill, count]) => (
                  <div key={skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{skill}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No skills data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
