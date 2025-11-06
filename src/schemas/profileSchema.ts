import { z } from "zod";

export const profileEditSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  middleName: z.string().max(50).optional(),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(20),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required").max(2),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().default("US"),
  }),
  emergencyContacts: z.array(z.object({
    name: z.string().min(1, "Contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Phone is required"),
    email: z.string().email().optional(),
  })).min(1, "At least one emergency contact is required"),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
