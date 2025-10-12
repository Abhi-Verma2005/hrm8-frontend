import { z } from 'zod';

// Base schema without refinements (for merging)
const baseJobBasicDetailsSchema = z.object({
  postAsHRM8: z.boolean().default(false),
  employerId: z.string(),
  title: z.string().min(5, "Job title must be at least 5 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'casual']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']),
  remoteOption: z.boolean(),
  priority: z.enum(['standard', 'urgent', 'high']),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default('USD'),
  salaryPeriod: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'annual']).default('annual'),
  salaryDescription: z.string().max(100, "Salary description must be 100 characters or less").optional(),
  hideSalary: z.boolean().default(false),
});

// Exported schema with refinements (for step validation)
export const jobBasicDetailsSchema = baseJobBasicDetailsSchema.refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"],
  }
);

export const jobDescriptionSchema = z.object({
  description: z.string()
    .min(1, "Job description is required")
    .refine((val) => {
      // Strip HTML tags to check actual text content length
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    }, {
      message: "Job description must contain at least 50 characters of actual content"
    }),
  requirements: z.array(z.string().min(1)).min(1, "At least one requirement is needed"),
  responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is needed"),
});

export const jobCompensationSchema = z.object({
  closeDate: z.string().optional(),
  visibility: z.enum(['public', 'private', 'stealth']),
});

export const jobPublishSchema = z.object({
  status: z.enum(['draft', 'open']),
  jobBoardDistribution: z.array(z.string()),
});

// Full form schema (without refinement from compensation)
const baseCompensationSchema = z.object({
  closeDate: z.string().optional(),
  visibility: z.enum(['public', 'private', 'stealth']),
});

export const jobFormSchema = baseJobBasicDetailsSchema
  .merge(jobDescriptionSchema)
  .merge(baseCompensationSchema)
  .merge(jobPublishSchema)
  .refine((data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  }, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"],
  })
  .refine((data) => {
    if (!data.postAsHRM8 && !data.employerId) {
      return false;
    }
    return true;
  }, {
    message: "Please select an employer or toggle 'Post as HRM8'",
    path: ["employerId"],
  });

export const templateSchema = z.object({
  templateName: z.string().min(3, "Template name must be at least 3 characters"),
  title: z.string().min(5, "Job title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.array(z.string().min(1)).min(1, "At least one requirement is needed"),
  responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is needed"),
  employmentType: z.string(),
  department: z.string(),
  experienceLevel: z.string(),
});

export type JobBasicDetailsInput = z.infer<typeof jobBasicDetailsSchema>;
export type JobDescriptionInput = z.infer<typeof jobDescriptionSchema>;
export type JobCompensationInput = z.infer<typeof jobCompensationSchema>;
export type JobPublishInput = z.infer<typeof jobPublishSchema>;
export type JobFormInput = z.infer<typeof jobFormSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;
