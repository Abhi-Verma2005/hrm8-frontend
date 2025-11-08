import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getOnboardingDocuments, saveOnboardingDocument } from "@/lib/onboardingStorage";
import { format } from "date-fns";
import type { OnboardingDocument, DocumentStatus } from "@/types/onboarding";

interface OnboardingDocumentsSectionProps {
  workflowId: string;
  onUpdate?: () => void;
}

export function OnboardingDocumentsSection({ workflowId, onUpdate }: OnboardingDocumentsSectionProps) {
  const { toast } = useToast();
  const documents = getOnboardingDocuments(workflowId);

  const requiredDocs = documents.filter(d => d.required);
  const optionalDocs = documents.filter(d => !d.required);
  const uploadedCount = documents.filter(d => d.status !== 'pending').length;
  const approvedCount = documents.filter(d => d.status === 'approved').length;

  const handleStatusChange = (doc: OnboardingDocument, newStatus: DocumentStatus) => {
    const updated: OnboardingDocument = {
      ...doc,
      status: newStatus,
      reviewedBy: 'current-user',
      reviewedByName: 'Current User',
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOnboardingDocument(updated);
    
    toast({
      title: "Document Updated",
      description: `${doc.name} marked as ${newStatus}`,
    });

    onUpdate?.();
  };

  const handleUpload = (doc: OnboardingDocument) => {
    const updated: OnboardingDocument = {
      ...doc,
      status: 'uploaded',
      fileUrl: 'https://example.com/document.pdf',
      fileName: `${doc.name.replace(/\s+/g, '_')}.pdf`,
      fileSize: 1024000,
      mimeType: 'application/pdf',
      uploadedBy: 'current-user',
      uploadedByName: 'Current User',
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOnboardingDocument(updated);
    
    toast({
      title: "Document Uploaded",
      description: `${doc.name} has been uploaded successfully`,
    });

    onUpdate?.();
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'uploaded': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const variants: Record<DocumentStatus, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      uploaded: { variant: 'default', label: 'Under Review' },
      approved: { variant: 'outline', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    return variants[status];
  };

  const getTypeLabel = (type: OnboardingDocument['type']) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderDocumentCard = (doc: OnboardingDocument) => {
    const statusBadge = getStatusBadge(doc.status);
    
    return (
      <Card key={doc.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(doc.status)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{doc.name}</h4>
                  {doc.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                  <Badge variant={statusBadge.variant} className="text-xs">
                    {statusBadge.label}
                  </Badge>
                </div>
                {doc.description && (
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{getTypeLabel(doc.type)}</span>
                  {doc.uploadedAt && (
                    <>
                      <span>•</span>
                      <span>Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {doc.status === 'pending' && (
                <Button size="sm" onClick={() => handleUpload(doc)}>
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              )}
              {doc.status === 'uploaded' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(doc, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStatusChange(doc, 'rejected')}
                  >
                    Reject
                  </Button>
                </>
              )}
              {doc.fileUrl && (
                <Button size="sm" variant="ghost">
                  <Eye className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Collection Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents Uploaded</span>
              <span className="font-medium">{uploadedCount}/{documents.length}</span>
            </div>
            <Progress value={(uploadedCount / documents.length) * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Required Documents Approved</span>
              <span className="font-medium">{approvedCount}/{requiredDocs.length}</span>
            </div>
            <Progress value={(approvedCount / requiredDocs.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      {requiredDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Required Documents</h3>
          <div className="space-y-2">
            {requiredDocs.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Optional Documents</h3>
          <div className="space-y-2">
            {optionalDocs.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents</h3>
            <p className="text-muted-foreground">
              No documents have been added to this workflow yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
