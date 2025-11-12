import type { BackgroundCheck } from '@/types/backgroundCheck';

const STORAGE_KEY = 'hrm8_background_checks';

const mockBackgroundChecks: BackgroundCheck[] = [];

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
