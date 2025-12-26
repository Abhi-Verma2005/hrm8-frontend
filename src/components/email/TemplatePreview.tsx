import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail } from 'lucide-react';
import { extractMergeFields } from '@/lib/email/mergeFields';

interface TemplatePreviewProps {
  subject: string;
  body: string;
  className?: string;
}

export function TemplatePreview({ subject, body, className }: TemplatePreviewProps) {
  const mergeFields = extractMergeFields(subject + body);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the email will appear to candidates</CardDescription>
          </div>
          <Badge variant="outline" className="gap-2">
            <Mail className="h-3 w-3" />
            Email Preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Subject:</div>
          <div className="p-3 bg-muted rounded-md border text-sm font-semibold">
            {subject || <span className="text-muted-foreground italic">No subject</span>}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Body:</div>
          <ScrollArea className="h-[400px] border rounded-md p-4 bg-background">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: body || '<p class="text-muted-foreground italic">No content</p>' }}
            />
          </ScrollArea>
        </div>

        {mergeFields.length > 0 && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Merge Fields Used:
            </div>
            <div className="flex flex-wrap gap-2">
              {mergeFields.map((field) => (
                <Badge key={field} variant="secondary" className="font-mono text-xs">
                  {`{{${field}}}`}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

