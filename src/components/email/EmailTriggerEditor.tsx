import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { emailTriggerService, EmailTrigger, TriggerType, CreateEmailTriggerRequest } from '@/lib/api/emailTriggerService';
import { EmailTemplate } from '@/lib/api/emailTemplateService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const triggerSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  triggerType: z.string().min(1, 'Trigger type is required'),
  delayDays: z.number().min(0).default(0),
  delayHours: z.number().min(0).default(0),
  scheduledTime: z.string().optional(),
  isActive: z.boolean().default(true),
});

type TriggerFormData = z.infer<typeof triggerSchema>;

interface EmailTriggerEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundId: string;
  trigger?: EmailTrigger | null;
  templates: EmailTemplate[];
  onSuccess?: () => void;
}

const TRIGGER_TYPES: { value: TriggerType; label: string; description: string }[] = [
  { value: 'STAGE_CHANGE', label: 'Stage Change', description: 'Trigger when application stage changes' },
  { value: 'SCHEDULED_DATE', label: 'Scheduled Date', description: 'Trigger on a specific date/time' },
  { value: 'APPLICATION_SUBMITTED', label: 'Application Submitted', description: 'Trigger when application is submitted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', description: 'Trigger when interview is scheduled' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended', description: 'Trigger when offer is extended' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted', description: 'Trigger when offer is accepted' },
  { value: 'OFFER_DECLINED', label: 'Offer Declined', description: 'Trigger when offer is declined' },
];

export function EmailTriggerEditor({
  open,
  onOpenChange,
  roundId,
  trigger,
  templates,
  onSuccess,
}: EmailTriggerEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TriggerFormData>({
    resolver: zodResolver(triggerSchema),
    defaultValues: {
      templateId: '',
      triggerType: 'STAGE_CHANGE',
      delayDays: 0,
      delayHours: 0,
      scheduledTime: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (trigger) {
      form.reset({
        templateId: trigger.templateId,
        triggerType: trigger.triggerType,
        delayDays: trigger.delayDays,
        delayHours: trigger.delayHours,
        scheduledTime: trigger.scheduledTime || '',
        isActive: trigger.isActive,
      });
    } else {
      form.reset({
        templateId: '',
        triggerType: 'STAGE_CHANGE',
        delayDays: 0,
        delayHours: 0,
        scheduledTime: '',
        isActive: true,
      });
    }
  }, [trigger, form]);

  const onSubmit = async (data: TriggerFormData) => {
    setIsSubmitting(true);
    try {
      const triggerData: CreateEmailTriggerRequest = {
        templateId: data.templateId,
        triggerType: data.triggerType as TriggerType,
        delayDays: data.delayDays,
        delayHours: data.delayHours,
        scheduledTime: data.scheduledTime || undefined,
        isActive: data.isActive,
      };

      if (trigger) {
        await emailTriggerService.updateTrigger(trigger.id, triggerData);
        toast.success('Trigger updated successfully');
      } else {
        await emailTriggerService.createTrigger(roundId, triggerData);
        toast.success('Trigger created successfully');
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save trigger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTriggerType = form.watch('triggerType');
  const selectedTriggerTypeConfig = TRIGGER_TYPES.find(t => t.value === selectedTriggerType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{trigger ? 'Edit Email Trigger' : 'Create Email Trigger'}</DialogTitle>
          <DialogDescription>
            Configure when and how emails should be sent automatically
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No templates available. Create a template first.
                        </SelectItem>
                      ) : (
                        templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the email template to send
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRIGGER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTriggerTypeConfig && (
                    <FormDescription>
                      {selectedTriggerTypeConfig.description}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTriggerType === 'SCHEDULED_DATE' && (
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date and time to send the email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="delayDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Days to wait before sending
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delayHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay (Hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Hours to wait before sending
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Only active triggers will send emails
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

            <DialogFooter>
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
                {trigger ? 'Update Trigger' : 'Create Trigger'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

