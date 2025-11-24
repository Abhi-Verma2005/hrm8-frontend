import { useState } from 'react';
import { Plus, FileText, Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { QuestionnaireBuilder } from '@/components/backgroundChecks/references/QuestionnaireBuilder';
import {
  getTemplates,
  deleteTemplate,
  duplicateTemplate,
} from '@/lib/backgroundChecks/questionnaireTemplateStorage';
import type { QuestionnaireTemplate } from '@/types/referee';

export default function QuestionnaireTemplates() {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>(getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const refreshTemplates = () => {
    setTemplates(getTemplates());
  };

  const handleCreate = () => {
    setSelectedTemplateId(null);
    setIsCreating(true);
  };

  const handleEdit = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsCreating(true);
  };

  const handleBack = () => {
    setIsCreating(false);
    setSelectedTemplateId(null);
    refreshTemplates();
  };

  const handleDuplicate = (template: QuestionnaireTemplate) => {
    const newName = `${template.name} (Copy)`;
    duplicateTemplate(template.id, newName);
    toast.success('Template duplicated');
    refreshTemplates();
  };

  const handleDelete = (templateId: string, templateName: string) => {
    if (confirm(`Are you sure you want to delete "${templateName}"?`)) {
      deleteTemplate(templateId);
      toast.success('Template deleted');
      refreshTemplates();
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'leadership': return 'default';
      case 'technical': return 'secondary';
      case 'sales': return 'outline';
      case 'quick': return 'outline';
      default: return 'outline';
    }
  };

  if (isCreating) {
    return (
      <div className="container mx-auto py-8">
        <QuestionnaireBuilder
          templateId={selectedTemplateId || undefined}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-base font-semibold flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reference Check Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage customizable questionnaire templates
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-semibold">{template.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              <div className="text-base font-semibold flex items-center gap-2">
                <Badge variant={getCategoryBadgeVariant(template.category)}>
                  {template.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {template.questions.length} questions
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(template.id)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {!template.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(template.id, template.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first questionnaire template to get started
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
