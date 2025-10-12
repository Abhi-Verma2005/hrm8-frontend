import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PositionDescriptionUploadProps {
  form: UseFormReturn<JobFormData>;
  onFileProcessed?: (extractedText: string) => void;
}

export function PositionDescriptionUpload({ form, onFileProcessed }: PositionDescriptionUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewText, setPreviewText] = useState<string>("");

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // Simulate document parsing - in real implementation, use document--parse_document
      // For now, we'll just read text files directly and simulate for others
      const text = await readFileAsText(file);
      
      // Store the extracted text
      form.setValue("positionDescriptionFile", file);
      form.setValue("positionDescriptionText", text);
      setUploadedFile(file);
      setPreviewText(text.slice(0, 200));
      
      if (onFileProcessed) {
        onFileProcessed(text);
      }

      toast({
        title: "Document Uploaded",
        description: "Position description ready for AI processing.",
      });
    } catch (error) {
      toast({
        title: "Error Processing File",
        description: "Failed to read the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      processFile(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewText("");
    form.setValue("positionDescriptionFile", null);
    form.setValue("positionDescriptionText", undefined);
    
    toast({
      title: "File Removed",
      description: "Position description cleared.",
    });
  };

  return (
    <FormItem>
      <FormLabel>Position Description (Optional)</FormLabel>
      
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 bg-secondary/20 hover:bg-secondary/30",
            isDragging ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-primary/40",
            isProcessing && "opacity-50 pointer-events-none"
          )}
        >
          <input
            type="file"
            id="pd-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            
            <div>
              <p className="font-medium">
                {isProcessing ? "Processing document..." : "Drag & drop or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, Word, or text document
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-secondary/5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {previewText && (
                <div className="mt-3 p-3 bg-background border rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
                  <p className="text-sm line-clamp-3">{previewText}...</p>
                </div>
              )}
              
              <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ready for AI processing</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <FormDescription>
        Upload a position description for AI to extract job details automatically
      </FormDescription>
    </FormItem>
  );
}
