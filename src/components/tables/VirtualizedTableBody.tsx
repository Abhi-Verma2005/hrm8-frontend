import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Column } from './DataTable';
import { EditableCell, EditableFieldType, SelectOption } from './EditableCell';
import { cn } from '@/lib/utils';

interface VirtualizedTableBodyProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  selectable: boolean;
  selectedIds: string[];
  onRowSelect: (id: string, checked: boolean) => void;
  onRowClick?: (item: T) => void;
  inlineEditing: boolean;
  editingCell: { rowId: string; columnKey: string } | null;
  onStartEdit: (rowId: string, columnKey: string) => void;
  onSaveEdit: (rowId: string, columnKey: string, value: any) => void;
  onCancelEdit: () => void;
  estimatedRowHeight?: number;
}

export const VirtualizedTableBody = memo(function VirtualizedTableBody<T extends { id: string }>({
  data,
  columns,
  selectable,
  selectedIds,
  onRowSelect,
  onRowClick,
  inlineEditing,
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  estimatedRowHeight = 60,
}: VirtualizedTableBodyProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Initialize virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 10, // Render 10 extra rows above and below viewport
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className="relative overflow-auto"
      style={{ 
        height: '600px', // Fixed height for virtual scrolling
        contain: 'strict', // CSS containment for better performance
      }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <TableBody>
          {virtualRows.map((virtualRow) => {
            const item = data[virtualRow.index];
            const isSelected = selectedIds.includes(item.id);

            return (
              <TableRow
                key={item.id}
                data-index={virtualRow.index}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50",
                  isSelected && "bg-muted/50"
                )}
                onClick={() => onRowClick?.(item)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {selectable && (
                  <TableCell className="w-12">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onRowSelect(item.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const isEditing =
                    editingCell?.rowId === item.id &&
                    editingCell?.columnKey === column.key;

                  return (
                    <TableCell key={column.key}>
                      {column.editable && inlineEditing ? (
                        <EditableCell
                          value={item[column.key as keyof T]}
                          isEditing={isEditing}
                          fieldType={column.editFieldType as EditableFieldType}
                          selectOptions={column.editSelectOptions as SelectOption[]}
                          onStartEdit={() => onStartEdit(item.id, column.key)}
                          onSave={(value) => onSaveEdit(item.id, column.key, value)}
                          onCancel={onCancelEdit}
                        />
                      ) : column.render ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          {column.render(item)}
                        </div>
                      ) : (
                        String(item[column.key as keyof T] ?? "")
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </div>
    </div>
  );
});
