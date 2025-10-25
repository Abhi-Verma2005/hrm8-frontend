import { createServiceProject, updateServiceProject, getServiceProjectsByClient } from './recruitmentServiceStorage';
import type { ServiceProject, RPOFeeStructure } from '@/types/recruitmentService';

/**
 * Calculate total RPO contract value based on fee structures and duration
 */
export function calculateRPOContractValue(
  feeStructures: RPOFeeStructure[], 
  durationMonths: number,
  estimatedPlacements?: number
): number {
  let total = 0;
  
  feeStructures.forEach(fee => {
    switch (fee.frequency) {
      case 'monthly':
        total += fee.amount * durationMonths;
        break;
      case 'quarterly':
        total += fee.amount * Math.ceil(durationMonths / 3);
        break;
      case 'per-placement':
        total += fee.amount * (estimatedPlacements || 0);
        break;
      case 'one-time':
        total += fee.amount;
        break;
      default:
        // For custom or undefined, add as one-time
        total += fee.amount;
    }
  });
  
  return total;
}

/**
 * Calculate RPO progress metrics
 */
export function calculateRPOProgress(service: ServiceProject): {
  timeProgress: number;
  placementProgress: number;
  overallProgress: number;
} {
  const now = new Date();
  const start = new Date(service.rpoStartDate || service.startDate);
  const end = new Date(service.rpoEndDate || service.deadline);
  
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  const timeProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  const placementProgress = service.targetPlacements 
    ? Math.min((service.candidatesShortlisted / service.targetPlacements) * 100, 100)
    : 0;
  
  // Weighted: 30% time, 70% deliverables
  const overallProgress = (timeProgress * 0.3) + (placementProgress * 0.7);
  
  return {
    timeProgress: Math.round(timeProgress),
    placementProgress: Math.round(placementProgress),
    overallProgress: Math.round(overallProgress)
  };
}

/**
 * Create a new RPO service project
 */
export function createRPOService(data: Partial<ServiceProject>): ServiceProject {
  // Calculate contract value if fee structures provided
  let totalContractValue = data.rpoTotalContractValue || 0;
  
  if (data.rpoFeeStructures && data.rpoDuration) {
    totalContractValue = calculateRPOContractValue(
      data.rpoFeeStructures,
      data.rpoDuration,
      data.targetPlacements
    );
  }
  
  // Calculate end date from start date and duration
  let endDate = data.rpoEndDate;
  if (data.rpoStartDate && data.rpoDuration && !endDate) {
    const start = new Date(data.rpoStartDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + data.rpoDuration);
    endDate = end.toISOString().split('T')[0];
  }
  
  const rpoData: Partial<ServiceProject> = {
    ...data,
    serviceType: 'rpo',
    isRPO: true,
    rpoTotalContractValue: totalContractValue,
    rpoEndDate: endDate,
    projectValue: totalContractValue,
    // Set default values
    rpoAutoRenew: data.rpoAutoRenew ?? false,
    rpoNoticePeriod: data.rpoNoticePeriod ?? 30,
    targetPlacements: data.targetPlacements ?? 0
  };
  
  return createServiceProject(rpoData);
}

/**
 * Update an existing RPO service
 */
export function updateRPOService(id: string, updates: Partial<ServiceProject>): ServiceProject | null {
  // Recalculate contract value if fee structures or duration changed
  if (updates.rpoFeeStructures || updates.rpoDuration) {
    const current = updates as ServiceProject;
    const feeStructures = updates.rpoFeeStructures || current.rpoFeeStructures || [];
    const duration = updates.rpoDuration || current.rpoDuration || 0;
    
    if (feeStructures.length > 0 && duration > 0) {
      updates.rpoTotalContractValue = calculateRPOContractValue(
        feeStructures,
        duration,
        updates.targetPlacements || current.targetPlacements
      );
      updates.projectValue = updates.rpoTotalContractValue;
    }
  }
  
  // Recalculate end date if start date or duration changed
  if ((updates.rpoStartDate || updates.rpoDuration) && !updates.rpoEndDate) {
    const current = updates as ServiceProject;
    const startDate = updates.rpoStartDate || current.rpoStartDate;
    const duration = updates.rpoDuration || current.rpoDuration;
    
    if (startDate && duration) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + duration);
      updates.rpoEndDate = end.toISOString().split('T')[0];
      updates.deadline = updates.rpoEndDate;
    }
  }
  
  return updateServiceProject(id, updates);
}

/**
 * Get all RPO services for a specific employer
 */
export function getRPOServicesByEmployer(employerId: string): ServiceProject[] {
  return getServiceProjectsByClient(employerId).filter(p => p.serviceType === 'rpo' || p.isRPO);
}

/**
 * Add a fee structure to an RPO service
 */
export function addRPOFeeStructure(serviceId: string, fee: RPOFeeStructure): ServiceProject | null {
  const service = getServiceProjectsByClient('').find(s => s.id === serviceId);
  if (!service || !service.isRPO) return null;
  
  const currentFees = service.rpoFeeStructures || [];
  const updatedFees = [...currentFees, fee];
  
  return updateRPOService(serviceId, {
    rpoFeeStructures: updatedFees
  });
}

/**
 * Remove a fee structure from an RPO service
 */
export function removeRPOFeeStructure(serviceId: string, feeId: string): ServiceProject | null {
  const service = getServiceProjectsByClient('').find(s => s.id === serviceId);
  if (!service || !service.isRPO) return null;
  
  const updatedFees = (service.rpoFeeStructures || []).filter(f => f.id !== feeId);
  
  return updateRPOService(serviceId, {
    rpoFeeStructures: updatedFees
  });
}
