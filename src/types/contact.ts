/**
 * Contact Types
 * Type definitions for contact management
 */

export interface Contact {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    department?: string;
    isPrimary: boolean;
    linkedInUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    department?: string;
    linkedInUrl?: string;
    notes?: string;
}

export interface UpdateContactData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    title?: string;
    department?: string;
    linkedInUrl?: string;
    notes?: string;
}

export interface ContactResponse {
    success: boolean;
    contact?: Contact;
    contacts?: Contact[];
    message?: string;
    error?: string;
}
