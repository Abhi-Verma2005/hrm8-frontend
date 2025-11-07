import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Settings2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type PivotAggregateFunction = "sum" | "avg" | "count" | "min" | "max";

export interface PivotConfig {
  rows: string[];
  columns: string[];
  values: {
    field: string;
    aggregation: PivotAggregateFunction;
    label?: string;
  }[];
}

interface PivotTableProps<T> {
  data: T[];
  availableFields: { key: string; label: string; type?: "number" | "string" | "date" }[];
  initialConfig?: PivotConfig;
  onConfigChange?: (config: PivotConfig) => void;
}

interface PivotData {
  [rowKey: string]: {
    [colKey: string]: {
      [valueKey: string]: number | number[];
    };
  };
}

function calculateAggregate(
  values: number[],
  aggregation: PivotAggregateFunction
): number {
  if (values.length === 0) return 0;

  switch (aggregation) {
    case "sum":
      return values.reduce((acc, val) => acc + val, 0);
    case "avg":
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    default:
      return 0;
  }
}

export function PivotTable<T extends Record<string, any>>({
  data,
  availableFields,
  initialConfig,
  onConfigChange,
}: PivotTableProps<T>) {
  const [config, setConfig] = useState<PivotConfig>(
    initialConfig || {
      rows: [],
      columns: [],
      values: [],
    }
  );
  const [showConfig, setShowConfig] = useState(!initialConfig);

  const updateConfig = (newConfig: PivotConfig) => {
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const addRow = (field: string) => {
    if (!config.rows.includes(field)) {
      updateConfig({ ...config, rows: [...config.rows, field] });
    }
  };

  const removeRow = (field: string) => {
    updateConfig({ ...config, rows: config.rows.filter((r) => r !== field) });
  };

  const addColumn = (field: string) => {
    if (!config.columns.includes(field)) {
      updateConfig({ ...config, columns: [...config.columns, field] });
    }
  };

  const removeColumn = (field: string) => {
    updateConfig({ ...config, columns: config.columns.filter((c) => c !== field) });
  };

  const addValue = (field: string, aggregation: PivotAggregateFunction) => {
    const fieldInfo = availableFields.find((f) => f.key === field);
    updateConfig({
      ...config,
      values: [
        ...config.values,
        {
          field,
          aggregation,
          label: `${aggregation}(${fieldInfo?.label || field})`,
        },
      ],
    });
  };

  const removeValue = (index: number) => {
    updateConfig({
      ...config,
      values: config.values.filter((_, i) => i !== index),
    });
  };

  // Calculate pivot data
  const pivotData = useMemo(() => {
    if (config.rows.length === 0 || config.values.length === 0) {
      return null;
    }

    const result: PivotData = {};
    const rowKeys = new Set<string>();
    const colKeys = new Set<string>();

    // Group data
    data.forEach((item) => {
      const rowKey = config.rows.map((r) => String(item[r] || "")).join(" | ");
      const colKey =
        config.columns.length > 0
          ? config.columns.map((c) => String(item[c] || "")).join(" | ")
          : "Total";

      rowKeys.add(rowKey);
      colKeys.add(colKey);

      if (!result[rowKey]) {
        result[rowKey] = {};
      }
      if (!result[rowKey][colKey]) {
        result[rowKey][colKey] = {};
      }

      config.values.forEach((valueConfig) => {
        const key = `${valueConfig.field}_${valueConfig.aggregation}`;
        if (!result[rowKey][colKey][key]) {
          result[rowKey][colKey][key] = [] as number[];
        }

        const value = item[valueConfig.field];
        const numValue =
          typeof value === "number"
            ? value
            : valueConfig.aggregation === "count"
            ? 1
            : parseFloat(String(value || 0));

        if (!isNaN(numValue)) {
          const currentArray = result[rowKey][colKey][key] as number[];
          currentArray.push(numValue);
        }
      });
    });

    // Calculate aggregates
    const aggregated: PivotData = {};
    Array.from(rowKeys).forEach((rowKey) => {
      aggregated[rowKey] = {};
      Array.from(colKeys).forEach((colKey) => {
        aggregated[rowKey][colKey] = {};
        config.values.forEach((valueConfig) => {
          const key = `${valueConfig.field}_${valueConfig.aggregation}`;
          const values = (result[rowKey]?.[colKey]?.[key] || []) as number[];
          aggregated[rowKey][colKey][key] = calculateAggregate(
            values,
            valueConfig.aggregation
          );
        });
      });
    });

    return {
      data: aggregated,
      rowKeys: Array.from(rowKeys).sort(),
      colKeys: Array.from(colKeys).sort(),
    };
  }, [data, config]);

  const availableRowFields = availableFields.filter(
    (f) => !config.rows.includes(f.key) && !config.columns.includes(f.key)
  );
  const availableColFields = availableFields.filter(
    (f) => !config.columns.includes(f.key) && !config.rows.includes(f.key)
  );
  const availableValueFields = availableFields.filter((f) => f.type === "number");

  return (
    <div className="space-y-4">
      {/* Configuration Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pivot Configuration</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              {showConfig ? "Hide" : "Show"} Config
            </Button>
          </div>

          {showConfig && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row Fields */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Row Fields
                </label>
                <Select onValueChange={addRow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add row field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRowFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.rows.map((field) => {
                    const fieldInfo = availableFields.find((f) => f.key === field);
                    return (
                      <Badge key={field} variant="secondary">
                        {fieldInfo?.label || field}
                        <button
                          onClick={() => removeRow(field)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Column Fields */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Column Fields
                </label>
                <Select onValueChange={addColumn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add column field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.columns.map((field) => {
                    const fieldInfo = availableFields.find((f) => f.key === field);
                    return (
                      <Badge key={field} variant="secondary">
                        {fieldInfo?.label || field}
                        <button
                          onClick={() => removeColumn(field)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Value Fields */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Value Fields
                </label>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) => {
                      const [field, agg] = value.split(":");
                      addValue(field, agg as PivotAggregateFunction);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add value..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableValueFields.map((field) => (
                        <div key={field.key}>
                          <SelectItem value={`${field.key}:sum`}>
                            Sum of {field.label}
                          </SelectItem>
                          <SelectItem value={`${field.key}:avg`}>
                            Avg of {field.label}
                          </SelectItem>
                          <SelectItem value={`${field.key}:count`}>
                            Count of {field.label}
                          </SelectItem>
                          <SelectItem value={`${field.key}:min`}>
                            Min of {field.label}
                          </SelectItem>
                          <SelectItem value={`${field.key}:max`}>
                            Max of {field.label}
                          </SelectItem>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.values.map((value, index) => (
                    <Badge key={index} variant="secondary">
                      {value.label}
                      <button
                        onClick={() => removeValue(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pivot Table */}
      {pivotData && pivotData.rowKeys.length > 0 ? (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold bg-muted sticky left-0 z-10">
                  {config.rows.map((r) => {
                    const field = availableFields.find((f) => f.key === r);
                    return field?.label || r;
                  }).join(" / ")}
                </TableHead>
                {pivotData.colKeys.map((colKey) => (
                  <TableHead
                    key={colKey}
                    colSpan={config.values.length}
                    className="text-center font-bold bg-muted"
                  >
                    {colKey}
                  </TableHead>
                ))}
              </TableRow>
              {config.values.length > 1 && (
                <TableRow>
                  <TableHead className="bg-muted/50 sticky left-0 z-10"></TableHead>
                  {pivotData.colKeys.map((colKey) =>
                    config.values.map((value, idx) => (
                      <TableHead
                        key={`${colKey}-${idx}`}
                        className="text-center bg-muted/50 text-xs"
                      >
                        {value.label}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {pivotData.rowKeys.map((rowKey) => (
                <TableRow key={rowKey}>
                  <TableCell className="font-medium sticky left-0 bg-background">
                    {rowKey}
                  </TableCell>
                  {pivotData.colKeys.map((colKey) =>
                    config.values.map((value, idx) => {
                      const key = `${value.field}_${value.aggregation}`;
                      const cellValue = Number(
                        pivotData.data[rowKey]?.[colKey]?.[key] || 0
                      );
                      return (
                        <TableCell
                          key={`${colKey}-${idx}`}
                          className="text-right"
                        >
                          {cellValue.toFixed(2)}
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              <p className="font-medium mb-2">Configure your pivot table</p>
              <p className="text-sm">
                Add at least one row field and one value field to generate the pivot
                table
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
