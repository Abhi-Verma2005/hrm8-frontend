import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Column } from "./DataTable";
import { VirtualizedTableBody } from "./VirtualizedTableBody";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "./TablePagination";
import { DataTableExport } from "./DataTableExport";
import { AdvancedFilters, DateRangeFilter, MultiSelectFilter, FilterPreset } from "./AdvancedFilters";
import { ColumnCustomization } from "./ColumnCustomization";
import { cn } from "@/lib/utils";
import { useColumnResize } from "@/hooks/useColumnResize";
import { ResizeHandle } from "./ResizeHandle";
import { Badge } from "@/components/ui/badge";

export interface FilterOption {
  label: string;
  value: string;
}

interface VirtualizedDataTableProps<T extends { id: string }> {
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
  onRowClick?: (item: T) => void;
  tableId?: string;
  resizable?: boolean;
  estimatedRowHeight?: number;
}

/**
 * Virtualized DataTable optimized for large datasets (50+ rows)
 * Uses @tanstack/react-virtual for efficient rendering
 * Only renders visible rows + overscan buffer
 */
export function VirtualizedDataTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  onSelectedRowsChange,
  renderBulkActions,
  searchable = false,
  searchKeys = [],
  statusFilter = false,
  statusOptions = [],
  statusKey,
  typeFilter = false,
  typeOptions = [],
  typeKey,
  emptyMessage = "No data available",
  exportable = false,
  exportFilename = "export",
  dateRangeFilters: initialDateRangeFilters = [],
  dateRangeKey,
  multiSelectFilters: initialMultiSelectFilters = [],
  enableFilterPresets = false,
  presetStorageKey = "table-filter-presets",
  columnCustomization = false,
  columnPreferenceKey = "table-column-preferences",
  inlineEditing = false,
  onRowUpdate,
  onRowClick,
  tableId = "virtualized-table",
  resizable = true,
  estimatedRowHeight = 60,
}: VirtualizedDataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("all");
  const [typeFilterValue, setTypeFilterValue] = useState("all");
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null);
  
  const [dateRangeFilters, setDateRangeFilters] = useState<DateRangeFilter[]>(initialDateRangeFilters);
  const [multiSelectFilters, setMultiSelectFilters] = useState<MultiSelectFilter[]>(initialMultiSelectFilters);
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>(() => {
    if (!enableFilterPresets) return [];
    try {
      const stored = localStorage.getItem(presetStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (!columnCustomization) return columns.map(col => col.key);
    try {
      const stored = localStorage.getItem(`${columnPreferenceKey}-visible`);
      return stored ? JSON.parse(stored) : columns.map(col => col.key);
    } catch {
      return columns.map(col => col.key);
    }
  });

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (!columnCustomization) return columns.map(col => col.key);
    try {
      const stored = localStorage.getItem(`${columnPreferenceKey}-order`);
      const savedOrder = stored ? JSON.parse(stored) : null;
      if (savedOrder) {
        const allKeys = columns.map(col => col.key);
        const validOrder = savedOrder.filter((key: string) => allKeys.includes(key));
        const missingKeys = allKeys.filter(key => !validOrder.includes(key));
        return [...validOrder, ...missingKeys];
      }
      return columns.map(col => col.key);
    } catch {
      return columns.map(col => col.key);
    }
  });

  // Column resizing
  const defaultWidths = useMemo(() => {
    const widths: { [key: string]: number } = {};
    columns.forEach((col) => {
      if (col.width) {
        const match = col.width.match(/(\d+)(px|%)?/);
        if (match) {
          const value = parseInt(match[1]);
          widths[col.key] = match[2] === '%' ? (value / 100) * 1200 : value;
        }
      }
    });
    return widths;
  }, [columns]);

  const {
    columnWidths,
    getColumnWidth,
    handleResizeStart: onResizeStart,
  } = useColumnResize({
    tableId,
    defaultWidths,
    minWidth: 80,
    maxWidth: 600,
  });

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredAndSortedData.map(item => item.id);
      setSelectedIds(allIds);
      onSelectedRowsChange?.(allIds);
    } else {
      setSelectedIds([]);
      onSelectedRowsChange?.([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelectedIds);
    onSelectedRowsChange?.(newSelectedIds);
  };

  // Get display columns
  const displayColumns = useMemo(() => {
    if (!columnCustomization) return columns;
    const ordered = columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter(Boolean) as Column<T>[];
    return ordered.filter(col => visibleColumns.includes(col.key));
  }, [columns, columnOrder, visibleColumns, columnCustomization]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchable && searchValue && searchKeys.length > 0) {
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchValue.toLowerCase());
          }
          return false;
        })
      );
    }

    // Apply status filter
    if (statusFilter && statusFilterValue !== "all" && statusKey) {
      result = result.filter(item => item[statusKey] === statusFilterValue);
    }

    // Apply type filter
    if (typeFilter && typeFilterValue !== "all" && typeKey) {
      result = result.filter(item => item[typeKey] === typeFilterValue);
    }

    // Apply date range filters
    if (dateRangeKey && dateRangeFilters.length > 0) {
      dateRangeFilters.forEach(df => {
        if (df.from || df.to) {
          result = result.filter(item => {
            const itemDate = new Date(item[dateRangeKey] as any);
            if (df.from && itemDate < new Date(df.from)) return false;
            if (df.to && itemDate > new Date(df.to)) return false;
            return true;
          });
        }
      });
    }

    // Apply multi-select filters
    multiSelectFilters.forEach(msf => {
      if (msf.selected.length > 0) {
        result = result.filter(item =>
          msf.selected.includes(String(item[msf.key as keyof T]))
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [
    data,
    searchValue,
    searchKeys,
    searchable,
    statusFilterValue,
    statusFilter,
    statusKey,
    typeFilterValue,
    typeFilter,
    typeKey,
    dateRangeKey,
    dateRangeFilters,
    multiSelectFilters,
    sortConfig,
  ]);

  // Inline editing handlers
  const handleStartEdit = (rowId: string, columnKey: string) => {
    if (inlineEditing) {
      setEditingCell({ rowId, columnKey });
    }
  };

  const handleSaveEdit = (rowId: string, columnKey: string, value: any) => {
    if (onRowUpdate) {
      onRowUpdate(rowId, { [columnKey]: value } as Partial<T>);
    }
    setEditingCell(null);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Column customization handlers
  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    const newVisibleColumns = visible
      ? [...visibleColumns, columnKey]
      : visibleColumns.filter(key => key !== columnKey);
    setVisibleColumns(newVisibleColumns);
    if (columnCustomization) {
      localStorage.setItem(`${columnPreferenceKey}-visible`, JSON.stringify(newVisibleColumns));
    }
  };

  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder);
    if (columnCustomization) {
      localStorage.setItem(`${columnPreferenceKey}-order`, JSON.stringify(newOrder));
    }
  };

  const handleResetColumns = () => {
    const defaultColumns = columns.map(col => col.key);
    setVisibleColumns(defaultColumns);
    setColumnOrder(defaultColumns);
    if (columnCustomization) {
      localStorage.removeItem(`${columnPreferenceKey}-visible`);
      localStorage.removeItem(`${columnPreferenceKey}-order`);
    }
  };

  const allSelected = filteredAndSortedData.length > 0 && selectedIds.length === filteredAndSortedData.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredAndSortedData.length;

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-8"
              />
            </div>
          )}
          {statusFilter && statusOptions.length > 0 && (
            <Select value={statusFilterValue} onValueChange={setStatusFilterValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {typeFilter && typeOptions.length > 0 && (
            <Select value={typeFilterValue} onValueChange={setTypeFilterValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {columnCustomization && (
            <ColumnCustomization
              columns={columns}
              visibleColumns={visibleColumns}
              columnOrder={columnOrder}
              onVisibilityChange={handleColumnVisibilityChange}
              onOrderChange={handleColumnOrderChange}
              onReset={handleResetColumns}
            />
          )}
          {exportable && (
            <DataTableExport
              data={filteredAndSortedData}
              columns={displayColumns}
              filename={exportFilename}
            />
          )}
          <Badge variant="outline" className="text-xs">
            {filteredAndSortedData.length} rows (virtualized)
          </Badge>
        </div>
      </div>

      {/* Advanced Filters */}
      {(dateRangeFilters.length > 0 || multiSelectFilters.length > 0) && (
        <AdvancedFilters
          dateRangeFilters={dateRangeFilters}
          onDateRangeChange={(key, from, to) => {
            setDateRangeFilters(prev =>
              prev.map(df => df.key === key ? { ...df, from, to } : df)
            );
          }}
          multiSelectFilters={multiSelectFilters}
          onMultiSelectChange={(key, selected) => {
            setMultiSelectFilters(prev =>
              prev.map(mf => mf.key === key ? { ...mf, selected } : mf)
            );
          }}
        />
      )}

      {/* Bulk Actions */}
      {selectable && selectedIds.length > 0 && renderBulkActions && (
        <div className="bg-muted/50 p-3 rounded-lg">
          {renderBulkActions(selectedIds)}
        </div>
      )}

      {/* Virtualized Table */}
      {filteredAndSortedData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                      aria-label={someSelected ? "Some rows selected" : allSelected ? "All rows selected" : "No rows selected"}
                    />
                  </TableHead>
                )}
                {displayColumns.map((column, index) => (
                  <TableHead
                    key={column.key}
                    style={{ width: getColumnWidth(column.key) }}
                    className="relative"
                  >
                    <div className="flex items-center gap-2">
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="hover:bg-transparent h-auto p-0"
                        >
                          {column.label}
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowDown className="ml-2 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      ) : (
                        column.label
                      )}
                    </div>
                    {resizable && index < displayColumns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20"
                        onMouseDown={(e) => {
                          const currentWidth = getColumnWidth(column.key) || 150;
                          onResizeStart(column.key, e.clientX, currentWidth);
                        }}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
          
          <VirtualizedTableBody
            data={filteredAndSortedData}
            columns={displayColumns}
            selectable={selectable}
            selectedIds={selectedIds}
            onRowSelect={handleRowSelect}
            onRowClick={onRowClick}
            inlineEditing={inlineEditing}
            editingCell={editingCell}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            estimatedRowHeight={estimatedRowHeight}
          />
        </div>
      )}
    </div>
  );
}
