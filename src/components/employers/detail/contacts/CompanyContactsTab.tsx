import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, User, Star, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddContactDialog } from "./AddContactDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { getEmployerContacts, deleteContact, updateContact } from "@/lib/employerContactStorage";
import { EmployerContact } from "@/types/employerCRM";

interface CompanyContactsTabProps {
    companyId: string;
}

export function CompanyContactsTab({ companyId }: CompanyContactsTabProps) {
    const [contacts, setContacts] = useState<EmployerContact[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmployerContact | null>(null);

    useEffect(() => {
        loadContacts();
    }, [companyId]);

    const loadContacts = () => {
        const loadedContacts = getEmployerContacts(companyId);
        setContacts(loadedContacts);
    };

    const handleContactAdded = (contact: EmployerContact) => {
        loadContacts();
        setIsAddDialogOpen(false);
        setEditingContact(null);
    };

    const handleDeleteContact = (id: string) => {
        deleteContact(id, companyId);
        loadContacts();
    };

    const handleSetPrimary = (id: string) => {
        // First, set all contacts to non-primary
        contacts.forEach(c => {
            if (c.isPrimary) {
                updateContact(c.id, { isPrimary: false });
            }
        });
        // Then set the selected contact as primary
        updateContact(id, { isPrimary: true });
        loadContacts();
    };

    const handleEditClick = (contact: EmployerContact) => {
        setEditingContact(contact);
        setIsAddDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Contacts</CardTitle>
                            <CardDescription>
                                Manage company contacts and their roles
                            </CardDescription>
                        </div>
                        <Button onClick={() => {
                            setEditingContact(null);
                            setIsAddDialogOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contact
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {contacts.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your first contact to get started
                            </p>
                            <Button onClick={() => {
                                setEditingContact(null);
                                setIsAddDialogOpen(true);
                            }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Contact
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {contact.firstName} {contact.lastName}
                                                {contact.isPrimary && (
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{contact.title || "-"}</TableCell>
                                        <TableCell>{contact.department || "-"}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <Mail className="h-3 w-3" />
                                                {contact.email}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {contact.phone ? (
                                                <a
                                                    href={`tel:${contact.phone}`}
                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {contact.phone}
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {contact.roles.slice(0, 2).map((role) => (
                                                    <Badge key={role} variant="outline" className="text-xs">
                                                        {role.replace('-', ' ')}
                                                    </Badge>
                                                ))}
                                                {contact.roles.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{contact.roles.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {contact.isPrimary && (
                                                <Badge variant="default">Primary</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(contact)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {!contact.isPrimary && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleSetPrimary(contact.id)}
                                                        >
                                                            <Star className="h-4 w-4 mr-2" />
                                                            Set as Primary
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteContact(contact.id)}
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
                    )}
                </CardContent>
            </Card>

            <AddContactDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                employerId={companyId}
                onContactAdded={handleContactAdded}
                editingContact={editingContact}
            />
        </div>
    );
}
