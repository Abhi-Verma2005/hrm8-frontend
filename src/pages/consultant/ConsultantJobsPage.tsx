/**
 * Consultant Jobs Page
 * View assigned jobs for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { jobService } from '@/lib/api/jobService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultantJobsPage() {
  const { consultant } = useConsultantAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getJobs();
      if (response.success && response.data?.jobIds) {
        const jobIds = response.data.jobIds;
        
        // Fetch full job details
        const jobPromises = jobIds.map(async (jobId: string) => {
          const jobResponse = await jobService.getJobById(jobId);
          return jobResponse.success && jobResponse.data?.job ? jobResponse.data.job : null;
        });
        
        const jobDetails = (await Promise.all(jobPromises)).filter(Boolean);
        setJobs(jobDetails);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (job: any) => (
        <div>
          <div className="font-semibold">{job.title}</div>
          {job.department && (
            <div className="text-sm text-muted-foreground">{job.department}</div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (job: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{job.location}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (job: any) => (
        <Badge variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {job.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (job: any) => new Date(job.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
        <p className="text-muted-foreground mt-2">View and manage your assigned jobs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(j => j.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No jobs assigned yet
            </div>
          ) : (
            <DataTable
              data={jobs}
              columns={columns}
              searchable
              searchKeys={['title', 'location', 'department']}
              emptyMessage="No jobs found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}



