import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { ConsultantNote } from '@/types/consultantCRM';
import { addConsultantNote, updateConsultantNote } from '@/lib/consultantCRMStorage';

const noteSchema = z.object({
  category: z.enum(['general', 'performance', 'issue', 'achievement'], {
    required_error: 'Please select a category',
  }),
  content: z.string()
    .trim()
    .min(1, 'Note content is required')
    .max(5000, 'Note must be less than 5000 characters'),
  isPinned: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  note?: ConsultantNote;
  onSuccess?: () => void;
}

export function NoteDialog({ open, onOpenChange, consultantId, note, onSuccess }: NoteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      category: 'general',
      content: '',
      isPinned: false,
      isPrivate: false,
    },
  });

  // Update form when note changes
  useEffect(() => {
    if (note) {
      form.reset({
        category: note.category || 'general',
        content: note.content,
        isPinned: note.isPinned || false,
        isPrivate: note.isPrivate || false,
      });
    } else {
      form.reset({
        category: 'general',
        content: '',
        isPinned: false,
        isPrivate: false,
      });
    }
  }, [note, form]);

  const onSubmit = async (data: NoteFormValues) => {
    setIsSubmitting(true);
    try {
      if (note) {
        // Update existing note
        updateConsultantNote(note.id, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: 'Note updated',
          description: 'The note has been updated successfully.',
        });
      } else {
        // Create new note
        addConsultantNote({
          consultantId,
          authorId: 'current_user_id', // In production, get from auth context
          authorName: 'Current User', // In production, get from auth context
          category: data.category,
          content: data.content,
          isPinned: data.isPinned,
          isPrivate: data.isPrivate,
        });
        toast({
          title: 'Note created',
          description: 'The note has been created successfully.',
        });
      }
      
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription>
            {note ? 'Update the note details below.' : 'Add a new note about this consultant.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="issue">Issue</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your note here..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/5000
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Pin Note</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Pinned notes appear at the top of the list
                      </div>
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
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Private Note</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Only visible to you and administrators
                      </div>
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
                {isSubmitting ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
