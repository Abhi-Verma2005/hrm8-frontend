/**
 * Reference Data Store
 * Manages reference data (departments, locations, categories, etc.) with long-term caching
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Department {
  id: string;
  name: string;
  code?: string;
}

interface Location {
  id: string;
  name: string;
  city?: string;
  country?: string;
  code?: string;
}

interface JobCategory {
  id: string;
  name: string;
  slug?: string;
}

interface JobTag {
  id: string;
  name: string;
  color?: string;
}

interface ReferenceDataState {
  // State
  departments: Department[];
  locations: Location[];
  categories: JobCategory[];
  tags: JobTag[];
  currencies: string[];
  countries: string[];
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  setDepartments: (departments: Department[]) => void;
  setLocations: (locations: Location[]) => void;
  setCategories: (categories: JobCategory[]) => void;
  setTags: (tags: JobTag[]) => void;
  setCurrencies: (currencies: string[]) => void;
  setCountries: (countries: string[]) => void;
  setAllReferenceData: (data: Partial<ReferenceDataState>) => void;
  addDepartment: (department: Department) => void;
  addLocation: (location: Location) => void;
  addCategory: (category: JobCategory) => void;
  addTag: (tag: JobTag) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearReferenceData: () => void;
  refresh: () => void;
}

// Cache duration: 1 hour (reference data rarely changes)
const CACHE_DURATION = 60 * 60 * 1000;

export const useReferenceDataStore = create<ReferenceDataState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        departments: [],
        locations: [],
        categories: [],
        tags: [],
        currencies: ["USD", "EUR", "GBP", "AUD", "CAD", "NZD", "SGD", "HKD"],
        countries: [],
        isLoading: false,
        lastFetched: null,
        error: null,

        // Set departments
        setDepartments: (departments) => {
          set({ departments, lastFetched: Date.now() });
        },

        // Set locations
        setLocations: (locations) => {
          set({ locations, lastFetched: Date.now() });
        },

        // Set categories
        setCategories: (categories) => {
          set({ categories, lastFetched: Date.now() });
        },

        // Set tags
        setTags: (tags) => {
          set({ tags, lastFetched: Date.now() });
        },

        // Set currencies
        setCurrencies: (currencies) => {
          set({ currencies });
        },

        // Set countries
        setCountries: (countries) => {
          set({ countries });
        },

        // Set all reference data at once
        setAllReferenceData: (data) => {
          set({
            ...data,
            lastFetched: Date.now(),
            isLoading: false,
          });
        },

        // Add a single department
        addDepartment: (department) => {
          set((state) => ({
            departments: [...state.departments, department],
          }));
        },

        // Add a single location
        addLocation: (location) => {
          set((state) => ({
            locations: [...state.locations, location],
          }));
        },

        // Add a single category
        addCategory: (category) => {
          set((state) => ({
            categories: [...state.categories, category],
          }));
        },

        // Add a single tag
        addTag: (tag) => {
          set((state) => ({
            tags: [...state.tags, tag],
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

        // Clear all reference data
        clearReferenceData: () => {
          set({
            departments: [],
            locations: [],
            categories: [],
            tags: [],
            countries: [],
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
        name: "hrm8-reference-data-storage",
        partialize: (state) => ({
          departments: state.departments,
          locations: state.locations,
          categories: state.categories,
          tags: state.tags,
          currencies: state.currencies,
          countries: state.countries,
          lastFetched: state.lastFetched,
        }),
      }
    ),
    { name: "referenceDataStore" }
  )
);

// Selectors
export const selectDepartments = (state: ReferenceDataState) => state.departments;
export const selectLocations = (state: ReferenceDataState) => state.locations;
export const selectCategories = (state: ReferenceDataState) => state.categories;
export const selectTags = (state: ReferenceDataState) => state.tags;
export const selectCurrencies = (state: ReferenceDataState) => state.currencies;
export const selectCountries = (state: ReferenceDataState) => state.countries;
export const selectIsLoading = (state: ReferenceDataState) => state.isLoading;
export const selectReferenceDataError = (state: ReferenceDataState) => state.error;

// Check if cache is valid
export const isReferenceDataCacheValid = (state: ReferenceDataState) => {
  if (!state.lastFetched) return false;
  return Date.now() - state.lastFetched < CACHE_DURATION;
};
