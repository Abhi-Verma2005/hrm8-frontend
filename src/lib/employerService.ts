import { mockEmployers } from "@/data/mockTableData";
import type { Employer } from "@/types/entities";

/**
 * Get all employers
 */
export function getEmployers(): Employer[] {
  return mockEmployers;
}

/**
 * Get employer by ID
 */
export function getEmployerById(id: string): Employer | undefined {
  return mockEmployers.find(employer => employer.id === id);
}

/**
 * Search employers by name, industry, or location
 */
export function searchEmployers(query: string): Employer[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return mockEmployers;
  }
  
  return mockEmployers.filter(employer => 
    employer.name.toLowerCase().includes(searchTerm) ||
    employer.industry.toLowerCase().includes(searchTerm) ||
    employer.location.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get active employers only
 */
export function getActiveEmployers(): Employer[] {
  return mockEmployers.filter(employer => employer.status === 'active');
}
