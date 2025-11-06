import { z } from "zod";

export const tenureRateSchema = z.object({
  yearsFrom: z.number().min(0, "Years from must be non-negative"),
  yearsTo: z.number().optional(),
  accrualRate: z.number().min(0, "Accrual rate must be positive"),
});

export const accrualPolicySchema = z.object({
  name: z.string().min(1, "Policy name is required").max(100),
  leaveTypeId: z.string().min(1, "Leave type is required"),
  leaveTypeName: z.string().min(1, "Leave type name is required"),
  accrualMethod: z.enum(["annual", "monthly", "per-pay-period", "hours-worked"]),
  accrualRate: z.number().min(0, "Accrual rate must be positive"),
  accrualFrequency: z.enum(["yearly", "monthly", "biweekly", "per-hour"]),
  startDate: z.string().min(1, "Start date is required"),
  prorateFirstYear: z.boolean(),
  prorateLastYear: z.boolean(),
  maxAccrual: z.number().optional(),
  carryoverAllowed: z.boolean(),
  maxCarryover: z.number().optional(),
  carryoverExpiry: z.number().optional(),
  negativeBalanceAllowed: z.boolean(),
  tenureBasedRates: z.array(tenureRateSchema).default([]),
  effectiveDate: z.string().min(1, "Effective date is required"),
  isActive: z.boolean().default(true),
});

export type AccrualPolicyFormData = z.infer<typeof accrualPolicySchema>;
