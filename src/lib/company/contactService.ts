/**
 * Contact Service
 * API client for contact management
 */

import { apiClient as api } from '../api';
import { Contact, CreateContactData, UpdateContactData, ContactResponse } from '@/types/contact';

class ContactService {
    /**
     * Get all contacts for a company
     */
    async getContacts(companyId: string): Promise<Contact[]> {
        const response = await api.get<ContactResponse>(`/api/companies/${companyId}/contacts`);
        return response.data?.contacts || [];
    }

    /**
     * Get a single contact
     */
    async getContact(companyId: string, contactId: string): Promise<Contact | null> {
        const response = await api.get<ContactResponse>(`/api/companies/${companyId}/contacts/${contactId}`);
        return response.data?.contact || null;
    }

    /**
     * Get primary contact for a company
     */
    async getPrimaryContact(companyId: string): Promise<Contact | null> {
        try {
            const response = await api.get<ContactResponse>(`/api/companies/${companyId}/contacts/primary`);
            return response.data?.contact || null;
        } catch (error) {
            // Return null if no primary contact found
            return null;
        }
    }

    /**
     * Create a new contact
     */
    async createContact(companyId: string, data: CreateContactData): Promise<Contact> {
        const response = await api.post<ContactResponse>(`/api/companies/${companyId}/contacts`, data);
        if (!response.data?.contact) {
            throw new Error('Failed to create contact');
        }
        return response.data.contact;
    }

    /**
     * Update a contact
     */
    async updateContact(companyId: string, contactId: string, data: UpdateContactData): Promise<Contact> {
        const response = await api.put<ContactResponse>(`/api/companies/${companyId}/contacts/${contactId}`, data);
        if (!response.data?.contact) {
            throw new Error('Failed to update contact');
        }
        return response.data.contact;
    }

    /**
     * Delete a contact
     */
    async deleteContact(companyId: string, contactId: string): Promise<void> {
        await api.delete(`/api/companies/${companyId}/contacts/${contactId}`);
    }

    /**
     * Set a contact as primary
     */
    async setPrimaryContact(companyId: string, contactId: string): Promise<Contact> {
        const response = await api.put<ContactResponse>(`/api/companies/${companyId}/contacts/${contactId}/set-primary`);
        if (!response.data?.contact) {
            throw new Error('Failed to set primary contact');
        }
        return response.data.contact;
    }
}

export const contactService = new ContactService();
