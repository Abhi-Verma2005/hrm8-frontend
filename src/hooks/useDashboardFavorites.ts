import { useState, useEffect, useCallback } from 'react';
import type { DashboardType } from '@/lib/dashboard/dashboardTypes';

const STORAGE_KEY = 'dashboard_favorites_v1';

export function useDashboardFavorites() {
  const [favorites, setFavorites] = useState<DashboardType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load dashboard favorites:', e);
      return [];
    }
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((dashboardType: DashboardType) => {
    setFavorites(prev => {
      if (prev.includes(dashboardType)) {
        return prev.filter(d => d !== dashboardType);
      } else {
        return [...prev, dashboardType];
      }
    });
  }, []);

  const isFavorite = useCallback((dashboardType: DashboardType) => {
    return favorites.includes(dashboardType);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}
