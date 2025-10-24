import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createNote, updateNote } from "@/lib/employerCRMStorage";
import { EmployerNote } from "@/types/employerCRM";
import { toast } from "@/hooks/use-toast";

const noteSchema = z.object({
  category: z.enum(['general', 'meeting', 'call', 'email', 'issue', 'opportunity']),
  content: z.string().min(10, "Note must be at least 10 characters"),
  isPrivate: z.boolean(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employerId: string;
  onNoteAdded: (note: EmployerNote) => void;
  editingNote?: EmployerNote | null;
}

export function AddNoteDialog({ 
  open, 
  onOpenChange, 
  employerId, 
  onNoteAdded,
  editingNote 
}: AddNoteDialogProps) {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      category: 'general',
      content: '',
      isPrivate: false,
    },
  });

  useEffect(() => {
    if (editingNote) {
      form.reset({
        category: editingNote.category,
        content: editingNote.content,
        isPrivate: editingNote.isPrivate,
      });
    } else {
      form.reset({
        category: 'general',
        content: '',
        isPrivate: false,
      });
    }
  }, [editingNote, form]);

  const onSubmit = (data: NoteFormData) => {
    try {
      if (editingNote) {
        const updated = updateNote(editingNote.id, data);
        if (updated) {
          onNoteAdded(updated);
          toast({ title: "Note updated successfully" });
        }
      } else {
        const newNote = createNote({
          employerId,
          authorId: 'current-user-id',
          authorName: 'Current User',
          category: data.category,
          content: data.content,
          isPrivate: data.isPrivate,
        });
        onNoteAdded(newNote);
        toast({ title: "Note added successfully" });
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({ 
        title: "Failed to save note", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingNote ? 'Edit Note' : 'Add Note'}
          </DialogTitle>
          <DialogDescription>
            {editingNote 
              ? 'Update the note details below' 
              : 'Add a new note or communication record'}
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="issue">Issue</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
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
                      {...field} 
                      rows={6}
                      placeholder="Enter note details..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Private Note</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Only visible to internal team members
                    </p>
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
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingNote ? 'Update Note' : 'Add Note'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
