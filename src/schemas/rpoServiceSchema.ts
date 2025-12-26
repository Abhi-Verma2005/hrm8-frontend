import { z } from "zod";

export const rpoFeeStructureSchema = z.object({
  id: z.string(),
  type: z.enum(['consultant-monthly', 'per-vacancy', 'milestone', 'one-time', 'custom']),
  name: z.string().min(1, "Fee name is required").max(100),
  amount: z.number().min(0, "Amount must be positive"),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'per-placement', 'per-vacancy']).optional(),
  description: z.string().max(500).optional(),
  isGuidePrice: z.boolean().optional(),
});

export const rpoConsultantAssignmentSchema = z.object({
  id: z.string(),
  consultantId: z.string().min(1, "Consultant is required"),
  consultantName: z.string().min(1, "Consultant name is required"),
  monthlyRate: z.number().min(0, "Monthly rate must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const rpoServiceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  clientId: z.string().min(1, "Client is required"),
  clientName: z.string().min(1, "Client name is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  
  // RPO specific
  rpoStartDate: z.string().min(1, "Start date is required"),
  rpoDuration: z.number().min(1, "Duration must be at least 1 month").max(120),
  rpoNumberOfConsultants: z.number().min(1, "At least 1 consultant required"),
  rpoMonthlyRatePerConsultant: z.number().min(0, "Monthly rate must be positive"),
  rpoPerVacancyFee: z.number().min(0, "Per vacancy fee must be positive"),
  rpoEstimatedVacancies: z.number().min(0, "Estimated vacancies must be non-negative"),
  rpoIsCustomPricing: z.boolean().default(false),
  
  rpoFeeStructures: z.array(rpoFeeStructureSchema).default([]),
  rpoAssignedConsultants: z.array(rpoConsultantAssignmentSchema).default([]),
  
  // Contract terms
  rpoAutoRenew: z.boolean().default(false),
  rpoNoticePeriod: z.number().min(0).max(365).default(30),
  targetPlacements: z.number().min(0).optional(),
  
  // Contacts
  rpoPrimaryContactId: z.string().optional(),
  rpoAdditionalContactIds: z.array(z.string()).default([]),
  
  rpoNotes: z.string().max(2000).optional(),
  description: z.string().max(500).optional(),
}).refine((data) => {
  // If custom pricing, must have fee structures
  if (data.rpoIsCustomPricing && data.rpoFeeStructures.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Custom pricing requires at least one fee structure",
  path: ["rpoFeeStructures"],
});

export type RPOServiceFormData = z.infer<typeof rpoServiceSchema>;
export type RPOFeeStructureFormData = z.infer<typeof rpoFeeStructureSchema>;
export type RPOConsultantAssignmentFormData = z.infer<typeof rpoConsultantAssignmentSchema>;
