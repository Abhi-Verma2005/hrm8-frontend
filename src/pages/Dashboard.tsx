import { useState } from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { EditModeToolbar } from '@/components/dashboard/EditModeToolbar';
import { WidgetPalette } from '@/components/dashboard/WidgetPalette';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { WIDGET_REGISTRY } from '@/lib/dashboard/widgetRegistry';
import type { WidgetType } from '@/lib/dashboard/widgetRegistry';
import type { DashboardWidget } from '@/lib/dashboard/types';
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
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
  const {
    layout,
    isEditMode,
    setIsEditMode,
    updateWidget,
    addWidget,
    removeWidget,
    resetLayout,
    saveLayout
  } = useDashboardLayout();
  
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();
  
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

  const handleRemoveWidget = (id: string) => {
    removeWidget(id);
    setHasUnsavedChanges(true);
    toast({
      title: "Widget removed",
      description: "The widget has been removed from your dashboard.",
    });
  };
  
  const editModeToggle = (
    <EditModeToggle
      isEditMode={isEditMode}
      onToggle={() => setIsEditMode(!isEditMode)}
    />
  );

  return (
    <DashboardPageLayout breadcrumbActions={editModeToggle}>
      <div className="min-h-screen bg-background">
        {/* Edit Mode Toolbar - Only shows in edit mode */}
        {isEditMode && (
          <EditModeToolbar
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSave}
            onReset={handleReset}
            onAddWidget={() => setIsPaletteOpen(true)}
          />
        )}
        
        {/* Main Dashboard Content */}
        <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John</h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Drag widgets to reorder or click + to add new ones" 
                : "Here's what's happening with your recruitment today"
              }
            </p>
          </div>
          
          {!isEditMode && (
            <div className="flex items-center gap-3">
              <DateRangeFilter
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select period"
                className="w-[240px]"
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
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          )}
        </div>
        
        {/* Dashboard Grid */}
        <DashboardGrid
          layout={layout}
          isEditMode={isEditMode}
          onUpdateWidget={handleUpdateWidget}
          onRemoveWidget={handleRemoveWidget}
        />
      </div>
      
        {/* Widget Palette Drawer */}
        <WidgetPalette
          open={isPaletteOpen}
          onOpenChange={setIsPaletteOpen}
          onAddWidget={handleAddWidget}
        />
      </div>
    </DashboardPageLayout>
  );
}
