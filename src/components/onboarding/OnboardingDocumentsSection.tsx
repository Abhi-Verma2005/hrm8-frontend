import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Check, X, Clock, Download } from "lucide-react";
import { getOnboardingDocuments, saveOnboardingDocument } from "@/lib/onboardingStorage";
import { OnboardingDocument } from "@/types/onboarding";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OnboardingDocumentsSectionProps {
  workflowId: string;
  onUpdate: () => void;
}

export function OnboardingDocumentsSection({ workflowId, onUpdate }: OnboardingDocumentsSectionProps) {
  const documents = getOnboardingDocuments(workflowId);
  const [uploadingDoc, setUploadingDoc] = useState<OnboardingDocument | null>(null);

  const handleUpload = (doc: OnboardingDocument, file: File) => {
    // Simulate file upload
    const fileUrl = URL.createObjectURL(file);
    
    saveOnboardingDocument({
      ...doc,
      status: 'uploaded',
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy: 'current-user',
      uploadedByName: 'Current User',
      uploadedAt: new Date().toISOString(),
    });

    toast.success(`${doc.name} uploaded successfully`);
    setUploadingDoc(null);
    onUpdate();
  };

  const handleApprove = (doc: OnboardingDocument) => {
    saveOnboardingDocument({
      ...doc,
      status: 'approved',
      reviewedBy: 'current-user',
      reviewedByName: 'Current User',
      reviewedAt: new Date().toISOString(),
    });

    toast.success(`${doc.name} approved`);
    onUpdate();
  };

  const handleReject = (doc: OnboardingDocument) => {
    saveOnboardingDocument({
      ...doc,
      status: 'rejected',
      reviewedBy: 'current-user',
      reviewedByName: 'Current User',
      reviewedAt: new Date().toISOString(),
      reviewNotes: 'Document needs revision',
    });

    toast.error(`${doc.name} rejected`);
    onUpdate();
  };

  const getStatusBadge = (status: OnboardingDocument['status']) => {
    const variants: Record<OnboardingDocument['status'], { variant: any; label: string; icon: any }> = {
      'pending': { variant: 'secondary', label: 'Pending', icon: Clock },
      'uploaded': { variant: 'default', label: 'Uploaded', icon: Upload },
      'approved': { variant: 'outline', label: 'Approved', icon: Check },
      'rejected': { variant: 'destructive', label: 'Rejected', icon: X },
    };
    return variants[status];
  };

  const requiredDocs = documents.filter(d => d.required);
  const optionalDocs = documents.filter(d => !d.required);
  const approvedCount = documents.filter(d => d.status === 'approved').length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Status</CardTitle>
            <span className="text-sm text-muted-foreground">
              {approvedCount} of {requiredDocs.length} required documents approved
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requiredDocs.map(doc => {
            const statusBadge = getStatusBadge(doc.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{doc.name}</h4>
                    <Badge variant={statusBadge.variant}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusBadge.label}
                    </Badge>
                  </div>
                  
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                  )}
                  
                  {doc.uploadedAt && (
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {doc.uploadedByName} on {format(new Date(doc.uploadedAt), 'MMM d, yyyy HH:mm')}
                    </div>
                  )}
                  
                  {doc.reviewedAt && (
                    <div className="text-xs text-muted-foreground">
                      Reviewed by {doc.reviewedByName} on {format(new Date(doc.reviewedAt), 'MMM d, yyyy HH:mm')}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {doc.status === 'pending' && (
                    <Button size="sm" onClick={() => setUploadingDoc(doc)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                  
                  {doc.status === 'uploaded' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(doc)}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(doc)}>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {doc.fileUrl && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={doc.fileUrl} download={doc.fileName}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {optionalDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optional Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optionalDocs.map(doc => {
              const statusBadge = getStatusBadge(doc.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{doc.name}</h4>
                      <Badge variant={statusBadge.variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    )}
                  </div>

                  {doc.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => setUploadingDoc(doc)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!uploadingDoc} onOpenChange={() => setUploadingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload {uploadingDoc?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && uploadingDoc) {
                    handleUpload(uploadingDoc, file);
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
