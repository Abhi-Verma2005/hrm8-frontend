import { getAllConsultants, getConsultantById } from './consultantStorage';
import type { SalesAgent, SalesAgentStatus, SalesRole } from '@/types/salesAgent';
import { Consultant } from './consultantStorage';

// Helper to map Consultant to SalesAgent
// This is a temporary adapter until we fully unify the types in the frontend
function mapConsultantToSalesAgent(consultant: Consultant): SalesAgent {
  const isSalesRole = consultant.role === 'SALES_AGENT' || consultant.role === 'CONSULTANT_360';

  return {
    id: consultant.id,
    firstName: consultant.firstName,
    lastName: consultant.lastName,
    email: consultant.email,
    phone: consultant.phone || '',
    photo: consultant.photo,

    // Defaulting sales fields since they might not be in Consultant type yet or need mapping
    salesRole: (consultant.role === 'SALES_AGENT' ? 'sales-rep' : 'account-manager') as SalesRole,
    salesType: 'outside-sales', // Default
    status: (consultant.status?.toLowerCase() || 'active') as SalesAgentStatus,

    territoryIds: [], // To be implemented in backend
    assignedEmployers: [],
    quotaAmount: consultant.totalRevenue * 10, // Mock calculation or need field
    quotaPeriod: 'annual',

    currentRevenue: consultant.totalRevenue || 0,
    closedDeals: consultant.totalPlacements || 0,
    activeOpportunities: consultant.currentLeads || 0,
    conversionRate: consultant.successRate || 0,
    averageDealSize: consultant.averageDaysToFill ? consultant.averageDaysToFill * 1000 : 5000,

    commissionStructure: 'tiered',
    defaultCommissionRate: consultant.defaultCommissionRate || 10,
    totalCommissionsEarned: consultant.totalCommissionsPaid || 0,
    pendingCommissions: consultant.pendingCommissions || 0,

    hireDate: consultant.createdAt,
    reportingTo: undefined,
    reportingToName: undefined,
    createdAt: consultant.createdAt,
    updatedAt: consultant.updatedAt,
  };
}

export function getAllSalesAgents(): SalesAgent[] {
  // We can't use async here directly if the component expects synchronous return
  // But getAllConsultants IS async. 
  // IMPORTANT: The component SalesTeamPage.tsx uses syntax: const [salesAgents] = useState<SalesAgent[]>(getAllSalesAgents());
  // This implies getAllSalesAgents is currently synchronous.
  // We need to change the component to use useEffect/async or make this compatible.
  // For now, let's keep the mock structure BUT return empty initially so we can fix the component to load async.
  console.error("getAllSalesAgents is deprecated for direct synchronous use. Use useSalesAgents hook or similar.");
  return [];
}

// New Async Functions to be used by the page
export async function fetchSalesAgents(): Promise<SalesAgent[]> {
  const allConsultants = await getAllConsultants();

  // Filter for Sales Roles
  const salesConsultants = allConsultants.filter(c =>
    c.role === 'SALES_AGENT' || c.role === 'CONSULTANT_360'
  );

  return salesConsultants.map(mapConsultantToSalesAgent);
}

export async function fetchSalesAgentStats() {
  const agents = await fetchSalesAgents();
  const active = agents.filter(a => a.status === 'active');

  return {
    total: agents.length,
    active: active.length,
    inactive: agents.filter(a => a.status === 'inactive').length,
    onLeave: agents.filter(a => a.status === 'on-leave').length,
    totalRevenue: active.reduce((sum, a) => sum + a.currentRevenue, 0),
    totalQuota: 1000000 * active.length, // Placeholder target
    avgConversionRate: active.length > 0 ? active.reduce((sum, a) => sum + a.conversionRate, 0) / active.length : 0,
    totalClosedDeals: active.reduce((sum, a) => sum + a.closedDeals, 0),
    totalActiveOpportunities: active.reduce((sum, a) => sum + a.activeOpportunities, 0),
  };
}

// Deprecated sync functions (placeholders)
export function getSalesAgentStats() {
  return {
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    totalRevenue: 0,
    totalQuota: 0,
    avgConversionRate: 0,
    totalClosedDeals: 0,
    totalActiveOpportunities: 0,
  };
}
