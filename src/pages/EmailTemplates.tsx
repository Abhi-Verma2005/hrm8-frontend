import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Plus, Edit, Trash2, Search, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getApplicationEmailTemplates, saveApplicationEmailTemplate, deleteApplicationEmailTemplate, ApplicationEmailTemplate } from '@/lib/applicationEmailTemplates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<ApplicationEmailTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<ApplicationEmailTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', body: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(getApplicationEmailTemplates());
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    saveApplicationEmailTemplate(formData);
    loadTemplates();
    setShowCreateDialog(false);
    setFormData({ name: '', subject: '', body: '' });
    
    toast({
      title: "Template created",
      description: "Email template has been created successfully",
    });
  };

  const handleDelete = (id: string) => {
    deleteApplicationEmailTemplate(id);
    loadTemplates();
    setShowDeleteDialog(null);
    
    toast({
      title: "Template deleted",
      description: "Email template has been deleted successfully",
    });
  };

  const openEditDialog = (template: ApplicationEmailTemplate) => {
    setEditingTemplate(template);
    setFormData({ name: template.name, subject: template.subject, body: template.body });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage reusable email templates for candidate communications
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Interview Invitation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Interview Invitation - {jobTitle}"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Body *</Label>
                <RichTextEditor
                  content={formData.body}
                  onChange={(content) => setFormData({ ...formData, body: content })}
                  placeholder="Compose your email template..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {!template.isCustom && (
                    <Badge variant="secondary" className="mt-2">Default</Badge>
                  )}
                </div>
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription className="line-clamp-2">
                {template.subject}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none line-clamp-3 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: template.body }}
              />
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openEditDialog(template)}
                disabled={!template.isCustom}
              >
                <Edit className="h-4 w-4 mr-2" />
                View
              </Button>
              {template.isCustom && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search' : 'Create your first email template'}
          </p>
        </div>
      )}

      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <p className="text-sm mt-1">{editingTemplate.subject}</p>
              </div>
              <div>
                <Label>Body</Label>
                <div 
                  className="prose prose-sm max-w-none mt-2 p-4 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: editingTemplate.body }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setEditingTemplate(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
