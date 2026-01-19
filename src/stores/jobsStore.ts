/**
 * Jobs Store
 * Manages jobs state with filtering, caching, and CRUD operations using Zustand
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Job } from "@/types/job";

export interface JobFilters {
  status?: Job["status"] | "all";
  employmentType?: Job["employmentType"] | "all";
  department?: string;
  location?: string;
  search?: string;
  serviceType?: Job["serviceType"] | "all";
}

interface JobsState {
  // State
  jobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  clearFilters: () => void;
  refresh: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearJobs: () => void;

  // Computed selectors
  getFilteredJobs: () => Job[];
  getActiveJobs: () => Job[];
  getTotalApplicants: () => number;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const defaultFilters: JobFilters = {
  status: "all",
  employmentType: "all",
  serviceType: "all",
  department: undefined,
  location: undefined,
  search: undefined,
};

export const useJobsStore = create<JobsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      jobs: [],
      filters: defaultFilters,
      isLoading: false,
      lastFetched: null,
      error: null,

      // Set jobs (from API response)
      setJobs: (jobs) => {
        set({
          jobs,
          lastFetched: Date.now(),
          isLoading: false,
          error: null,
        });
      },

      // Add a new job (optimistic update)
      addJob: (job) => {
        set((state) => ({
          jobs: [job, ...state.jobs],
        }));
      },

      // Update an existing job
      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        }));
      },

      // Remove a job
      removeJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },

      // Set filters (auto-invalidates cache by resetting lastFetched)
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          // Don't reset lastFetched - filtering is client-side
        }));
      },

      // Clear all filters
      clearFilters: () => {
        set({ filters: defaultFilters });
      },

      // Force refresh (invalidate cache)
      refresh: () => {
        set({ lastFetched: null });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Clear all jobs
      clearJobs: () => {
        set({
          jobs: [],
          lastFetched: null,
          error: null,
        });
      },

      // Get filtered jobs based on current filters
      getFilteredJobs: () => {
        const { jobs, filters } = get();

        return jobs.filter((job) => {
          // Status filter
          if (filters.status && filters.status !== "all") {
            if (job.status !== filters.status) return false;
          }

          // Employment type filter
          if (filters.employmentType && filters.employmentType !== "all") {
            if (job.employmentType !== filters.employmentType) return false;
          }

          // Service type filter
          if (filters.serviceType && filters.serviceType !== "all") {
            if (job.serviceType !== filters.serviceType) return false;
          }

          // Department filter
          if (filters.department) {
            if (job.department.toLowerCase() !== filters.department.toLowerCase())
              return false;
          }

          // Location filter
          if (filters.location) {
            if (!job.location.toLowerCase().includes(filters.location.toLowerCase()))
              return false;
          }

          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesTitle = job.title.toLowerCase().includes(searchLower);
            const matchesDescription = job.description
              .toLowerCase()
              .includes(searchLower);
            const matchesDepartment = job.department
              .toLowerCase()
              .includes(searchLower);
            const matchesLocation = job.location
              .toLowerCase()
              .includes(searchLower);

            if (
              !matchesTitle &&
              !matchesDescription &&
              !matchesDepartment &&
              !matchesLocation
            ) {
              return false;
            }
          }

          return true;
        });
      },

      // Get only active/open jobs
      getActiveJobs: () => {
        const { jobs } = get();
        return jobs.filter((job) => job.status === "open");
      },

      // Get total applicants across all jobs
      getTotalApplicants: () => {
        const { jobs } = get();
        return jobs.reduce((total, job) => total + (job.applicantsCount || 0), 0);
      },
    }),
    { name: "jobsStore" }
  )
);

// Selectors
export const selectJobs = (state: JobsState) => state.jobs;
export const selectFilters = (state: JobsState) => state.filters;
export const selectIsLoading = (state: JobsState) => state.isLoading;
export const selectLastFetched = (state: JobsState) => state.lastFetched;
export const selectJobsError = (state: JobsState) => state.error;

// Check if cache is valid
export const isCacheValid = (state: JobsState) => {
  if (!state.lastFetched) return false;
  return Date.now() - state.lastFetched < CACHE_DURATION;
};
