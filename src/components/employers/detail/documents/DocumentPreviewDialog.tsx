import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployerDocument } from "@/types/employerCRM";
import { DocumentTypeBadge } from "./DocumentTypeBadge";
import { Download, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: EmployerDocument | null;
  onEdit: () => void;
  onDelete: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentPreviewDialog({
  open,
  onOpenChange,
  document,
  onEdit,
  onDelete,
}: DocumentPreviewDialogProps) {
  if (!document) return null;

  const handleDownload = () => {
    // In a real app, this would download the file
    window.open(document.fileUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{document.name}</span>
            <DocumentTypeBadge type={document.type} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">File Name</p>
              <p className="text-sm">{document.fileName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">File Size</p>
              <p className="text-sm">{formatFileSize(document.fileSize)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Uploaded</p>
              <p className="text-sm">
                {format(new Date(document.uploadedAt), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Uploaded By</p>
              <p className="text-sm">{document.uploadedByName}</p>
            </div>
          </div>

          {document.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
              <p className="text-sm p-3 bg-muted/50 rounded-lg">{document.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Metadata
            </Button>
            <Button variant="outline" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
