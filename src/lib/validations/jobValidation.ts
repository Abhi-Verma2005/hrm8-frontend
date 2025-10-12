import { z } from 'zod';

export const jobBasicDetailsSchema = z.object({
  postAsHRM8: z.boolean().default(false),
  employerId: z.string(),
  title: z.string().min(5, "Job title must be at least 5 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'casual']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']),
  remoteOption: z.boolean(),
  priority: z.enum(['standard', 'urgent', 'high']),
});

export const jobDescriptionSchema = z.object({
  description: z.string().min(50, "Job description must be at least 50 characters"),
  requirements: z.array(z.string().min(1)).min(1, "At least one requirement is needed"),
  responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is needed"),
});

export const jobCompensationSchema = z.object({
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default('USD'),
  hideSalary: z.boolean(),
  closeDate: z.string().optional(),
  visibility: z.enum(['public', 'private', 'stealth']),
}).refine(
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

export const jobPublishSchema = z.object({
  status: z.enum(['draft', 'open']),
  jobBoardDistribution: z.array(z.string()),
});

// Full form schema (without refinement from compensation)
const baseCompensationSchema = z.object({
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default('USD'),
  hideSalary: z.boolean(),
  closeDate: z.string().optional(),
  visibility: z.enum(['public', 'private', 'stealth']),
});

export const jobFormSchema = jobBasicDetailsSchema
  .merge(jobDescriptionSchema)
  .merge(baseCompensationSchema)
  .merge(jobPublishSchema)
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
