import type { Consultant, ConsultantType } from '@/types/consultant';
import type { ServiceProject, ServiceType } from '@/types/recruitmentService';
import { getAllConsultants } from './consultantStorage';
import { getAllServiceProjects } from './recruitmentServiceStorage';

export interface WorkloadData {
  consultantId: string;
  consultantName: string;
  consultantType: ConsultantType;
  consultantStatus: string;
  avatar?: string;
  maxJobs: number;
  currentJobs: number;
  maxEmployers: number;
  currentEmployers: number;
  totalCapacity: number;
  totalAssigned: number;
  utilizationPercent: number;
  status: 'available' | 'busy' | 'at-capacity' | 'overloaded';
  serviceBreakdown: {
    shortlisting: number;
    'full-service': number;
    'executive-search': number;
    rpo: number;
  };
  activeServices: Array<{
    id: string;
    name: string;
    type: ServiceType;
  }>;
}

export interface TeamWorkloadSummary {
  totalActive: number;
  atCapacity: number;
  available: number;
  overloaded: number;
  averageUtilization: number;
  workloadData: WorkloadData[];
}

export interface ServiceTypeBreakdown {
  shortlisting: { count: number; percentage: number };
  'full-service': { count: number; percentage: number };
  'executive-search': { count: number; percentage: number };
  rpo: { count: number; percentage: number };
  total: number;
}

export function calculateConsultantWorkload(consultantId: string): WorkloadData {
  const consultants = getAllConsultants();
  const consultant = consultants.find(c => c.id === consultantId);
  
  if (!consultant) {
    throw new Error(`Consultant ${consultantId} not found`);
  }

  // Get all active service projects assigned to this consultant
  const allServices = getAllServiceProjects();
  const consultantServices = allServices.filter(
    service => 
      service.status === 'active' && 
      service.consultants.some(c => c.id === consultantId)
  );

  // Calculate service type breakdown
  const serviceBreakdown = {
    shortlisting: consultantServices.filter(s => s.serviceType === 'shortlisting').length,
    'full-service': consultantServices.filter(s => s.serviceType === 'full-service').length,
    'executive-search': consultantServices.filter(s => s.serviceType === 'executive-search').length,
    rpo: consultantServices.filter(s => s.serviceType === 'rpo').length,
  };

  const totalCapacity = consultant.maxJobs + consultant.maxEmployers;
  const totalAssigned = consultant.currentJobs + consultant.currentEmployers;
  const utilizationPercent = totalCapacity > 0 ? (totalAssigned / totalCapacity) * 100 : 0;

  let status: WorkloadData['status'];
  if (utilizationPercent > 100) {
    status = 'overloaded';
  } else if (utilizationPercent >= 86) {
    status = 'at-capacity';
  } else if (utilizationPercent >= 61) {
    status = 'busy';
  } else {
    status = 'available';
  }

  return {
    consultantId: consultant.id,
    consultantName: `${consultant.firstName} ${consultant.lastName}`,
    consultantType: consultant.type,
    consultantStatus: consultant.status,
    avatar: consultant.photo,
    maxJobs: consultant.maxJobs,
    currentJobs: consultant.currentJobs,
    maxEmployers: consultant.maxEmployers,
    currentEmployers: consultant.currentEmployers,
    totalCapacity,
    totalAssigned,
    utilizationPercent: Math.round(utilizationPercent),
    status,
    serviceBreakdown,
    activeServices: consultantServices.map(s => ({
      id: s.id,
      name: s.name,
      type: s.serviceType,
    })),
  };
}

export function getTeamWorkloadSummary(): TeamWorkloadSummary {
  const consultants = getAllConsultants();
  const activeConsultants = consultants.filter(c => c.status === 'active');

  const workloadData = activeConsultants.map(c => calculateConsultantWorkload(c.id));

  const atCapacity = workloadData.filter(w => w.status === 'at-capacity').length;
  const available = workloadData.filter(w => w.status === 'available').length;
  const overloaded = workloadData.filter(w => w.status === 'overloaded').length;

  const totalUtilization = workloadData.reduce((sum, w) => sum + w.utilizationPercent, 0);
  const averageUtilization = workloadData.length > 0 
    ? Math.round(totalUtilization / workloadData.length) 
    : 0;

  return {
    totalActive: activeConsultants.length,
    atCapacity,
    available,
    overloaded,
    averageUtilization,
    workloadData: workloadData.sort((a, b) => b.utilizationPercent - a.utilizationPercent),
  };
}

export function getServiceTypeDistribution(): ServiceTypeBreakdown {
  const allServices = getAllServiceProjects();
  const activeServices = allServices.filter(s => s.status === 'active');

  const counts = {
    shortlisting: activeServices.filter(s => s.serviceType === 'shortlisting').length,
    'full-service': activeServices.filter(s => s.serviceType === 'full-service').length,
    'executive-search': activeServices.filter(s => s.serviceType === 'executive-search').length,
    rpo: activeServices.filter(s => s.serviceType === 'rpo').length,
  };

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return {
    shortlisting: {
      count: counts.shortlisting,
      percentage: total > 0 ? Math.round((counts.shortlisting / total) * 100) : 0,
    },
    'full-service': {
      count: counts['full-service'],
      percentage: total > 0 ? Math.round((counts['full-service'] / total) * 100) : 0,
    },
    'executive-search': {
      count: counts['executive-search'],
      percentage: total > 0 ? Math.round((counts['executive-search'] / total) * 100) : 0,
    },
    rpo: {
      count: counts.rpo,
      percentage: total > 0 ? Math.round((counts.rpo / total) * 100) : 0,
    },
    total,
  };
}

export function getCapacityColor(utilizationPercent: number): string {
  if (utilizationPercent > 100) return 'hsl(var(--destructive))';
  if (utilizationPercent >= 86) return 'hsl(var(--warning))';
  if (utilizationPercent >= 61) return 'hsl(var(--chart-2))';
  return 'hsl(var(--chart-1))';
}

export function getCapacityBgColor(utilizationPercent: number): string {
  if (utilizationPercent > 100) return 'bg-destructive/10';
  if (utilizationPercent >= 86) return 'bg-warning/10';
  if (utilizationPercent >= 61) return 'bg-chart-2/10';
  return 'bg-chart-1/10';
}
