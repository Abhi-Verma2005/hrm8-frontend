import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getEmployerDocuments, deleteDocument } from "@/lib/employerDocumentStorage";
import { EmployerDocument, DocumentType } from "@/types/employerCRM";
import { DocumentCard } from "./DocumentCard";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentsTabProps {
  employerId: string;
}

export function DocumentsTab({ employerId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<EmployerDocument[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EmployerDocument | null>(null);
  const [editingDocument, setEditingDocument] = useState<EmployerDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [employerId, selectedType]);

  const loadDocuments = () => {
    const allDocs = getEmployerDocuments(employerId);
    if (selectedType === 'all') {
      setDocuments(allDocs);
    } else {
      setDocuments(allDocs.filter(d => d.type === selectedType));
    }
  };

  const handleDocumentAdded = (document: EmployerDocument) => {
    loadDocuments();
    setEditingDocument(null);
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;

    const success = deleteDocument(selectedDocument.id, employerId);
    if (success) {
      loadDocuments();
      toast({ title: "Document deleted successfully" });
    } else {
      toast({
        title: "Failed to delete document",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const getDocumentCount = (type: DocumentType | 'all'): number => {
    const allDocs = getEmployerDocuments(employerId);
    if (type === 'all') return allDocs.length;
    return allDocs.filter(d => d.type === type).length;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as DocumentType | 'all')}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({getDocumentCount('all')})
              </TabsTrigger>
              <TabsTrigger value="contract">
                Contracts ({getDocumentCount('contract')})
              </TabsTrigger>
              <TabsTrigger value="proposal">
                Proposals ({getDocumentCount('proposal')})
              </TabsTrigger>
              <TabsTrigger value="agreement">
                Agreements ({getDocumentCount('agreement')})
              </TabsTrigger>
              <TabsTrigger value="invoice">
                Invoices ({getDocumentCount('invoice')})
              </TabsTrigger>
              <TabsTrigger value="msa">
                MSAs ({getDocumentCount('msa')})
              </TabsTrigger>
              <TabsTrigger value="other">
                Other ({getDocumentCount('other')})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType}>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No {selectedType === 'all' ? '' : selectedType} documents yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map(document => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onView={() => {
                        setSelectedDocument(document);
                        setPreviewDialogOpen(true);
                      }}
                      onEdit={() => {
                        setEditingDocument(document);
                        setUploadDialogOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedDocument(document);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) setEditingDocument(null);
        }}
        employerId={employerId}
        onDocumentAdded={handleDocumentAdded}
        editingDocument={editingDocument}
      />

      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={selectedDocument}
        onEdit={() => {
          setPreviewDialogOpen(false);
          setEditingDocument(selectedDocument);
          setUploadDialogOpen(true);
        }}
        onDelete={() => {
          setPreviewDialogOpen(false);
          setDeleteDialogOpen(true);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
