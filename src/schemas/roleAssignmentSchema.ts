import { z } from "zod";

export const roleAssignmentSchema = z.object({
  userId: z.string().min(1, "User is required"),
  role: z.enum(["super_admin", "hr_admin", "manager", "recruiter", "employee", "viewer"]),
  departmentId: z.string().optional(),
  expiresAt: z.string().optional(),
}).refine((data) => {
  if ((data.role === "manager" || data.role === "recruiter") && !data.departmentId) {
    return false;
  }
  return true;
}, {
  message: "Department is required for managers and recruiters",
  path: ["departmentId"],
});

export type RoleAssignmentFormData = z.infer<typeof roleAssignmentSchema>;
