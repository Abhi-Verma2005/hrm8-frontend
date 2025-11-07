import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
  Eye,
  Download,
  RotateCcw,
} from "lucide-react";
import {
  parseFile,
  generateImportPreview,
  ImportField,
  ImportPreview,
  CANDIDATE_FIELDS,
  JOB_FIELDS,
} from "@/lib/importExportService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'candidates' | 'jobs';
  existingData: any[];
  onImport: (data: any[], mapping: ImportField[], duplicateAction: 'skip' | 'update' | 'create') => Promise<void>;
}

export function ImportWizard({
  open,
  onOpenChange,
  type,
  existingData,
  onImport,
}: ImportWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<ImportField[]>(
    type === 'candidates' ? [...CANDIDATE_FIELDS] : [...JOB_FIELDS]
  );
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update' | 'create'>('skip');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    try {
      const { headers: fileHeaders, data: fileData } = await parseFile(uploadedFile);
      setFile(uploadedFile);
      setHeaders(fileHeaders);
      setData(fileData);
      setStep(2);

      toast({
        title: "File uploaded",
        description: `Loaded ${fileData.length} rows`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
    }
  };

  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    setMapping((prev) =>
      prev.map((field) =>
        field.targetField === targetField
          ? { ...field, sourceColumn }
          : field
      )
    );
  };

  const handleGeneratePreview = () => {
    const previewData = generateImportPreview(data, mapping, existingData, type);
    setPreview(previewData);
    setStep(3);
  };

  const handleImport = async () => {
    if (!preview) return;

    setIsImporting(true);
    try {
      await onImport(data, mapping, duplicateAction);
      toast({
        title: "Import completed",
        description: `Successfully imported ${preview.validRows} ${type}`,
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setHeaders([]);
    setData([]);
    setMapping(type === 'candidates' ? [...CANDIDATE_FIELDS] : [...JOB_FIELDS]);
    setPreview(null);
    setDuplicateAction('skip');
    onOpenChange(false);
  };

  const requiredMapped = mapping
    .filter((f) => f.required)
    .every((f) => f.sourceColumn);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Import {type === 'candidates' ? 'Candidates' : 'Jobs'}</DialogTitle>
          <DialogDescription>
            Step {step} of 3 - Upload and configure your import
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>Upload</span>
            <span className={step >= 2 ? "text-primary" : ""}>Map Fields</span>
            <span className={step >= 3 ? "text-primary" : ""}>Preview & Import</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload CSV or Excel File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: .csv, .xlsx, .xls
                    </p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Download Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure how to format your file? Download our template to get started.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Map Your Columns
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Match your file columns to our fields
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {mapping.map((field) => (
                        <div
                          key={field.targetField}
                          className={cn(
                            "flex items-center gap-4 p-3 border rounded-lg",
                            field.required && !field.sourceColumn && "border-orange-500"
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Label className="font-medium capitalize">
                                {field.targetField.replace(/([A-Z])/g, ' $1').trim()}
                              </Label>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {field.dataType}
                            </p>
                          </div>

                          <ArrowRight className="h-4 w-4 text-muted-foreground" />

                          <Select
                            value={field.sourceColumn}
                            onValueChange={(value) =>
                              handleMappingChange(field.targetField, value)
                            }
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-- None --</SelectItem>
                              {headers.map((header) => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && preview && (
            <div className="space-y-4 py-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{preview.totalRows}</div>
                    <p className="text-xs text-muted-foreground">Total Rows</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-600">{preview.validRows}</div>
                    <p className="text-xs text-muted-foreground">Valid</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-red-600">{preview.invalidRows}</div>
                    <p className="text-xs text-muted-foreground">Invalid</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {preview.duplicates.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Duplicates</p>
                  </CardContent>
                </Card>
              </div>

              {/* Duplicate Handling */}
              {preview.duplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Handle Duplicates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={duplicateAction} onValueChange={(v: any) => setDuplicateAction(v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="skip" id="skip" />
                        <Label htmlFor="skip">Skip duplicates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="update" id="update" />
                        <Label htmlFor="update">Update existing records</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="create" id="create" />
                        <Label htmlFor="create">Create as new records</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Errors */}
              {preview.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">
                      Validation Errors ({preview.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {preview.errors.slice(0, 20).map((error, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                            <span className="font-medium">Row {error.row}:</span> {error.error}
                          </div>
                        ))}
                        {preview.errors.length > 20 && (
                          <p className="text-sm text-muted-foreground">
                            ... and {preview.errors.length - 20} more errors
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            {step === 2 && (
              <Button onClick={handleGeneratePreview} disabled={!requiredMapped}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Import
              </Button>
            )}

            {step === 3 && preview && (
              <Button
                onClick={handleImport}
                disabled={preview.invalidRows > 0 || isImporting}
              >
                {isImporting ? (
                  "Importing..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Import {preview.validRows} Records
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
