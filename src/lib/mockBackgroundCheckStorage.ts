import type { BackgroundCheck } from '@/types/backgroundCheck';

const STORAGE_KEY = 'hrm8_background_checks';

const mockBackgroundChecks: BackgroundCheck[] = [
  {
    id: 'bc-001',
    candidateId: 'cand-001',
    candidateName: 'Sarah Johnson',
    applicationId: 'app-001',
    provider: 'checkr',
    checkTypes: [
      { type: 'reference', required: true },
      { type: 'criminal', required: true },
      { type: 'identity', required: true }
    ],
    status: 'completed',
    initiatedBy: 'rec-001',
    initiatedByName: 'Michael Chen',
    initiatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'clear', completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'criminal', status: 'clear', completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'identity', status: 'clear', completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    overallStatus: 'clear',
    totalCost: 157,
    country: 'United States',
    region: 'California',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-002',
    candidateId: 'cand-002',
    candidateName: 'David Martinez',
    applicationId: 'app-002',
    provider: 'sterling',
    checkTypes: [
      { type: 'reference', required: true },
      { type: 'employment', required: true },
      { type: 'education', required: true }
    ],
    status: 'in-progress',
    initiatedBy: 'rec-002',
    initiatedByName: 'Emily Rodriguez',
    initiatedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'clear', completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'employment', status: 'pending' },
      { checkType: 'education', status: 'pending' }
    ],
    totalCost: 187,
    country: 'United States',
    region: 'Texas',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-003',
    candidateId: 'cand-003',
    candidateName: 'Jennifer Lee',
    applicationId: 'app-003',
    provider: 'hireright',
    checkTypes: [
      { type: 'criminal', required: true },
      { type: 'identity', required: true }
    ],
    status: 'pending-consent',
    initiatedBy: 'rec-001',
    initiatedByName: 'Michael Chen',
    initiatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: false,
    results: [],
    totalCost: 88,
    country: 'United States',
    region: 'New York',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-004',
    candidateId: 'cand-004',
    candidateName: 'Robert Anderson',
    applicationId: 'app-004',
    provider: 'manual',
    checkTypes: [
      { type: 'reference', required: true },
      { type: 'professional-license', required: true }
    ],
    status: 'completed',
    initiatedBy: 'rec-003',
    initiatedByName: 'Lisa Thompson',
    initiatedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'clear', completedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'professional-license', status: 'review-required', completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), details: 'License expires in 3 months' }
    ],
    overallStatus: 'conditional',
    totalCost: 128,
    country: 'Canada',
    region: 'Ontario',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-005',
    candidateId: 'cand-005',
    candidateName: 'Maria Garcia',
    applicationId: 'app-005',
    provider: 'checkr',
    checkTypes: [
      { type: 'criminal', required: true },
      { type: 'credit', required: false },
      { type: 'drug-screen', required: true }
    ],
    status: 'issues-found',
    initiatedBy: 'rec-002',
    initiatedByName: 'Emily Rodriguez',
    initiatedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'criminal', status: 'not-clear', completedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), details: 'Minor misdemeanor found (2018)' },
      { checkType: 'credit', status: 'review-required', completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'drug-screen', status: 'clear', completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    overallStatus: 'not-clear',
    totalCost: 167,
    country: 'United States',
    region: 'Florida',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-006',
    candidateId: 'cand-006',
    candidateName: 'James Wilson',
    applicationId: 'app-006',
    provider: 'sterling',
    checkTypes: [
      { type: 'reference', required: true },
      { type: 'employment', required: true }
    ],
    status: 'in-progress',
    initiatedBy: 'rec-001',
    initiatedByName: 'Michael Chen',
    initiatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'pending' },
      { checkType: 'employment', status: 'pending' }
    ],
    totalCost: 118,
    country: 'United Kingdom',
    region: 'London',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-007',
    candidateId: 'cand-007',
    candidateName: 'Patricia Brown',
    provider: 'hireright',
    checkTypes: [
      { type: 'identity', required: true },
      { type: 'education', required: true }
    ],
    status: 'not-started',
    initiatedBy: 'rec-003',
    initiatedByName: 'Lisa Thompson',
    initiatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: false,
    results: [],
    totalCost: 98,
    country: 'Australia',
    region: 'Sydney',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-008',
    candidateId: 'cand-008',
    candidateName: 'Michael Taylor',
    applicationId: 'app-008',
    provider: 'checkr',
    checkTypes: [
      { type: 'reference', required: true },
      { type: 'criminal', required: true },
      { type: 'employment', required: true }
    ],
    status: 'completed',
    initiatedBy: 'rec-002',
    initiatedByName: 'Emily Rodriguez',
    initiatedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'clear', completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'criminal', status: 'clear', completedDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString() },
      { checkType: 'employment', status: 'clear', completedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    overallStatus: 'clear',
    totalCost: 177,
    country: 'United States',
    region: 'Washington',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-009',
    candidateId: 'cand-009',
    candidateName: 'Linda Davis',
    applicationId: 'app-009',
    provider: 'manual',
    checkTypes: [
      { type: 'reference', required: true }
    ],
    status: 'in-progress',
    initiatedBy: 'rec-001',
    initiatedByName: 'Michael Chen',
    initiatedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: true,
    consentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    results: [
      { checkType: 'reference', status: 'pending' }
    ],
    totalCost: 69,
    country: 'United States',
    region: 'Illinois',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bc-010',
    candidateId: 'cand-010',
    candidateName: 'Christopher Moore',
    applicationId: 'app-010',
    provider: 'sterling',
    checkTypes: [
      { type: 'criminal', required: true },
      { type: 'identity', required: true },
      { type: 'education', required: true },
      { type: 'employment', required: true }
    ],
    status: 'pending-consent',
    initiatedBy: 'rec-003',
    initiatedByName: 'Lisa Thompson',
    initiatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    consentGiven: false,
    results: [],
    totalCost: 206,
    country: 'Canada',
    region: 'British Columbia',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBackgroundChecks));
  }
}

export function getBackgroundChecks(): BackgroundCheck[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getBackgroundCheckById(id: string): BackgroundCheck | undefined {
  return getBackgroundChecks().find(bc => bc.id === id);
}

export function getBackgroundChecksByCandidate(candidateId: string): BackgroundCheck[] {
  return getBackgroundChecks().filter(bc => bc.candidateId === candidateId);
}

export function saveBackgroundCheck(check: BackgroundCheck): void {
  const checks = getBackgroundChecks();
  checks.push(check);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
}

export function updateBackgroundCheck(id: string, updates: Partial<BackgroundCheck>): void {
  const checks = getBackgroundChecks();
  const index = checks.findIndex(bc => bc.id === id);
  if (index !== -1) {
    checks[index] = { ...checks[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    
    // Import and call auto-update after storage is updated
    // This ensures status transitions happen automatically
    import('./backgroundChecks/statusUpdateService').then(({ autoUpdateCheckStatus }) => {
      autoUpdateCheckStatus(id);
    });
  }
}

export function deleteBackgroundCheck(id: string): void {
  const checks = getBackgroundChecks();
  const filtered = checks.filter(bc => bc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
