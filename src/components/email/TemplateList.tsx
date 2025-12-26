import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Copy, Mail, Eye, CheckCircle2 } from 'lucide-react';
import { EmailTemplate } from '@/lib/api/emailTemplateService';
import { formatDistanceToNow } from 'date-fns';

interface TemplateListProps {
  templates: EmailTemplate[];
  onEdit?: (template: EmailTemplate) => void;
  onDelete?: (template: EmailTemplate) => void;
  onDuplicate?: (template: EmailTemplate) => void;
  onPreview?: (template: EmailTemplate) => void;
}

const TYPE_LABELS: Record<string, string> = {
  APPLICATION_CONFIRMATION: 'Application Confirmation',
  INTERVIEW_INVITATION: 'Interview Invitation',
  REJECTION: 'Rejection',
  OFFER_EXTENDED: 'Offer Extended',
  OFFER_ACCEPTED: 'Offer Accepted',
  STAGE_CHANGE: 'Stage Change',
  REMINDER: 'Reminder',
  FOLLOW_UP: 'Follow-up',
  CUSTOM: 'Custom',
};

export function TemplateList({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: TemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No templates found</p>
          </CardContent>
        </Card>
      ) : (
        templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.isDefault && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                    {template.isAiGenerated && (
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="h-3 w-3" />
                        AI Generated
                      </Badge>
                    )}
                    {!template.isActive && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span>{TYPE_LABELS[template.type] || template.type}</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
                      </span>
                      {template.version > 1 && (
                        <span className="text-muted-foreground">v{template.version}</span>
                      )}
                    </div>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onPreview && (
                      <DropdownMenuItem onClick={() => onPreview(template)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDuplicate && (
                      <DropdownMenuItem onClick={() => onDuplicate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(template)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Subject:</p>
                  <p className="text-sm">{template.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.length > 0 ? (
                      template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs font-mono">
                          {`{{${variable}}}`}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No variables</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

