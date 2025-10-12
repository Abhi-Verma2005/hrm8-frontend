import { mockEmployers } from "@/data/mockTableData";
import type { Employer, Department, Location } from "@/types/entities";

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

/**
 * Get department names from structured Department objects
 */
export function getDepartmentNames(departments?: Department[]): string[] {
  if (!departments) return [];
  return departments.map(dept => dept.name);
}

/**
 * Get location names from structured Location objects
 * Format: "San Francisco HQ, San Francisco, CA"
 */
export function getLocationNames(locations?: Location[]): string[] {
  if (!locations) return [];
  return locations.map(loc => {
    const parts = [loc.name];
    if (loc.city) parts.push(loc.city);
    if (loc.state) parts.push(loc.state);
    return parts.join(", ");
  });
}

/**
 * Get short location names (just the location name without city/state)
 */
export function getLocationShortNames(locations?: Location[]): string[] {
  if (!locations) return [];
  return locations.map(loc => loc.name);
}
