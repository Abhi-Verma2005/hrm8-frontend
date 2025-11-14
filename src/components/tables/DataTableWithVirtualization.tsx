import { useMemo } from "react";
import { DataTable } from "./DataTable";
import { VirtualizedDataTable } from "./VirtualizedDataTable";
import type { Column } from "./DataTable";
import type { DateRangeFilter, MultiSelectFilter, FilterPreset } from "./AdvancedFilters";
import type { GroupConfig } from "./TableGrouping";
import type { PivotConfig } from "./PivotTable";

export type { Column } from "./DataTable";

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableWithVirtualizationProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  onSelectedRowsChange?: (selectedIds: string[]) => void;
  renderBulkActions?: (selectedIds: string[]) => React.ReactNode;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  statusFilter?: boolean;
  statusOptions?: FilterOption[];
  statusKey?: keyof T;
  typeFilter?: boolean;
  typeOptions?: FilterOption[];
  typeKey?: keyof T;
  emptyMessage?: string;
  exportable?: boolean;
  exportFilename?: string;
  dateRangeFilters?: DateRangeFilter[];
  dateRangeKey?: keyof T;
  multiSelectFilters?: MultiSelectFilter[];
  enableFilterPresets?: boolean;
  presetStorageKey?: string;
  columnCustomization?: boolean;
  columnPreferenceKey?: string;
  inlineEditing?: boolean;
  onRowUpdate?: (id: string, updates: Partial<T>) => void;
  grouping?: GroupConfig;
  defaultGroupsExpanded?: boolean;
  pivotMode?: boolean;
  pivotConfig?: PivotConfig;
  onPivotConfigChange?: (config: PivotConfig) => void;
  onRowClick?: (item: T) => void;
  tableId?: string;
  resizable?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  persistPageSize?: boolean;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
  estimatedRowHeight?: number;
}

export function DataTableWithVirtualization<T extends { id: string }>(
  props: DataTableWithVirtualizationProps<T>
) {
  const {
    data,
    enableVirtualization = true,
    virtualizationThreshold = 50,
    ...restProps
  } = props;

  const shouldVirtualize = useMemo(() => {
    return enableVirtualization && data.length > virtualizationThreshold;
  }, [enableVirtualization, data.length, virtualizationThreshold]);

  if (shouldVirtualize) {
    return <VirtualizedDataTable data={data} {...restProps} />;
  }

  return <DataTable data={data} {...restProps} />;
}
