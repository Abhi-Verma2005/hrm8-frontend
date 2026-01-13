/**
 * Contacts Page
 * Manage company contacts
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ContactList } from '@/components/company/ContactList';
import { ContactDialog } from '@/components/company/ContactDialog';
import { contactService } from '@/lib/company/contactService';
import { Contact, CreateContactData, UpdateContactData } from '@/types/contact';
import { Plus, Search } from 'lucide-react';

export default function ContactsPage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get company ID from authenticated user
    const companyId = user?.companyId;

    useEffect(() => {
        if (companyId) {
            loadContacts();
        }
    }, [companyId]);

    useEffect(() => {
        // Filter contacts based on search query
        if (searchQuery.trim() === '') {
            setFilteredContacts(contacts);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = contacts.filter(
                (contact) =>
                    contact.firstName.toLowerCase().includes(query) ||
                    contact.lastName.toLowerCase().includes(query) ||
                    contact.email.toLowerCase().includes(query) ||
                    contact.title?.toLowerCase().includes(query) ||
                    contact.department?.toLowerCase().includes(query)
            );
            setFilteredContacts(filtered);
        }
    }, [searchQuery, contacts]);

    const loadContacts = async () => {
        if (!companyId) return;

        try {
            setIsLoading(true);
            const data = await contactService.getContacts(companyId);
            setContacts(data);
            setFilteredContacts(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load contacts',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddContact = () => {
        setSelectedContact(null);
        setIsDialogOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setSelectedContact(contact);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: CreateContactData | UpdateContactData) => {
        if (!companyId) return;

        try {
            setIsSubmitting(true);

            if (selectedContact) {
                // Update existing contact
                await contactService.updateContact(companyId, selectedContact.id, data);
                toast({
                    title: 'Success',
                    description: 'Contact updated successfully',
                });
            } else {
                // Create new contact
                await contactService.createContact(companyId, data as CreateContactData);
                toast({
                    title: 'Success',
                    description: 'Contact created successfully',
                });
            }

            setIsDialogOpen(false);
            setSelectedContact(null);
            await loadContacts();
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to ${selectedContact ? 'update' : 'create'} contact`,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!companyId) return;

        try {
            await contactService.deleteContact(companyId, contactId);
            toast({
                title: 'Success',
                description: 'Contact deleted successfully',
            });
            await loadContacts();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete contact',
                variant: 'destructive',
            });
        }
    };

    const handleSetPrimary = async (contactId: string) => {
        if (!companyId) return;

        try {
            await contactService.setPrimaryContact(companyId, contactId);
            toast({
                title: 'Success',
                description: 'Primary contact updated successfully',
            });
            await loadContacts();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to set primary contact',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Contacts</h1>
                    <p className="text-muted-foreground">
                        Manage contacts for this company
                    </p>
                </div>
                <Button onClick={handleAddContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Contact List</CardTitle>
                            <CardDescription>
                                {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
                            </CardDescription>
                        </div>
                        <div className="w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ContactList
                        contacts={filteredContacts}
                        onEdit={handleEditContact}
                        onDelete={handleDeleteContact}
                        onSetPrimary={handleSetPrimary}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <ContactDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                contact={selectedContact}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}
