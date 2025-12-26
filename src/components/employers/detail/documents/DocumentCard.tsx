import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployerDocument } from "@/types/employerCRM";
import { DocumentTypeBadge } from "./DocumentTypeBadge";
import { FileText, Eye, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DocumentCardProps {
  document: EmployerDocument;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentCard({ document, onView, onEdit, onDelete }: DocumentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <DocumentTypeBadge type={document.type} />
        </div>
        
        <div>
          <h4 className="font-medium truncate" title={document.name}>
            {document.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {document.fileName}
          </p>
        </div>
        
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{formatFileSize(document.fileSize)}</p>
          <p>
            Uploaded {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
          </p>
          <p>by {document.uploadedByName}</p>
        </div>
        
        <div className="flex gap-2 border-t pt-3">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
