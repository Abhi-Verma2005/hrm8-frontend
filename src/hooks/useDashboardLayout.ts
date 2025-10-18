import { useState, useCallback } from 'react';
import { DEFAULT_LAYOUTS } from '@/lib/dashboard/defaultLayouts';
import { findEmptySpace } from '@/lib/dashboard/layoutUtils';
import type { DashboardLayout, DashboardWidget } from '@/lib/dashboard/types';
import type { DashboardType } from '@/lib/dashboard/dashboardTypes';

export function useDashboardLayout(dashboardType: DashboardType = 'jobs') {
  const storageKey = `dashboard_layout_${dashboardType}_v1`;
  
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    const saved = localStorage.getItem(storageKey);
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
    return DEFAULT_LAYOUTS[dashboardType];
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [layoutHistory, setLayoutHistory] = useState<DashboardLayout[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const saveToHistory = useCallback((currentLayout: DashboardLayout) => {
    setLayoutHistory(h => [...h.slice(0, historyIndex + 1), currentLayout]);
    setHistoryIndex(i => i + 1);
  }, [historyIndex]);
  
  const updateWidget = useCallback((widgetId: string, updates: Partial<DashboardWidget>) => {
    setLayout(prev => {
      saveToHistory(prev);
      return {
        ...prev,
        widgets: prev.widgets.map(w => 
          w.id === widgetId ? { ...w, ...updates } : w
        ),
        updatedAt: new Date()
      };
    });
  }, [saveToHistory]);
  
  const updateLayout = useCallback((widgets: DashboardWidget[]) => {
    setLayout(prev => {
      saveToHistory(prev);
      return {
        ...prev,
        widgets,
        updatedAt: new Date()
      };
    });
  }, [saveToHistory]);
  
  const addWidget = useCallback((widget: DashboardWidget) => {
    setLayout(prev => {
      saveToHistory(prev);
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
  }, [saveToHistory]);
  
  const removeWidget = useCallback((widgetId: string) => {
    setLayout(prev => {
      saveToHistory(prev);
      return {
        ...prev,
        widgets: prev.widgets.filter(w => w.id !== widgetId && !w.isLocked),
        updatedAt: new Date()
      };
    });
  }, [saveToHistory]);
  
  const resetLayout = useCallback(() => {
    setLayout(prev => {
      saveToHistory(prev);
      return {
        ...DEFAULT_LAYOUTS[dashboardType],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
  }, [saveToHistory, dashboardType]);
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setLayout(layoutHistory[historyIndex - 1]);
      setHistoryIndex(i => i - 1);
    }
  }, [historyIndex, layoutHistory]);
  
  const redo = useCallback(() => {
    if (historyIndex < layoutHistory.length - 1) {
      setLayout(layoutHistory[historyIndex + 1]);
      setHistoryIndex(i => i + 1);
    }
  }, [historyIndex, layoutHistory]);
  
  const saveLayout = useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify(layout));
  }, [layout, storageKey]);
  
  return {
    layout,
    isEditMode,
    setIsEditMode,
    updateWidget,
    updateLayout,
    addWidget,
    removeWidget,
    resetLayout,
    saveLayout,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < layoutHistory.length - 1
  };
}
