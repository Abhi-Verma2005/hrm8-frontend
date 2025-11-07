import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableFilters, FilterOption, ActiveFilter } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { DataTableExport } from "./DataTableExport";
import { AdvancedFilters, DateRangeFilter, MultiSelectFilter, FilterPreset } from "./AdvancedFilters";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
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
  // Advanced filtering
  dateRangeFilters?: DateRangeFilter[];
  dateRangeKey?: keyof T;
  multiSelectFilters?: MultiSelectFilter[];
  enableFilterPresets?: boolean;
  presetStorageKey?: string;
}

export function DataTable<T extends { id: string }>({
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
  presetStorageKey = "table-filter-presets"
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("all");
  const [typeFilterValue, setTypeFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Advanced filtering state
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
      // Select only items on the current page
      const pageIds = paginatedData.map(item => item.id);
      const newSelectedIds = [...new Set([...selectedIds, ...pageIds])];
      setSelectedIds(newSelectedIds);
      onSelectedRowsChange?.(newSelectedIds);
    } else {
      // Deselect only items on the current page
      const pageIds = paginatedData.map(item => item.id);
      const newSelectedIds = selectedIds.filter(id => !pageIds.includes(id));
      setSelectedIds(newSelectedIds);
      onSelectedRowsChange?.(newSelectedIds);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    let newSelectedIds: string[];
    if (checked) {
      newSelectedIds = [...selectedIds, id];
    } else {
      newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
    }
    setSelectedIds(newSelectedIds);
    onSelectedRowsChange?.(newSelectedIds);
  };

  // Advanced filter handlers
  const handleDateRangeChange = (key: string, from: Date | undefined, to: Date | undefined) => {
    setDateRangeFilters(prev =>
      prev.map(df => df.key === key ? { ...df, from, to } : df)
    );
    setCurrentPage(1);
  };

  const handleMultiSelectChange = (key: string, selected: string[]) => {
    setMultiSelectFilters(prev =>
      prev.map(mf => mf.key === key ? { ...mf, selected } : mf)
    );
    setCurrentPage(1);
  };

  const handleResetAdvancedFilters = () => {
    setDateRangeFilters(initialDateRangeFilters);
    setMultiSelectFilters(initialMultiSelectFilters);
    setCurrentPage(1);
  };

  const handleSavePreset = (preset: Omit<FilterPreset, 'id' | 'savedAt'>) => {
    const newPreset: FilterPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    const newPresets = [...filterPresets, newPreset];
    setFilterPresets(newPresets);
    if (enableFilterPresets) {
      localStorage.setItem(presetStorageKey, JSON.stringify(newPresets));
    }
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setDateRangeFilters(preset.dateRanges);
    const loadedMultiSelects = multiSelectFilters.map(mf => ({
      ...mf,
      selected: preset.multiSelects[mf.key] || [],
    }));
    setMultiSelectFilters(loadedMultiSelects);
    setCurrentPage(1);
  };

  const handleDeletePreset = (presetId: string) => {
    const newPresets = filterPresets.filter(p => p.id !== presetId);
    setFilterPresets(newPresets);
    if (enableFilterPresets) {
      localStorage.setItem(presetStorageKey, JSON.stringify(newPresets));
    }
  };

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
            if (df.from && itemDate < df.from) return false;
            if (df.to && itemDate > df.to) return false;
            return true;
          });
        }
      });
    }

    // Apply multi-select filters
    multiSelectFilters.forEach(mf => {
      if (mf.selected.length > 0) {
        result = result.filter(item => {
          const itemValue = item[mf.key as keyof T];
          return mf.selected.includes(String(itemValue));
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchValue, searchKeys, statusFilterValue, typeFilterValue, sortConfig, searchable, statusFilter, typeFilter, statusKey, typeKey, dateRangeFilters, multiSelectFilters, dateRangeKey]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Active filters
  const activeFilters: ActiveFilter[] = [];
  if (searchValue) {
    activeFilters.push({ key: 'search', value: searchValue, label: `Search: "${searchValue}"` });
  }
  if (statusFilterValue !== 'all') {
    const statusLabel = statusOptions.find(opt => opt.value === statusFilterValue)?.label || statusFilterValue;
    activeFilters.push({ key: 'status', value: statusFilterValue, label: `Status: ${statusLabel}` });
  }
  if (typeFilterValue !== 'all') {
    const typeLabel = typeOptions.find(opt => opt.value === typeFilterValue)?.label || typeFilterValue;
    activeFilters.push({ key: 'type', value: typeFilterValue, label: `Type: ${typeLabel}` });
  }

  const handleClearFilter = (key: string) => {
    if (key === 'search') setSearchValue('');
    if (key === 'status') setStatusFilterValue('all');
    if (key === 'type') setTypeFilterValue('all');
  };

  const handleClearAll = () => {
    setSearchValue('');
    setStatusFilterValue('all');
    setTypeFilterValue('all');
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Export */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          {(searchable || statusFilter || typeFilter) && (
            <TableFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              statusFilter={statusFilterValue}
              onStatusFilterChange={statusFilter ? setStatusFilterValue : undefined}
              statusOptions={statusFilter ? statusOptions : undefined}
              typeFilter={typeFilterValue}
              onTypeFilterChange={typeFilter ? setTypeFilterValue : undefined}
              typeOptions={typeFilter ? typeOptions : undefined}
              activeFilters={activeFilters}
              onClearFilter={handleClearFilter}
              onClearAll={handleClearAll}
            />
          )}
        </div>
        {exportable && (
          <DataTableExport
            data={filteredAndSortedData}
            columns={columns}
            filename={exportFilename}
            selectedIds={selectedIds}
          />
        )}
      </div>

      {/* Advanced Filters */}
      {(dateRangeFilters.length > 0 || multiSelectFilters.length > 0) && (
        <AdvancedFilters
          dateRangeFilters={dateRangeFilters}
          onDateRangeChange={handleDateRangeChange}
          multiSelectFilters={multiSelectFilters}
          onMultiSelectChange={handleMultiSelectChange}
          onResetFilters={handleResetAdvancedFilters}
          presets={enableFilterPresets ? filterPresets : undefined}
          onSavePreset={enableFilterPresets ? handleSavePreset : undefined}
          onLoadPreset={enableFilterPresets ? handleLoadPreset : undefined}
          onDeletePreset={enableFilterPresets ? handleDeletePreset : undefined}
        />
      )}

      {/* Bulk Actions */}
      {selectable && selectedIds.length > 0 && renderBulkActions && (
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedIds.length} row{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          {renderBulkActions(selectedIds)}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every(item => selectedIds.includes(item.id))
                        ? true
                        : paginatedData.some(item => selectedIds.includes(item.id))
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all on this page"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="-ml-4 h-8 data-[state=open]:bg-accent"
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                        aria-label={`Select row ${item.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} style={{ width: column.width }}>
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAndSortedData.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredAndSortedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
