import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateList } from './TemplateList';
import { TemplateEditor } from './TemplateEditor';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { emailTemplateService, EmailTemplate, EmailTemplateType } from '@/lib/api/emailTemplateService';
import { toast } from 'sonner';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TemplatePreview } from './TemplatePreview';

const TEMPLATE_TYPES: { value: EmailTemplateType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Types' },
  { value: 'APPLICATION_CONFIRMATION', label: 'Application Confirmation' },
  { value: 'INTERVIEW_INVITATION', label: 'Interview Invitation' },
  { value: 'REJECTION', label: 'Rejection' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
  { value: 'STAGE_CHANGE', label: 'Stage Change' },
  { value: 'REMINDER', label: 'Reminder' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'CUSTOM', label: 'Custom' },
];

interface JobTemplateManagerTabProps {
  jobId: string;
}

export function JobTemplateManagerTab({ jobId }: JobTemplateManagerTabProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EmailTemplateType | 'ALL'>('ALL');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [jobId]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedType]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Filter by jobId to show only job-specific templates
      const data = await emailTemplateService.getTemplates({ jobId });
      setTemplates(data);
    } catch (error: any) {
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.body.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleDelete = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.deleteTemplate(template.id);
      toast.success('Template deleted successfully');
      loadTemplates();
      setDeletingTemplate(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete template');
    }
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.createTemplate({
        jobId,
        name: `${template.name} (Copy)`,
        type: template.type,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        isActive: false,
        isDefault: false,
        isAiGenerated: false,
      });
      toast.success('Template duplicated successfully');
      loadTemplates();
    } catch (error: any) {
      toast.error('Failed to duplicate template');
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
  };

  const handleSuccess = () => {
    loadTemplates();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {isLoading ? (
        <Card className="flex-1">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading templates...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 overflow-auto">
          <TemplateList
            templates={filteredTemplates}
            onEdit={handleEdit}
            onDelete={(template) => setDeletingTemplate(template)}
            onDuplicate={handleDuplicate}
            onPreview={handlePreview}
          />
        </div>
      )}

      <TemplateEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        template={editingTemplate}
        jobId={jobId}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTemplate && handleDelete(deletingTemplate)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewTemplate && (
            <TemplatePreview
              subject={previewTemplate.subject}
              body={previewTemplate.body}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

