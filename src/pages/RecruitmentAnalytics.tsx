import { useMemo, useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { getApplications } from '@/lib/mockApplicationStorage';
import { getCandidates } from '@/lib/mockCandidateStorage';
import { getJobs } from '@/lib/mockJobStorage';
import {
  calculateRecruitmentFunnel,
  calculateTimeToHire,
  calculateSourceEffectiveness,
  calculateTeamPerformance,
  calculateOverallMetrics,
} from '@/lib/analytics/recruitmentMetrics';
import { RecruitmentFunnelChart } from '@/components/analytics/RecruitmentFunnelChart';
import { TimeToHireChart } from '@/components/analytics/TimeToHireChart';
import { SourceEffectivenessChart } from '@/components/analytics/SourceEffectivenessChart';
import { TeamPerformanceChart } from '@/components/analytics/TeamPerformanceChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subMonths, isWithinInterval } from 'date-fns';
import { exportAnalyticsPDF } from '@/lib/analytics/exportAnalyticsPDF';
import { useToast } from '@/hooks/use-toast';

export default function RecruitmentAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });
  const [selectedJob, setSelectedJob] = useState<string>('all');

  const applications = useMemo(() => getApplications(), []);
  const candidates = useMemo(() => getCandidates(), []);
  const jobs = useMemo(() => getJobs(), []);

  // Filter data based on date range and job selection
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(app =>
        isWithinInterval(app.appliedDate, {
          start: dateRange.from!,
          end: dateRange.to!,
        })
      );
    }

    if (selectedJob && selectedJob !== 'all') {
      filtered = filtered.filter(app => app.jobId === selectedJob);
    }

    return filtered;
  }, [applications, dateRange, selectedJob]);

  // Calculate all metrics
  const overallMetrics = useMemo(
    () => calculateOverallMetrics(filteredApplications),
    [filteredApplications]
  );

  const funnelMetrics = useMemo(
    () => calculateRecruitmentFunnel(filteredApplications),
    [filteredApplications]
  );

  const timeToHireMetrics = useMemo(
    () => calculateTimeToHire(filteredApplications),
    [filteredApplications]
  );

  const sourceMetrics = useMemo(
    () => calculateSourceEffectiveness(filteredApplications, candidates),
    [filteredApplications, candidates]
  );

  const teamMetrics = useMemo(
    () => calculateTeamPerformance(filteredApplications, jobs),
    [filteredApplications, jobs]
  );

  const handleExportReport = () => {
    try {
      exportAnalyticsPDF({
        overallMetrics,
        funnelMetrics,
        timeToHireMetrics,
        sourceMetrics,
        teamMetrics,
        dateRange: dateRange?.from && dateRange?.to ? {
          from: dateRange.from,
          to: dateRange.to,
        } : undefined,
        selectedJob,
      });
      
      toast({
        title: 'Report Exported',
        description: 'Analytics report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export analytics report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardPageLayout
      title="Recruitment Analytics"
      breadcrumbActions={<Breadcrumbs />}
    >
      <div className="space-y-6 p-6">
        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className="w-[300px]"
            />
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Applications"
            value={overallMetrics.total.toString()}
            change="+12%"
            icon={<BarChart3 className="h-6 w-6" />}
            variant="neutral"
          />
          <EnhancedStatCard
            title="Hire Rate"
            value={`${overallMetrics.hireRate}%`}
            icon={<BarChart3 className="h-6 w-6" />}
            variant="primary"
            change={overallMetrics.hireRate >= 15 ? '+5%' : '-2%'}
            trend={overallMetrics.hireRate >= 15 ? 'up' : 'down'}
          />
          <EnhancedStatCard
            title="Avg. Time to Hire"
            value={`${timeToHireMetrics.averageDays}d`}
            change={timeToHireMetrics.averageDays < 30 ? '-3d' : '+2d'}
            trend={timeToHireMetrics.averageDays < 30 ? 'down' : 'up'}
            icon={<Calendar className="h-6 w-6" />}
            variant="neutral"
          />
          <EnhancedStatCard
            title="Active Pipeline"
            value={overallMetrics.active.toString()}
            change="+8%"
            icon={<Filter className="h-6 w-6" />}
            variant="neutral"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="funnel">Recruitment Funnel</TabsTrigger>
            <TabsTrigger value="time">Time to Hire</TabsTrigger>
            <TabsTrigger value="sources">Source Effectiveness</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-4">
            <RecruitmentFunnelChart data={funnelMetrics} />
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <TimeToHireChart data={timeToHireMetrics} />
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <SourceEffectivenessChart data={sourceMetrics} />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamPerformanceChart data={teamMetrics} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
