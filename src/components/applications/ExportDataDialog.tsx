import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
  filename: string;
}

const AVAILABLE_FIELDS = [
  { id: 'name', label: 'Candidate Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'position', label: 'Position' },
  { id: 'status', label: 'Status' },
  { id: 'stage', label: 'Current Stage' },
  { id: 'appliedDate', label: 'Application Date' },
  { id: 'recruiter', label: 'Assigned Recruiter' },
  { id: 'source', label: 'Application Source' },
  { id: 'location', label: 'Location' },
  { id: 'experience', label: 'Years of Experience' },
  { id: 'notes', label: 'Notes' },
];

export function ExportDataDialog({
  open,
  onOpenChange,
  data,
  filename,
}: ExportDataDialogProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    AVAILABLE_FIELDS.slice(0, 6).map(f => f.id)
  );
  const { toast } = useToast();

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAll = () => {
    setSelectedFields(AVAILABLE_FIELDS.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to export",
        variant: "destructive",
      });
      return;
    }

    // In real implementation, this would generate and download the file
    const exportData = {
      format,
      fields: selectedFields,
      records: data.length,
      filename: `${filename}.${format === 'excel' ? 'xlsx' : format}`,
    };

    console.log('Exporting data:', exportData);

    toast({
      title: "Export started",
      description: `Exporting ${data.length} records in ${format.toUpperCase()} format`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export {data.length} record{data.length !== 1 ? 's' : ''} in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(v: any) => setFormat(v)}>
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-muted-foreground">
                        Compatible with Excel, Google Sheets
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-green-700" />
                    <div>
                      <div className="font-medium">Excel (.xlsx)</div>
                      <div className="text-xs text-muted-foreground">
                        Native Excel format with formatting
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium">PDF</div>
                      <div className="text-xs text-muted-foreground">
                        Printable document format
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Fields to Export</Label>
              <div className="flex gap-2">
                <Button variant="link" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="link" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2 border rounded-md">
              {AVAILABLE_FIELDS.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label htmlFor={field.id} className="cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedFields.length} of {AVAILABLE_FIELDS.length} fields selected
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
