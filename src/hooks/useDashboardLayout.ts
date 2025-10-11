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
        ...DEFAULT_DASHBOARD_LAYOUT,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
  }, [saveToHistory]);
  
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
    localStorage.setItem('dashboard_layout_v1', JSON.stringify(layout));
  }, [layout]);
  
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
