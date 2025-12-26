import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getEmployerContacts, deleteContact, setPrimaryContact } from "@/lib/employerContactStorage";
import { EmployerContact } from "@/types/employerCRM";
import { ContactCard } from "./ContactCard";
import { AddContactDialog } from "./AddContactDialog";
import { toast } from "@/hooks/use-toast";

interface ContactsSectionProps {
  employerId: string;
}

export function ContactsSection({ employerId }: ContactsSectionProps) {
  const [contacts, setContacts] = useState<EmployerContact[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmployerContact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<EmployerContact | null>(null);

  useEffect(() => {
    setContacts(getEmployerContacts(employerId));
  }, [employerId]);

  const handleContactAdded = (contact: EmployerContact) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === contact.id ? contact : c));
    } else {
      setContacts([contact, ...contacts]);
    }
    setEditingContact(null);
  };

  const handleDeleteContact = () => {
    if (!contactToDelete) return;

    try {
      const success = deleteContact(contactToDelete.id, employerId);
      if (success) {
        setContacts(contacts.filter(c => c.id !== contactToDelete.id));
        toast({ title: "Contact deleted successfully" });
      }
    } catch (error) {
      toast({
        title: "Cannot delete contact",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleSetPrimary = (contact: EmployerContact) => {
    const success = setPrimaryContact(contact.id, employerId);
    if (success) {
      setContacts(getEmployerContacts(employerId));
      toast({ title: "Primary contact updated" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contacts yet. Add your first contact to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={() => {
                    setEditingContact(contact);
                    setAddDialogOpen(true);
                  }}
                  onDelete={() => {
                    setContactToDelete(contact);
                    setDeleteDialogOpen(true);
                  }}
                  onSetPrimary={() => handleSetPrimary(contact)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddContactDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingContact(null);
        }}
        employerId={employerId}
        onContactAdded={handleContactAdded}
        editingContact={editingContact}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.firstName} {contactToDelete?.lastName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
