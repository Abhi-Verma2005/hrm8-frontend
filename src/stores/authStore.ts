/**
 * Auth Store
 * Manages employer/company authentication state using Zustand
 */

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { authService, User } from "@/lib/authService";
import { CompanyProfileSummary } from "@/types/companyProfile";

interface AuthState {
  // State
  user: User | null;
  profileSummary: CompanyProfileSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  fetchCurrentUser: (forceRefresh?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfileSummary: (summary: CompanyProfileSummary | null) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profileSummary: null,
        isAuthenticated: false,
        isLoading: false,
        lastFetched: null,
        error: null,

        // Fetch current user from API with caching
        fetchCurrentUser: async (forceRefresh = false) => {
          const state = get();
          const now = Date.now();

          // Check cache validity (skip if forceRefresh)
          if (
            !forceRefresh &&
            state.lastFetched &&
            now - state.lastFetched < CACHE_DURATION &&
            state.user
          ) {
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
              set({
                user: response.data.user,
                profileSummary: response.data.profile,
                isAuthenticated: true,
                lastFetched: now,
                isLoading: false,
              });
            } else {
              set({
                user: null,
                profileSummary: null,
                isAuthenticated: false,
                lastFetched: null,
                isLoading: false,
              });
            }
          } catch {
            set({
              user: null,
              profileSummary: null,
              isAuthenticated: false,
              lastFetched: null,
              isLoading: false,
              error: "Failed to fetch user",
            });
          }
        },

        // Convenience method for manual refresh (bypasses cache)
        refresh: async () => {
          await get().fetchCurrentUser(true);
        },

        // Set user directly (useful after login)
        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
            lastFetched: user ? Date.now() : null,
          });
        },

        // Set profile summary directly
        setProfileSummary: (summary) => {
          set({ profileSummary: summary });
        },

        // Clear all auth state (used on logout)
        clearAuth: () => {
          set({
            user: null,
            profileSummary: null,
            isAuthenticated: false,
            lastFetched: null,
            error: null,
          });
        },

        // Set error state
        setError: (error) => {
          set({ error });
        },
      }),
      {
        name: "hrm8-auth-storage",
        partialize: (state) => ({
          // Only persist user and profileSummary, not loading states
          user: state.user,
          profileSummary: state.profileSummary,
          isAuthenticated: state.isAuthenticated,
          lastFetched: state.lastFetched,
        }),
      }
    ),
    { name: "authStore" }
  )
);

// Selectors for optimized component updates
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectProfileSummary = (state: AuthState) => state.profileSummary;
export const selectError = (state: AuthState) => state.error;
