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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { createContact, updateContact } from "@/lib/employerContactStorage";
import { EmployerContact, ContactRole } from "@/types/employerCRM";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().max(100).optional(),
  department: z.string().optional(),
  roles: z.array(z.enum(['decision-maker', 'technical', 'billing', 'hr', 'recruiter', 'other'])).min(1, "Select at least one role"),
  linkedInUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  isPrimary: z.boolean(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employerId: string;
  onContactAdded: (contact: EmployerContact) => void;
  editingContact?: EmployerContact | null;
}

const roleOptions: { value: ContactRole; label: string }[] = [
  { value: 'decision-maker', label: 'Decision Maker' },
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'hr', label: 'HR' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'other', label: 'Other' },
];

export function AddContactDialog({
  open,
  onOpenChange,
  employerId,
  onContactAdded,
  editingContact,
}: AddContactDialogProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: editingContact?.firstName || '',
      lastName: editingContact?.lastName || '',
      email: editingContact?.email || '',
      phone: editingContact?.phone || '',
      title: editingContact?.title || '',
      department: editingContact?.department || '',
      roles: editingContact?.roles || [],
      linkedInUrl: editingContact?.linkedInUrl || '',
      notes: editingContact?.notes || '',
      isPrimary: editingContact?.isPrimary || false,
    },
  });

  const onSubmit = (data: ContactFormData) => {
    try {
      if (editingContact) {
        const updated = updateContact(editingContact.id, data);
        if (updated) {
          onContactAdded(updated);
          toast({ title: "Contact updated successfully" });
        }
      } else {
        const newContact = createContact({
          employerId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          title: data.title,
          department: data.department,
          roles: data.roles,
          linkedInUrl: data.linkedInUrl,
          notes: data.notes,
          isPrimary: data.isPrimary,
        });
        onContactAdded(newContact);
        toast({ title: "Contact added successfully" });
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to save contact",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingContact ? 'Edit Contact' : 'Add Contact'}
          </DialogTitle>
          <DialogDescription>
            {editingContact
              ? 'Update contact information below'
              : 'Add a new contact for this employer'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1 (555) 123-4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title/Position</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., HR Manager" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Human Resources" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles *</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedInUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Primary Contact</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Set as the main point of contact for this employer
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
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
