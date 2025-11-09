import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { submitDocument, reviewDocument } from '@/lib/onboardingStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { OnboardingWorkflow, OnboardingDocument } from '@/types/onboarding';

interface OnboardingDocumentsProps {
  workflow: OnboardingWorkflow;
}

export function OnboardingDocuments({ workflow }: OnboardingDocumentsProps) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploadingId(documentId);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fakeUrl = `https://storage.example.com/${file.name}`;
    submitDocument(workflow.id, documentId, fakeUrl, file.name);
    
    toast({
      title: "Document Uploaded",
      description: "Document submitted for review",
    });
    
    setUploadingId(null);
    window.location.reload();
  };

  const handleReview = (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    reviewDocument(workflow.id, documentId, status, 'current-user', notes);
    
    toast({
      title: `Document ${status}`,
      description: `The document has been ${status}`,
    });
    
    window.location.reload();
  };

  const getStatusIcon = (status: OnboardingDocument['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'revision-required': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'submitted': return <FileText className="h-5 w-5 text-blue-500" />;
      default: return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const categories = Array.from(new Set(workflow.documents.map(doc => doc.category)));

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const docs = workflow.documents.filter(doc => doc.category === category);

        return (
          <Card key={category}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold capitalize">{category.replace('-', ' ')}</h3>
                <Badge variant="outline">
                  {docs.filter(d => d.status === 'approved').length} / {docs.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {docs.map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(doc.status)}
                          <span className="font-medium">{doc.name}</span>
                          {doc.isRequired && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                      <Badge variant={
                        doc.status === 'approved' ? 'default' :
                        doc.status === 'rejected' ? 'destructive' :
                        doc.status === 'submitted' ? 'secondary' :
                        'outline'
                      }>
                        {doc.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Upload Section */}
                    {doc.status === 'not-submitted' || doc.status === 'revision-required' ? (
                      <div className="space-y-3">
                        {doc.template && (
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        )}
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <input
                            type="file"
                            className="hidden"
                            id={`upload-${doc.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            }}
                            disabled={uploadingId === doc.id}
                          />
                          <label htmlFor={`upload-${doc.id}`} className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {uploadingId === doc.id ? 'Uploading...' : 'Click to upload document'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOC, DOCX up to 10MB
                            </p>
                          </label>
                        </div>
                        {doc.status === 'revision-required' && doc.reviewNotes && (
                          <div className="p-3 bg-orange-500/10 border border-orange-500/50 rounded">
                            <p className="text-sm font-medium">Revision Required:</p>
                            <p className="text-sm text-muted-foreground mt-1">{doc.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-3 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">{doc.fileName}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Upload Info */}
                        {doc.uploadedDate && (
                          <div className="text-xs text-muted-foreground">
                            Uploaded {format(new Date(doc.uploadedDate), 'MMM dd, yyyy')}
                          </div>
                        )}

                        {/* Review Info */}
                        {doc.reviewedDate && (
                          <div className="text-xs text-muted-foreground">
                            Reviewed by {doc.reviewedBy} on {format(new Date(doc.reviewedDate), 'MMM dd, yyyy')}
                            {doc.reviewNotes && (
                              <p className="mt-1 p-2 bg-muted rounded">{doc.reviewNotes}</p>
                            )}
                          </div>
                        )}

                        {/* Review Actions */}
                        {doc.status === 'submitted' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleReview(doc.id, 'approved')}
                              className="flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReview(doc.id, 'rejected', 'Please resubmit')}
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expiry Warning */}
                    {doc.expiryDate && (
                      <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/50 rounded text-xs">
                        Expires: {format(new Date(doc.expiryDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
