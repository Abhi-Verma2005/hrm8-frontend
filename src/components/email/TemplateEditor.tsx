import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { TemplateVariablesPanel } from './TemplateVariablesPanel';
import { TemplatePreview } from './TemplatePreview';
import { emailTemplateService, EmailTemplate, EmailTemplateType, CreateEmailTemplateRequest } from '@/lib/api/emailTemplateService';
import { extractMergeFields } from '@/lib/email/mergeFields';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';
import { AITemplateGenerator } from './AITemplateGenerator';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: EmailTemplate | null;
  jobId?: string;
  jobRoundId?: string;
  onSuccess?: () => void;
}

const TEMPLATE_TYPES: { value: EmailTemplateType; label: string }[] = [
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

export function TemplateEditor({
  open,
  onOpenChange,
  template,
  jobId,
  jobRoundId,
  onSuccess,
}: TemplateEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const subjectTextareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      type: 'CUSTOM',
      subject: '',
      body: '',
      isActive: true,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        type: template.type,
        subject: template.subject,
        body: template.body,
        isActive: template.isActive,
        isDefault: template.isDefault,
      });
    } else {
      form.reset({
        name: '',
        type: 'CUSTOM',
        subject: '',
        body: '',
        isActive: true,
        isDefault: false,
      });
    }
  }, [template, form]);

  const handleInsertVariable = (variable: string) => {
    const fieldText = `{{${variable}}}`;
    
    // Insert into subject if subject field is focused, otherwise insert into body
    const currentSubject = form.getValues('subject');
    const currentBody = form.getValues('body');
    
    // Check if subject textarea is focused
    if (document.activeElement === subjectTextareaRef.current) {
      const subjectValue = currentSubject;
      const cursorPos = subjectTextareaRef.current.selectionStart || subjectValue.length;
      const newSubject = subjectValue.slice(0, cursorPos) + fieldText + subjectValue.slice(cursorPos);
      form.setValue('subject', newSubject);
      
      // Restore cursor position
      setTimeout(() => {
        if (subjectTextareaRef.current) {
          const newPos = cursorPos + fieldText.length;
          subjectTextareaRef.current.setSelectionRange(newPos, newPos);
          subjectTextareaRef.current.focus();
        }
      }, 0);
    } else {
      // Insert into body (this would need RichTextEditor support, simplified for now)
      form.setValue('body', currentBody + fieldText);
    }
  };

  const handleAIGenerate = async (generated: { subject: string; body: string; suggestedVariables: string[] }) => {
    form.setValue('subject', generated.subject);
    form.setValue('body', generated.body);
    setShowAIGenerator(false);
    toast.success('Template generated successfully');
  };

  const onSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);
    try {
      const variables = extractMergeFields(data.subject + data.body);
      
      if (template) {
        await emailTemplateService.updateTemplate(template.id, {
          name: data.name,
          subject: data.subject,
          body: data.body,
          variables,
          isActive: data.isActive,
          isDefault: data.isDefault,
        });
        toast.success('Template updated successfully');
      } else {
        const createData: CreateEmailTemplateRequest = {
          jobId: jobId || null,
          jobRoundId: jobRoundId || null,
          name: data.name,
          type: data.type as EmailTemplateType,
          subject: data.subject,
          body: data.body,
          variables,
          isActive: data.isActive,
          isDefault: data.isDefault,
          isAiGenerated: false,
        };
        await emailTemplateService.createTemplate(createData);
        toast.success('Template created successfully');
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{template ? 'Edit Template' : 'Create Email Template'}</DialogTitle>
            <DialogDescription>
              Create or edit an email template with merge fields for dynamic content
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="flex-1 flex flex-col min-h-0 mt-4">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Template Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Interview Invitation" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Template Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TEMPLATE_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {!template && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAIGenerator(true)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate with AI
                          </Button>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                ref={subjectTextareaRef}
                                placeholder="e.g., Interview Invitation - {{jobTitle}}"
                                rows={2}
                              />
                            </FormControl>
                            <FormDescription>
                              Use {'{'}{'{'} variableName {'}'}{'}'}  for merge fields
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Email Body</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  content={field.value}
                                  onChange={field.onChange}
                                  placeholder="Enter email body..."
                                />
                              </FormControl>
                              <FormDescription>
                                Use {'{'}{'{'} variableName {'}'}{'}'}  syntax for merge fields
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <TemplateVariablesPanel
                          onInsertVariable={handleInsertVariable}
                          className="h-[400px]"
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                                <FormDescription>
                                  Only active templates can be used
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isDefault"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Set as Default</FormLabel>
                                <FormDescription>
                                  Use as default template for this type
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 mt-4">
                  <TemplatePreview
                    subject={form.watch('subject')}
                    body={form.watch('body')}
                    className="flex-1"
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {template ? 'Update Template' : 'Create Template'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {!template && (
        <AITemplateGenerator
          open={showAIGenerator}
          onOpenChange={setShowAIGenerator}
          jobId={jobId}
          jobRoundId={jobRoundId}
          onGenerate={handleAIGenerate}
        />
      )}
    </>
  );
}

