/**
 * Job Allocation Page
 * HRM8 Global Admin job allocation management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { jobAllocationService } from '@/lib/hrm8/jobAllocationService';
import { regionService } from '@/lib/hrm8/regionService';
import { consultantManagementService } from '@/lib/hrm8/consultantManagementService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Briefcase, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function JobAllocationPage() {
  const { hrm8User } = useHrm8Auth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([]);
  const [consultants, setConsultants] = useState<Array<{ id: string; firstName: string; lastName: string; regionId?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>('');

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('[Job Allocation] Starting to load data...');
      
      // Load jobs, regions, and consultants in parallel
      const [jobsRes, regionsRes, consultantsRes] = await Promise.allSettled([
        (async () => {
          console.log('[Job Allocation] Fetching jobs...');
          try {
            // Use HRM8 jobs endpoint which supports HRM8 authentication
            const res = await jobAllocationService.getAll();
            console.log('[Job Allocation] Jobs response:', { 
              success: res.success, 
              error: res.error,
              dataType: typeof res.data,
              count: res.data?.jobs?.length || 0
            });
            return res;
          } catch (error) {
            console.error('[Job Allocation] Jobs fetch error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: { jobs: [] } };
          }
        })(),
        (async () => {
          console.log('[Job Allocation] Fetching regions...');
          const res = await regionService.getAll({ isActive: true });
          console.log('[Job Allocation] Regions response:', { success: res.success, error: res.error, count: res.data?.regions?.length });
          return res;
        })(),
        (async () => {
          console.log('[Job Allocation] Fetching consultants...');
          const res = await consultantManagementService.getAll({ status: 'ACTIVE' });
          console.log('[Job Allocation] Consultants response:', { success: res.success, error: res.error, count: res.data?.consultants?.length });
          return res;
        })(),
      ]);

      // Process jobs
      if (jobsRes.status === 'fulfilled') {
        const jobsResponse = jobsRes.value;
        if (jobsResponse.success && jobsResponse.data?.jobs) {
          setJobs(jobsResponse.data.jobs);
          console.log('[Job Allocation] Set jobs:', jobsResponse.data.jobs.length);
        } else {
          console.warn('[Job Allocation] Jobs failed:', jobsResponse.error);
          setJobs([]);
          toast.error(`Failed to load jobs: ${jobsResponse.error || 'Unknown error'}`);
        }
      } else {
        console.error('[Job Allocation] Jobs promise rejected:', jobsRes.reason);
        setJobs([]);
        toast.error('Failed to load jobs');
      }
      
      // Process regions
      if (regionsRes.status === 'fulfilled') {
        const regionsResponse = regionsRes.value;
        if (regionsResponse.success && regionsResponse.data?.regions) {
          setRegions(regionsResponse.data.regions.map(r => ({ id: r.id, name: r.name })));
          console.log('[Job Allocation] Set regions:', regionsResponse.data.regions.length);
        } else {
          console.error('[Job Allocation] Regions failed:', regionsResponse.error);
          toast.error(`Failed to load regions: ${regionsResponse.error || 'Unknown error'}`);
        }
      } else {
        console.error('[Job Allocation] Regions promise rejected:', regionsRes.reason);
        toast.error('Failed to load regions');
      }
      
      // Process consultants
      if (consultantsRes.status === 'fulfilled') {
        const consultantsResponse = consultantsRes.value;
        if (consultantsResponse.success && consultantsResponse.data?.consultants) {
          setConsultants(consultantsResponse.data.consultants.map(c => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            regionId: c.regionId,
          })));
          console.log('[Job Allocation] Set consultants:', consultantsResponse.data.consultants.length);
        } else {
          console.error('[Job Allocation] Consultants failed:', consultantsResponse.error);
          toast.error(`Failed to load consultants: ${consultantsResponse.error || 'Unknown error'}`);
        }
      } else {
        console.error('[Job Allocation] Consultants promise rejected:', consultantsRes.reason);
        toast.error('Failed to load consultants');
      }

      console.log('[Job Allocation] Data loading completed');
    } catch (error) {
      console.error('[Job Allocation] Unexpected error:', error);
      toast.error(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToRegion = async () => {
    if (!selectedJobId || !selectedRegionId) {
      toast.error('Please select a job and region');
      return;
    }

    try {
      const response = await jobAllocationService.assignRegion(selectedJobId, selectedRegionId);
      if (response.success) {
        toast.success('Job assigned to region successfully');
        setSelectedJobId(null);
        setSelectedRegionId('');
        await loadData();
      } else {
        toast.error(response.error || 'Failed to assign job');
      }
    } catch (error) {
      toast.error('Failed to assign job to region');
    }
  };

  const handleAssignToConsultant = async () => {
    if (!selectedJobId || !selectedConsultantId) {
      toast.error('Please select a job and consultant');
      return;
    }

    try {
      const response = await jobAllocationService.assignConsultant(selectedJobId, selectedConsultantId);
      if (response.success) {
        toast.success('Job assigned to consultant successfully');
        setSelectedJobId(null);
        setSelectedConsultantId('');
        await loadData();
      } else {
        toast.error(response.error || 'Failed to assign job');
      }
    } catch (error) {
      toast.error('Failed to assign job to consultant');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
    },
    {
      key: 'status',
      label: 'Status',
      render: (job: any) => (
        <span className={job.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
          {job.status}
        </span>
      ),
    },
    {
      key: 'regionId',
      label: 'Assigned Region',
      render: (job: any) => {
        if (!job.regionId) return <span className="text-muted-foreground">Unassigned</span>;
        const region = regions.find(r => r.id === job.regionId);
        return region ? region.name : 'Unknown';
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Allocation</h1>
        <p className="text-muted-foreground mt-2">Allocate jobs to consultants and regions</p>
      </div>

      {isGlobalAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Allocate Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Job</Label>
              <Select
                value={selectedJobId || ''}
                onValueChange={setSelectedJobId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assign to Region</Label>
                <Select
                  value={selectedRegionId}
                  onValueChange={setSelectedRegionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignToRegion}
                  disabled={!selectedJobId || !selectedRegionId}
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Assign to Region
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Assign to Consultant</Label>
                <Select
                  value={selectedConsultantId}
                  onValueChange={setSelectedConsultantId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultants.map((consultant) => (
                      <SelectItem key={consultant.id} value={consultant.id}>
                        {consultant.firstName} {consultant.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignToConsultant}
                  disabled={!selectedJobId || !selectedConsultantId}
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Assign to Consultant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : (
            <DataTable
              data={jobs}
              columns={columns}
              searchable
              searchKeys={['title', 'location']}
              emptyMessage="No jobs found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
