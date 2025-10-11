import { useState, useCallback } from 'react';
import { DEFAULT_DASHBOARD_LAYOUT } from '@/lib/dashboard/defaultLayout';
import { findEmptySpace } from '@/lib/dashboard/layoutUtils';
import type { DashboardLayout, DashboardWidget } from '@/lib/dashboard/types';

export function useDashboardLayout() {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    const saved = localStorage.getItem('dashboard_layout_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt)
        };
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }
    return DEFAULT_DASHBOARD_LAYOUT;
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const updateWidget = useCallback((widgetId: string, updates: Partial<DashboardWidget>) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, ...updates } : w
      ),
      updatedAt: new Date()
    }));
  }, []);
  
  const addWidget = useCallback((widget: DashboardWidget) => {
    setLayout(prev => {
      const newWidget = {
        ...widget,
        gridArea: findEmptySpace(prev.widgets, widget.gridArea.w, widget.gridArea.h)
      };
      
      return {
        ...prev,
        widgets: [...prev.widgets, newWidget],
        updatedAt: new Date()
      };
    });
  }, []);
  
  const removeWidget = useCallback((widgetId: string) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId && !w.isLocked),
      updatedAt: new Date()
    }));
  }, []);
  
  const resetLayout = useCallback(() => {
    setLayout({
      ...DEFAULT_DASHBOARD_LAYOUT,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }, []);
  
  const saveLayout = useCallback(() => {
    localStorage.setItem('dashboard_layout_v1', JSON.stringify(layout));
  }, [layout]);
  
  return {
    layout,
    isEditMode,
    setIsEditMode,
    updateWidget,
    addWidget,
    removeWidget,
    resetLayout,
    saveLayout
  };
}
