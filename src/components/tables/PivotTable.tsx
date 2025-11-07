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
import { X, Settings2, Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";

export type PivotAggregateFunction = "sum" | "avg" | "count" | "min" | "max";

export interface ConditionalFormatting {
  enabled: boolean;
  colorScale: "red-green" | "blue-red" | "yellow-green" | "custom";
  customColors?: {
    low: string;
    mid: string;
    high: string;
  };
  thresholds: {
    low: number;
    high: number;
  };
  autoThresholds: boolean;
}

export interface PivotConfig {
  rows: string[];
  columns: string[];
  values: {
    field: string;
    aggregation: PivotAggregateFunction;
    label?: string;
  }[];
  conditionalFormatting?: ConditionalFormatting;
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

function getColorScale(
  scale: ConditionalFormatting["colorScale"]
): { low: string; mid: string; high: string } {
  const scales = {
    "red-green": {
      low: "239 68 68", // red-500
      mid: "251 191 36", // amber-400
      high: "34 197 94", // green-500
    },
    "blue-red": {
      low: "59 130 246", // blue-500
      mid: "168 85 247", // purple-500
      high: "239 68 68", // red-500
    },
    "yellow-green": {
      low: "250 204 21", // yellow-400
      mid: "132 204 22", // lime-500
      high: "22 163 74", // green-600
    },
    custom: {
      low: "148 163 184", // slate-400
      mid: "100 116 139", // slate-500
      high: "51 65 85", // slate-700
    },
  };
  return scales[scale];
}

function getCellBackgroundColor(
  value: number,
  min: number,
  max: number,
  formatting?: ConditionalFormatting
): string | undefined {
  if (!formatting?.enabled) return undefined;

  const { low: lowThreshold, high: highThreshold } = formatting.thresholds;
  const range = max - min;
  const normalizedValue = range === 0 ? 0.5 : (value - min) / range;

  const colors =
    formatting.colorScale === "custom" && formatting.customColors
      ? formatting.customColors
      : getColorScale(formatting.colorScale);

  let opacity: number;
  let baseColor: string;

  if (formatting.autoThresholds) {
    // Use normalized value for auto thresholds
    if (normalizedValue <= 0.33) {
      opacity = normalizedValue / 0.33;
      baseColor = colors.low;
    } else if (normalizedValue <= 0.66) {
      opacity = (normalizedValue - 0.33) / 0.33;
      baseColor = colors.mid;
    } else {
      opacity = (normalizedValue - 0.66) / 0.34;
      baseColor = colors.high;
    }
  } else {
    // Use custom thresholds
    if (value <= lowThreshold) {
      opacity = lowThreshold === min ? 1 : (value - min) / (lowThreshold - min);
      baseColor = colors.low;
    } else if (value <= highThreshold) {
      opacity = (value - lowThreshold) / (highThreshold - lowThreshold);
      baseColor = colors.mid;
    } else {
      opacity = highThreshold === max ? 1 : (value - highThreshold) / (max - highThreshold);
      baseColor = colors.high;
    }
  }

  opacity = Math.max(0.15, Math.min(0.85, opacity));
  return `rgb(${baseColor} / ${opacity})`;
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
      conditionalFormatting: {
        enabled: false,
        colorScale: "red-green",
        thresholds: { low: 0, high: 100 },
        autoThresholds: true,
      },
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
    let minValue = Infinity;
    let maxValue = -Infinity;

    Array.from(rowKeys).forEach((rowKey) => {
      aggregated[rowKey] = {};
      Array.from(colKeys).forEach((colKey) => {
        aggregated[rowKey][colKey] = {};
        config.values.forEach((valueConfig) => {
          const key = `${valueConfig.field}_${valueConfig.aggregation}`;
          const values = (result[rowKey]?.[colKey]?.[key] || []) as number[];
          const aggregateValue = calculateAggregate(values, valueConfig.aggregation);
          aggregated[rowKey][colKey][key] = aggregateValue;

          // Track min/max for conditional formatting
          if (aggregateValue < minValue) minValue = aggregateValue;
          if (aggregateValue > maxValue) maxValue = aggregateValue;
        });
      });
    });

    return {
      data: aggregated,
      rowKeys: Array.from(rowKeys).sort(),
      colKeys: Array.from(colKeys).sort(),
      minValue: minValue === Infinity ? 0 : minValue,
      maxValue: maxValue === -Infinity ? 0 : maxValue,
    };
  }, [data, config]);

  const availableRowFields = availableFields.filter(
    (f) => !config.rows.includes(f.key) && !config.columns.includes(f.key)
  );
  const availableColFields = availableFields.filter(
    (f) => !config.columns.includes(f.key) && !config.rows.includes(f.key)
  );
  const availableValueFields = availableFields.filter((f) => f.type === "number");

  const exportToCSV = () => {
    if (!pivotData) return;

    const rows: string[][] = [];
    
    // Header row 1 - Column groups
    const header1 = [
      config.rows.map((r) => {
        const field = availableFields.find((f) => f.key === r);
        return field?.label || r;
      }).join(" / "),
    ];
    pivotData.colKeys.forEach((colKey) => {
      if (config.values.length > 1) {
        header1.push(colKey);
        for (let i = 1; i < config.values.length; i++) {
          header1.push("");
        }
      } else {
        header1.push(colKey);
      }
    });
    rows.push(header1);

    // Header row 2 - Value labels (if multiple values)
    if (config.values.length > 1) {
      const header2 = [""];
      pivotData.colKeys.forEach(() => {
        config.values.forEach((value) => {
          header2.push(value.label || "");
        });
      });
      rows.push(header2);
    }

    // Data rows
    pivotData.rowKeys.forEach((rowKey) => {
      const row = [rowKey];
      pivotData.colKeys.forEach((colKey) => {
        config.values.forEach((value) => {
          const key = `${value.field}_${value.aggregation}`;
          const cellValue = Number(pivotData.data[rowKey]?.[colKey]?.[key] || 0);
          row.push(cellValue.toFixed(2));
        });
      });
      rows.push(row);
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pivot-table-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)/);
    if (!match) return "FFFFFF";
    
    const [, r, g, b, a] = match;
    const opacity = parseFloat(a);
    
    // Blend with white background
    const blendedR = Math.round(parseInt(r) * opacity + 255 * (1 - opacity));
    const blendedG = Math.round(parseInt(g) * opacity + 255 * (1 - opacity));
    const blendedB = Math.round(parseInt(b) * opacity + 255 * (1 - opacity));
    
    return [blendedR, blendedG, blendedB]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  };

  const exportToExcel = () => {
    if (!pivotData) return;

    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [];

    // Header row 1 - Column groups
    const header1 = [
      config.rows.map((r) => {
        const field = availableFields.find((f) => f.key === r);
        return field?.label || r;
      }).join(" / "),
    ];
    pivotData.colKeys.forEach((colKey) => {
      header1.push(colKey);
      for (let i = 1; i < config.values.length; i++) {
        header1.push("");
      }
    });
    worksheetData.push(header1);

    // Header row 2 - Value labels (if multiple values)
    if (config.values.length > 1) {
      const header2 = [""];
      pivotData.colKeys.forEach(() => {
        config.values.forEach((value) => {
          header2.push(value.label || "");
        });
      });
      worksheetData.push(header2);
    }

    // Data rows
    pivotData.rowKeys.forEach((rowKey) => {
      const row: any[] = [rowKey];
      pivotData.colKeys.forEach((colKey) => {
        config.values.forEach((value) => {
          const key = `${value.field}_${value.aggregation}`;
          const cellValue = Number(pivotData.data[rowKey]?.[colKey]?.[key] || 0);
          row.push(parseFloat(cellValue.toFixed(2)));
        });
      });
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply formatting
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    
    // Merge cells for column headers
    const merges: XLSX.Range[] = [];
    if (config.values.length > 1) {
      let colIdx = 1;
      pivotData.colKeys.forEach(() => {
        merges.push({
          s: { r: 0, c: colIdx },
          e: { r: 0, c: colIdx + config.values.length - 1 },
        });
        colIdx += config.values.length;
      });
    }
    worksheet["!merges"] = merges;

    // Apply conditional formatting colors
    if (config.conditionalFormatting?.enabled) {
      const dataStartRow = config.values.length > 1 ? 2 : 1;
      
      pivotData.rowKeys.forEach((rowKey, rowIdx) => {
        let colIdx = 1;
        pivotData.colKeys.forEach((colKey) => {
          config.values.forEach((value) => {
            const key = `${value.field}_${value.aggregation}`;
            const cellValue = Number(pivotData.data[rowKey]?.[colKey]?.[key] || 0);
            const backgroundColor = getCellBackgroundColor(
              cellValue,
              pivotData.minValue,
              pivotData.maxValue,
              config.conditionalFormatting
            );

            const cellRef = XLSX.utils.encode_cell({ r: dataStartRow + rowIdx, c: colIdx });
            if (!worksheet[cellRef]) worksheet[cellRef] = { t: "n", v: cellValue };
            
            if (backgroundColor) {
              worksheet[cellRef].s = {
                fill: {
                  fgColor: { rgb: rgbToHex(backgroundColor) },
                },
                alignment: { horizontal: "right" },
              };
            }
            
            colIdx++;
          });
        });
      });
    }

    // Set column widths
    const colWidths = [{ wch: 20 }];
    for (let i = 0; i < pivotData.colKeys.length * config.values.length; i++) {
      colWidths.push({ wch: 12 });
    }
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Pivot Table");
    XLSX.writeFile(workbook, `pivot-table-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pivot Configuration</h3>
            <div className="flex gap-2">
              {pivotData && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    <DropdownMenuItem onClick={exportToExcel}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToCSV}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {showConfig ? "Hide" : "Show"} Config
              </Button>
            </div>
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

          {/* Conditional Formatting Section */}
          {showConfig && config.values.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Conditional Formatting</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateConfig({
                      ...config,
                      conditionalFormatting: {
                        ...config.conditionalFormatting!,
                        enabled: !config.conditionalFormatting?.enabled,
                      },
                    })
                  }
                >
                  {config.conditionalFormatting?.enabled ? "Disable" : "Enable"}
                </Button>
              </div>

              {config.conditionalFormatting?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Color Scale
                    </label>
                    <Select
                      value={config.conditionalFormatting.colorScale}
                      onValueChange={(value) =>
                        updateConfig({
                          ...config,
                          conditionalFormatting: {
                            ...config.conditionalFormatting!,
                            colorScale: value as ConditionalFormatting["colorScale"],
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="red-green">Red → Yellow → Green</SelectItem>
                        <SelectItem value="blue-red">Blue → Purple → Red</SelectItem>
                        <SelectItem value="yellow-green">Yellow → Lime → Green</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Threshold Mode
                    </label>
                    <Select
                      value={config.conditionalFormatting.autoThresholds ? "auto" : "manual"}
                      onValueChange={(value) =>
                        updateConfig({
                          ...config,
                          conditionalFormatting: {
                            ...config.conditionalFormatting!,
                            autoThresholds: value === "auto",
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Based on range)</SelectItem>
                        <SelectItem value="manual">Manual Thresholds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!config.conditionalFormatting.autoThresholds && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Low Threshold
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          value={config.conditionalFormatting.thresholds.low}
                          onChange={(e) =>
                            updateConfig({
                              ...config,
                              conditionalFormatting: {
                                ...config.conditionalFormatting!,
                                thresholds: {
                                  ...config.conditionalFormatting!.thresholds,
                                  low: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          High Threshold
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          value={config.conditionalFormatting.thresholds.high}
                          onChange={(e) =>
                            updateConfig({
                              ...config,
                              conditionalFormatting: {
                                ...config.conditionalFormatting!,
                                thresholds: {
                                  ...config.conditionalFormatting!.thresholds,
                                  high: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
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
                      const backgroundColor = getCellBackgroundColor(
                        cellValue,
                        pivotData.minValue,
                        pivotData.maxValue,
                        config.conditionalFormatting
                      );
                      return (
                        <TableCell
                          key={`${colKey}-${idx}`}
                          className="text-right"
                          style={{
                            backgroundColor,
                          }}
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
