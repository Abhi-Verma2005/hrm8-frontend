import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CandidateDocument } from '@/types/entities';
import { Download, X } from 'lucide-react';
import { downloadDocument } from '@/lib/mockDocumentStorage';

interface DocumentViewerProps {
  document: CandidateDocument;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const isPDF = document.fileName.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(document.fileName);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{document.fileName}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadDocument(document)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted rounded-lg">
          {isImage ? (
            <img
              src={document.fileUrl}
              alt={document.fileName}
              className="w-full h-full object-contain"
            />
          ) : isPDF ? (
            <iframe
              src={document.fileUrl}
              className="w-full h-full"
              title={document.fileName}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <p className="text-muted-foreground mb-4">
                  Preview not available for this file type
                </p>
                <Button onClick={() => downloadDocument(document)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}