/**
 * Contact List Component
 * Display and manage company contacts
 */

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Contact } from '@/types/contact';
import { MoreHorizontal, Mail, Phone, Star, Pencil, Trash2, ExternalLink } from 'lucide-react';

interface ContactListProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (contactId: string) => void;
    onSetPrimary: (contactId: string) => void;
    isLoading?: boolean;
}

export function ContactList({
    contacts,
    onEdit,
    onDelete,
    onSetPrimary,
    isLoading = false,
}: ContactListProps) {
    const [deleteContactId, setDeleteContactId] = useState<string | null>(null);

    const handleDelete = () => {
        if (deleteContactId) {
            onDelete(deleteContactId);
            setDeleteContactId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading contacts...</div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">No contacts found</div>
                <div className="text-sm text-muted-foreground">
                    Add a contact to get started
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div className="font-medium">
                                                {contact.firstName} {contact.lastName}
                                            </div>
                                            {contact.isPrimary && (
                                                <Badge variant="secondary" className="mt-1">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {contact.email}
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {contact.phone ? (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {contact.phone}
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {contact.title || <span className="text-muted-foreground">-</span>}
                                </TableCell>
                                <TableCell>
                                    {contact.department || <span className="text-muted-foreground">-</span>}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(contact)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            {!contact.isPrimary && (
                                                <DropdownMenuItem onClick={() => onSetPrimary(contact.id)}>
                                                    <Star className="h-4 w-4 mr-2" />
                                                    Set as Primary
                                                </DropdownMenuItem>
                                            )}
                                            {contact.linkedInUrl && (
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={contact.linkedInUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View LinkedIn
                                                    </a>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                onClick={() => setDeleteContactId(contact.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteContactId} onOpenChange={() => setDeleteContactId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this contact? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
