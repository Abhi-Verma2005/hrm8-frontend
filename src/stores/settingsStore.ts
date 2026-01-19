/**
 * Settings Store
 * Manages application settings with caching using Zustand
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface JobAssignmentSettings {
  autoAssignment: boolean;
  roundRobinEnabled: boolean;
  maxJobsPerConsultant: number;
  priorityRules: string[];
}

interface CompanySettings {
  defaultCurrency: string;
  defaultTimezone: string;
  workweekStart: number;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

interface SettingsState {
  // State
  jobAssignmentSettings: JobAssignmentSettings | null;
  companySettings: CompanySettings | null;
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  setJobAssignmentSettings: (settings: JobAssignmentSettings) => void;
  setCompanySettings: (settings: CompanySettings) => void;
  updateJobAssignmentSettings: (updates: Partial<JobAssignmentSettings>) => void;
  updateCompanySettings: (updates: Partial<CompanySettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSettings: () => void;
  refresh: () => void;
}

// Cache duration: 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        jobAssignmentSettings: null,
        companySettings: null,
        isLoading: false,
        lastFetched: null,
        error: null,

        // Set job assignment settings
        setJobAssignmentSettings: (settings) => {
          set({
            jobAssignmentSettings: settings,
            lastFetched: Date.now(),
            isLoading: false,
          });
        },

        // Set company settings
        setCompanySettings: (settings) => {
          set({
            companySettings: settings,
            lastFetched: Date.now(),
            isLoading: false,
          });
        },

        // Update job assignment settings
        updateJobAssignmentSettings: (updates) => {
          set((state) => ({
            jobAssignmentSettings: state.jobAssignmentSettings
              ? { ...state.jobAssignmentSettings, ...updates }
              : null,
          }));
        },

        // Update company settings
        updateCompanySettings: (updates) => {
          set((state) => ({
            companySettings: state.companySettings
              ? { ...state.companySettings, ...updates }
              : null,
          }));
        },

        // Set loading state
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        // Set error state
        setError: (error) => {
          set({ error, isLoading: false });
        },

        // Clear all settings
        clearSettings: () => {
          set({
            jobAssignmentSettings: null,
            companySettings: null,
            lastFetched: null,
            error: null,
          });
        },

        // Force refresh (invalidate cache)
        refresh: () => {
          set({ lastFetched: null });
        },
      }),
      {
        name: "hrm8-settings-storage",
        partialize: (state) => ({
          jobAssignmentSettings: state.jobAssignmentSettings,
          companySettings: state.companySettings,
          lastFetched: state.lastFetched,
        }),
      }
    ),
    { name: "settingsStore" }
  )
);

// Selectors
export const selectJobAssignmentSettings = (state: SettingsState) =>
  state.jobAssignmentSettings;
export const selectCompanySettings = (state: SettingsState) =>
  state.companySettings;
export const selectIsLoading = (state: SettingsState) => state.isLoading;
export const selectSettingsError = (state: SettingsState) => state.error;

// Check if cache is valid
export const isSettingsCacheValid = (state: SettingsState) => {
  if (!state.lastFetched) return false;
  return Date.now() - state.lastFetched < CACHE_DURATION;
};
