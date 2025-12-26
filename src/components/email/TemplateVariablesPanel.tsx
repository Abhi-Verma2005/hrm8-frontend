import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Copy, Check } from 'lucide-react';
import { getMergeFieldsByCategory, MERGE_FIELDS, TemplateVariable } from '@/lib/email/mergeFields';
import { cn } from '@/lib/utils';

interface TemplateVariablesPanelProps {
  onInsertVariable?: (variable: string) => void;
  className?: string;
}

export function TemplateVariablesPanel({ onInsertVariable, className }: TemplateVariablesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);
  const categories = getMergeFieldsByCategory();

  const filteredFields = MERGE_FIELDS.filter(field =>
    field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (variable: string) => {
    const fieldText = `{{${variable}}}`;
    navigator.clipboard.writeText(fieldText);
    setCopiedVariable(variable);
    setTimeout(() => setCopiedVariable(null), 2000);
  };

  const handleInsert = (variable: string) => {
    if (onInsertVariable) {
      onInsertVariable(variable);
    } else {
      handleCopy(variable);
    }
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Merge Fields</CardTitle>
        <CardDescription>
          Click to insert merge fields into your template
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search merge fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue={Object.keys(categories)[0]} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(categories).slice(0, 3).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {Object.entries(categories).map(([category, fields]) => {
              const categoryFields = searchQuery
                ? filteredFields.filter(f => f.category === category)
                : fields;

              if (categoryFields.length === 0) return null;

              return (
                <TabsContent key={category} value={category} className="space-y-2 mt-0">
                  {categoryFields.map((field) => (
                    <div
                      key={field.key}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleInsert(field.key)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {`{{${field.key}}}`}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {field.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            Example: {field.example}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(field.key);
                          }}
                        >
                          {copiedVariable === field.key ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              );
            })}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

