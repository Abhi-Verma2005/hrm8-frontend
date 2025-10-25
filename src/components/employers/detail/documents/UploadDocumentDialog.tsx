import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { createDocument, simulateFileUpload, updateDocument } from "@/lib/employerDocumentStorage";
import { EmployerDocument, DocumentType } from "@/types/employerCRM";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

const documentSchema = z.object({
  type: z.enum(['contract', 'proposal', 'agreement', 'invoice', 'msa', 'other']),
  name: z.string().min(1, "Document name is required").max(200),
  notes: z.string().max(500).optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employerId: string;
  onDocumentAdded: (document: EmployerDocument) => void;
  editingDocument?: EmployerDocument | null;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  employerId,
  onDocumentAdded,
  editingDocument,
}: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      type: editingDocument?.type || 'other',
      name: editingDocument?.name || '',
      notes: editingDocument?.notes || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(extension)) {
      toast({
        title: "Invalid file type",
        description: "Accepted formats: PDF, DOC, DOCX, XLS, XLSX",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    // Auto-fill document name from filename
    if (!editingDocument) {
      form.setValue('name', file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    if (!editingDocument && !selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      if (editingDocument) {
        // Update existing document metadata
        const updated = updateDocument(editingDocument.id, {
          type: data.type,
          name: data.name,
          notes: data.notes,
        });
        if (updated) {
          onDocumentAdded(updated);
          toast({ title: "Document updated successfully" });
        }
      } else if (selectedFile) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        // Simulate file upload
        const fileUrl = await simulateFileUpload(selectedFile);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Create document record
        const newDocument = createDocument({
          employerId,
          type: data.type,
          name: data.name,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileUrl,
          uploadedBy: 'current-user-id', // TODO: Get from auth
          uploadedByName: 'Current User', // TODO: Get from auth
          notes: data.notes,
        });

        onDocumentAdded(newDocument);
        toast({ title: "Document uploaded successfully" });
      }

      form.reset();
      setSelectedFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to save document",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingDocument ? 'Edit Document' : 'Upload Document'}
          </DialogTitle>
          <DialogDescription>
            {editingDocument
              ? 'Update document information below'
              : 'Upload a new document for this employer'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="msa">MSA</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Master Service Agreement" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!editingDocument && (
              <div className="space-y-2">
                <label className="text-sm font-medium">File Upload *</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-2">
                      Drop file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accepted: PDF, DOC, DOCX, XLS, XLSX • Max size: 10MB
                    </p>
                  </label>
                </div>
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                    <span className="text-muted-foreground">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {editingDocument ? 'Update Document' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FileText({ className }: { className?: string }) {
  return <span className={className}>📄</span>;
}
