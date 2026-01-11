/**
 * HRM8 Company Jobs Page
 * Shows all jobs for a selected company with visibility controls
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Briefcase,
  Eye,
  MousePointerClick,
  Users,
  Search,
  MoreHorizontal,
  EyeOff,
  Pause,
  XCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface JobData {
  id: string;
  title: string;
  department?: string;
  location: string;
  status: string;
  hrm8Hidden: boolean;
  hrm8Status?: string;
  views: number;
  clicks: number;
  applications: number;
  postedAt: string;
}

interface CompanyData {
  id: string;
  name: string;
  logo?: string;
}

export default function Hrm8CompanyJobsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (companyId) {
      loadCompanyJobs();
    }
  }, [companyId]);

  const loadCompanyJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ company: CompanyData; jobs: JobData[] }>(`/api/hrm8/jobs/company/${companyId}`);
      if (response.success && response.data) {
        setCompany(response.data.company);
        setJobs(response.data.jobs);
      } else {
        console.error('Failed to load jobs:', response.error);
        setJobs([]);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (jobId: string, currentHidden: boolean) => {
    const response = await apiClient.put<void>(`/api/hrm8/jobs/${jobId}/visibility`, { hidden: !currentHidden });
    if (response.success) {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, hrm8Hidden: !currentHidden } : job
      ));
      toast.success(currentHidden ? 'Job is now visible' : 'Job hidden from job board');
    } else {
      toast.error('Failed to update visibility');
    }
  };

  const changeStatus = async (jobId: string, newStatus: string) => {
    const response = await apiClient.put<void>(`/api/hrm8/jobs/${jobId}/status`, { status: newStatus });
    if (response.success) {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, hrm8Status: newStatus, status: newStatus } : job
      ));
      toast.success(`Job marked as ${newStatus.replace('_', ' ').toLowerCase()}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (job: JobData) => {
    const status = job.hrm8Status || job.status;
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Open</Badge>;
      case 'ON_HOLD':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">On Hold</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Cancelled</Badge>;
      case 'FILLED':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Filled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (job.hrm8Status || job.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hrm8/job-board')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <AtsPageHeader
            title={company?.name || 'Company Jobs'}
            subtitle={`Manage jobs and visibility for ${company?.name || 'this company'}`}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-xl font-bold">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-xl font-bold">{jobs.reduce((a, j) => a + j.views, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MousePointerClick className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-xl font-bold">{jobs.reduce((a, j) => a + j.clicks, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-xl font-bold">{jobs.reduce((a, j) => a + j.applications, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="FILLED">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Apps</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          {job.department && (
                            <p className="text-xs text-muted-foreground">{job.department}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{job.location}</TableCell>
                      <TableCell>{getStatusBadge(job)}</TableCell>
                      <TableCell className="text-right font-medium">{job.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{job.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{job.applications}</TableCell>
                      <TableCell>
                        <Switch
                          checked={!job.hrm8Hidden}
                          onCheckedChange={() => toggleVisibility(job.id, job.hrm8Hidden)}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/hrm8/job-board/job/${job.id}`)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleVisibility(job.id, job.hrm8Hidden)}>
                              {job.hrm8Hidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                              {job.hrm8Hidden ? 'Show on Board' : 'Hide from Board'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(job.id, 'ON_HOLD')}>
                              <Pause className="h-4 w-4 mr-2" />
                              Put on Hold
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(job.id, 'CANCELLED')}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(job.id, 'FILLED')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Filled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
