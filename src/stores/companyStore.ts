/**
 * Company Store
 * Manages company profile state with caching using Zustand
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { companyProfileService } from "@/lib/companyProfileService";
import type {
  CompanyProfileDTO,
  CompanyProfileSectionKey,
  CompanyProfileProgressResponse,
} from "@/types/companyProfile";

interface CompanyState {
  // State
  profile: CompanyProfileDTO | null;
  requiredSections: CompanyProfileSectionKey[];
  optionalSections: CompanyProfileSectionKey[];
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  fetchProfile: (companyId: string, forceRefresh?: boolean) => Promise<void>;
  refresh: (companyId: string) => Promise<void>;
  updateSection: (
    companyId: string,
    section: CompanyProfileSectionKey,
    data: Record<string, unknown>,
    markComplete?: boolean
  ) => Promise<boolean>;
  completeProfile: (companyId: string) => Promise<boolean>;
  clearProfile: () => void;
  setError: (error: string | null) => void;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useCompanyStore = create<CompanyState>()(
  devtools(
    (set, get) => ({
      // Initial state
      profile: null,
      requiredSections: [],
      optionalSections: [],
      isLoading: false,
      lastFetched: null,
      error: null,

      // Fetch profile with caching
      fetchProfile: async (companyId: string, forceRefresh = false) => {
        const state = get();
        const now = Date.now();

        // Check cache validity
        if (
          !forceRefresh &&
          state.lastFetched &&
          now - state.lastFetched < CACHE_DURATION &&
          state.profile
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await companyProfileService.getProfile(companyId);
          if (response.success && response.data) {
            const data: CompanyProfileProgressResponse = response.data;
            set({
              profile: data.profile,
              requiredSections: data.requiredSections,
              optionalSections: data.optionalSections,
              lastFetched: now,
              isLoading: false,
            });
          } else {
            set({
              error: response.error || "Failed to fetch profile",
              isLoading: false,
            });
          }
        } catch {
          set({
            error: "Failed to fetch company profile",
            isLoading: false,
          });
        }
      },

      // Manual refresh (bypasses cache)
      refresh: async (companyId: string) => {
        await get().fetchProfile(companyId, true);
      },

      // Update a profile section
      updateSection: async (
        companyId: string,
        section: CompanyProfileSectionKey,
        data: Record<string, unknown>,
        markComplete?: boolean
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await companyProfileService.saveSection(
            companyId,
            section,
            data,
            markComplete
          );

          if (response.success && response.data) {
            set({
              profile: response.data.profile,
              lastFetched: Date.now(),
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.error || "Failed to update section",
              isLoading: false,
            });
            return false;
          }
        } catch {
          set({
            error: "Failed to update company profile section",
            isLoading: false,
          });
          return false;
        }
      },

      // Complete the profile
      completeProfile: async (companyId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await companyProfileService.completeProfile(companyId);

          if (response.success && response.data) {
            set({
              profile: response.data.profile,
              lastFetched: Date.now(),
              isLoading: false,
            });
            return true;
          } else {
            set({
              error: response.error || "Failed to complete profile",
              isLoading: false,
            });
            return false;
          }
        } catch {
          set({
            error: "Failed to complete company profile",
            isLoading: false,
          });
          return false;
        }
      },

      // Clear profile state
      clearProfile: () => {
        set({
          profile: null,
          requiredSections: [],
          optionalSections: [],
          lastFetched: null,
          error: null,
        });
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },
    }),
    { name: "companyStore" }
  )
);

// Selectors
export const selectProfile = (state: CompanyState) => state.profile;
export const selectRequiredSections = (state: CompanyState) => state.requiredSections;
export const selectOptionalSections = (state: CompanyState) => state.optionalSections;
export const selectIsLoading = (state: CompanyState) => state.isLoading;
export const selectCompletionPercentage = (state: CompanyState) =>
  state.profile?.completionPercentage ?? 0;
export const selectCompanyError = (state: CompanyState) => state.error;
