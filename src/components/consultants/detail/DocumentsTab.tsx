import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, Eye } from 'lucide-react';
import { getConsultantDocuments } from '@/lib/consultantDocumentStorage';
import { format } from 'date-fns';
import type { ConsultantDocumentType } from '@/types/consultantCRM';

interface DocumentsTabProps {
  consultantId: string;
}

const getDocumentTypeBadge = (type: ConsultantDocumentType) => {
  const config = {
    contract: { label: 'Contract', className: 'bg-blue-100 text-blue-800' },
    'w9-form': { label: 'W-9', className: 'bg-purple-100 text-purple-800' },
    'i9-form': { label: 'I-9', className: 'bg-purple-100 text-purple-800' },
    certification: { label: 'Certification', className: 'bg-green-100 text-green-800' },
    resume: { label: 'Resume', className: 'bg-orange-100 text-orange-800' },
    'offer-letter': { label: 'Offer Letter', className: 'bg-blue-100 text-blue-800' },
    nda: { label: 'NDA', className: 'bg-red-100 text-red-800' },
    other: { label: 'Other', className: 'bg-gray-100 text-gray-800' },
  };
  const { label, className } = config[type];
  return <Badge variant="secondary" className={className}>{label}</Badge>;
};

export function DocumentsTab({ consultantId }: DocumentsTabProps) {
  const documents = getConsultantDocuments(consultantId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getDocumentTypeBadge(doc.type)}
                        <span className="mx-2">•</span>
                        {(doc.fileSize / 1024).toFixed(0)} KB
                        <span className="mx-2">•</span>
                        Uploaded {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
