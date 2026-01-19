/**
 * Zustand Stores
 * Centralized state management exports
 */

// Auth Store
export { useAuthStore, selectUser, selectIsAuthenticated } from "./authStore";
export type { } from "./authStore";

// Company Store
export {
  useCompanyStore,
  selectProfile,
  selectRequiredSections,
  selectOptionalSections,
  selectCompletionPercentage,
} from "./companyStore";

// Jobs Store
export {
  useJobsStore,
  selectJobs,
  selectFilters,
  selectLastFetched,
  isCacheValid,
} from "./jobsStore";
export type { JobFilters } from "./jobsStore";

// Notifications Store
export {
  useNotificationsStore,
  selectNotifications,
  selectUnreadCount,
  selectStats,
  selectPreferences,
} from "./notificationsStore";

// Settings Store
export {
  useSettingsStore,
  selectJobAssignmentSettings,
  selectCompanySettings,
  isSettingsCacheValid,
} from "./settingsStore";

// Reference Data Store
export {
  useReferenceDataStore,
  selectDepartments,
  selectLocations,
  selectCategories,
  selectTags,
  selectCurrencies,
  selectCountries,
  isReferenceDataCacheValid,
} from "./referenceDataStore";
