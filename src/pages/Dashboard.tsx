import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { EditModeToolbar } from '@/components/dashboard/EditModeToolbar';
import { WidgetPalette } from '@/components/dashboard/WidgetPalette';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { DashboardSelector } from '@/components/dashboard/DashboardSelector';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { WIDGET_REGISTRY } from '@/lib/dashboard/widgetRegistry';
import { DASHBOARD_METADATA } from '@/lib/dashboard/dashboardTypes';
import type { WidgetType } from '@/lib/dashboard/widgetRegistry';
import type { DashboardWidget } from '@/lib/dashboard/types';
import type { DashboardType } from '@/lib/dashboard/dashboardTypes';
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRange } from "react-day-picker";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { type } = useParams<{ type: string }>();
  const dashboardType = (type || 'overview') as DashboardType;
  
  if (type && !['overview', 'jobs', 'hrms', 'financial', 'consulting'].includes(type)) {
    return <Navigate to="/dashboard/overview" replace />;
  }
  
  const dashboardMeta = DASHBOARD_METADATA[dashboardType];
  
  const {
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
    canUndo,
    canRedo
  } = useDashboardLayout(dashboardType);
  
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const { toast } = useToast();
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    
    if (isEditMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditMode, undo, redo]);
  
  const handleAddWidget = (widgetType: WidgetType) => {
    const widgetDef = WIDGET_REGISTRY[widgetType];
    const newWidget: DashboardWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetDef.category,
      component: widgetDef.component,
      title: widgetDef.name,
      gridArea: {
        x: 0,
        y: 0,
        w: widgetDef.defaultSize.w,
        h: widgetDef.defaultSize.h
      },
      props: widgetDef.defaultProps,
      isVisible: true
    };
    
    addWidget(newWidget);
    setHasUnsavedChanges(true);
    setIsPaletteOpen(false);
    
    toast({
      title: "Widget added",
      description: `${widgetDef.name} has been added to your dashboard.`,
    });
  };

  const handleSave = () => {
    saveLayout();
    setHasUnsavedChanges(false);
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been saved successfully.",
    });
  };

  const handleReset = () => {
    resetLayout();
    setHasUnsavedChanges(false);
    toast({
      title: "Layout reset",
      description: "Your dashboard has been reset to the default layout.",
    });
  };

  const handleUpdateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    updateWidget(id, updates);
    setHasUnsavedChanges(true);
  };
  
  const handleUpdateLayout = (widgets: DashboardWidget[]) => {
    updateLayout(widgets);
    setHasUnsavedChanges(true);
  };

  const handleRemoveWidget = (id: string) => {
    removeWidget(id);
    setHasUnsavedChanges(true);
    toast({
      title: "Widget removed",
      description: "The widget has been removed from your dashboard.",
    });
  };
  
  return (
    <DashboardPageLayout>
      <div className="min-h-screen bg-background">
        {/* Edit Mode Toolbar - Only shows in edit mode */}
        {isEditMode && (
          <EditModeToolbar
            hasUnsavedChanges={hasUnsavedChanges}
            showLivePreview={showLivePreview}
            onToggleLivePreview={() => setShowLivePreview(!showLivePreview)}
            onSave={handleSave}
            onReset={handleReset}
            onAddWidget={() => setIsPaletteOpen(true)}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
        
        {/* Main Dashboard Content */}
        <div className="p-6 space-y-6">
        {/* Dashboard Selector with Edit Mode Toggle */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <DashboardSelector currentDashboard={dashboardType} />
          <EditModeToggle
            isEditMode={isEditMode}
            onToggle={() => setIsEditMode(!isEditMode)}
          />
        </div>
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{dashboardMeta.name}</h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Drag widgets to reorder or click + to add new ones" 
                : dashboardMeta.description
              }
            </p>
          </div>
          
          {!isEditMode && (
            <div className="flex items-center gap-3">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select period"
                align="end"
              />
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>
        
        {/* Dashboard Grid */}
        <DashboardGrid
          layout={layout}
          isEditMode={isEditMode}
          showLivePreview={showLivePreview}
          onUpdateWidget={handleUpdateWidget}
          onUpdateLayout={handleUpdateLayout}
          onRemoveWidget={handleRemoveWidget}
        />
      </div>
      
        {/* Widget Palette Drawer */}
        <WidgetPalette
          open={isPaletteOpen}
          onOpenChange={setIsPaletteOpen}
          onAddWidget={handleAddWidget}
          dashboardType={dashboardType}
        />
      </div>
    </DashboardPageLayout>
  );
}
