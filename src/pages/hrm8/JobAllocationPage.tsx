/**
 * Job Allocation Page
 * HRM8 Global Admin job allocation management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { jobAllocationService } from '@/lib/hrm8/jobAllocationService';
import { regionService } from '@/lib/hrm8/regionService';
import { consultantManagementService } from '@/lib/hrm8/consultantManagementService';
import { jobService } from '@/lib/api/jobService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
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
      
      // Load jobs, regions, and consultants in parallel
      const [jobsRes, regionsRes, consultantsRes] = await Promise.all([
        jobService.getAllJobs(),
        regionService.getAll({ isActive: true }),
        consultantManagementService.getAll({ status: 'ACTIVE' }),
      ]);

      if (jobsRes.success && jobsRes.data?.jobs) {
        setJobs(jobsRes.data.jobs);
      }
      
      if (regionsRes.success && regionsRes.data?.regions) {
        setRegions(regionsRes.data.regions.map(r => ({ id: r.id, name: r.name })));
      }
      
      if (consultantsRes.success && consultantsRes.data?.consultants) {
        setConsultants(consultantsRes.data.consultants.map(c => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          regionId: c.regionId,
        })));
      }
    } catch (error) {
      toast.error('Failed to load data');
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
    <Hrm8PageLayout
      title="Job Allocation"
      subtitle="Allocate jobs to consultants and regions"
    >
      <div className="p-6 space-y-6">

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
    </Hrm8PageLayout>
  );
}
