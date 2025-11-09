import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CommissionRoleType } from "@/types/commissionRole";
import { getActiveCommissionRoles, getActiveCommissionRules, createTransactionCommission } from "@/lib/multiRoleCommissionStorage";
import { calculateTransactionCommission, applyCommissionRules } from "@/lib/multiRoleCommissionCalculator";
import { CommissionSplitVisualizer } from "./CommissionSplitVisualizer";
import { getAllConsultants } from "@/lib/consultantStorage";

const formSchema = z.object({
  transactionType: z.enum(['ats-subscription', 'hrms-addon', 'recruitment-service', 'rpo-service', 'additional-service']),
  transactionDescription: z.string().trim().min(1, "Description is required").max(200),
  baseAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  employerName: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RoleAssignment {
  roleId: string;
  roleType: CommissionRoleType;
  roleName: string;
  consultantId: string;
  consultantName: string;
  percentage: number;
}

const transactionTypeLabels = {
  'ats-subscription': 'ATS Subscription',
  'hrms-addon': 'HRMS Add-on',
  'recruitment-service': 'Recruitment Service',
  'rpo-service': 'RPO Service',
  'additional-service': 'Additional Service',
};

export function TransactionCommissionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const { toast } = useToast();
  const roles = getActiveCommissionRoles();
  const consultants = getAllConsultants();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionType: "ats-subscription",
      transactionDescription: "",
      baseAmount: "0",
      employerName: "",
      notes: "",
    },
  });

  const baseAmount = parseFloat(form.watch("baseAmount") || "0");

  const calculatedResult = baseAmount > 0 && roleAssignments.length > 0
    ? calculateTransactionCommission({
        transactionType: form.watch("transactionType"),
        baseAmount,
        roleAssignments: roleAssignments.map(ra => ({
          roleId: ra.roleId,
          roleType: ra.roleType,
          consultantId: ra.consultantId,
          consultantName: ra.consultantName,
          percentage: ra.percentage,
        })),
      })
    : null;

  const handleAutoApplyRules = () => {
    const rules = getActiveCommissionRules();
    const suggestedRoles = applyCommissionRules(
      {
        transactionType: form.watch("transactionType"),
        baseAmount,
      },
      rules
    );

    if (suggestedRoles.length === 0) {
      toast({
        title: "No Rules Found",
        description: "No matching commission rules found for this transaction type.",
      });
      return;
    }

    // Convert suggested roles to assignments with empty consultants
    const newAssignments: RoleAssignment[] = suggestedRoles.map((sr) => ({
      roleId: sr.roleId,
      roleType: sr.roleType,
      roleName: sr.roleName,
      consultantId: "",
      consultantName: "",
      percentage: sr.percentage,
    }));

    setRoleAssignments(newAssignments);
    toast({
      title: "Rules Applied",
      description: `Applied ${newAssignments.length} role(s) from commission rules. Please assign consultants.`,
    });
  };

  const addRoleAssignment = () => {
    const firstRole = roles[0];
    if (!firstRole) {
      toast({
        title: "No Roles Available",
        description: "Please create commission roles first.",
        variant: "destructive",
      });
      return;
    }

    setRoleAssignments([
      ...roleAssignments,
      {
        roleId: firstRole.id,
        roleType: firstRole.type,
        roleName: firstRole.name,
        consultantId: "",
        consultantName: "",
        percentage: firstRole.defaultRate,
      },
    ]);
  };

  const updateAssignment = (index: number, field: keyof RoleAssignment, value: any) => {
    const updated = [...roleAssignments];
    
    if (field === 'roleId') {
      const role = roles.find(r => r.id === value);
      if (role) {
        updated[index] = {
          ...updated[index],
          roleId: role.id,
          roleType: role.type,
          roleName: role.name,
          percentage: role.defaultRate,
        };
      }
    } else if (field === 'consultantId') {
      const consultant = consultants.find(c => c.id === value);
      if (consultant) {
        updated[index] = {
          ...updated[index],
          consultantId: consultant.id,
          consultantName: `${consultant.firstName} ${consultant.lastName}`,
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setRoleAssignments(updated);
  };

  const removeAssignment = (index: number) => {
    setRoleAssignments(roleAssignments.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    if (roleAssignments.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one role assignment.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyConsultants = roleAssignments.some(ra => !ra.consultantId);
    if (hasEmptyConsultants) {
      toast({
        title: "Error",
        description: "Please assign a consultant to each role.",
        variant: "destructive",
      });
      return;
    }

    if (!calculatedResult) {
      toast({
        title: "Error",
        description: "Invalid commission calculation.",
        variant: "destructive",
      });
      return;
    }

    try {
      createTransactionCommission({
        transactionId: `txn_${Date.now()}`,
        transactionType: data.transactionType,
        transactionDescription: data.transactionDescription,
        baseAmount: parseFloat(data.baseAmount),
        totalCommissionableAmount: parseFloat(data.baseAmount),
        currency: 'USD',
        roleAssignments: calculatedResult.roleCommissions.map((rc, idx) => ({
          ...rc,
          id: `role_${Date.now()}_${idx}`,
        })),
        totalCommissionPercentage: calculatedResult.totalCommissionPercentage,
        totalCommissionAmount: calculatedResult.totalCommissionAmount,
        status: 'draft',
        employerName: data.employerName,
        transactionDate: new Date().toISOString(),
        earnedDate: new Date().toISOString(),
        notes: data.notes,
      });

      toast({
        title: "Commission Created",
        description: "Transaction commission has been created successfully.",
      });

      form.reset();
      setRoleAssignments([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create commission transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Enter the transaction information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(transactionTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual ATS Subscription" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Total transaction value</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer/Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Role Assignments</h4>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleAutoApplyRules}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Apply Rules
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={addRoleAssignment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </div>

                {roleAssignments.map((assignment, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Role</label>
                        <Select
                          value={assignment.roleId}
                          onValueChange={(value) => updateAssignment(index, 'roleId', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Percentage</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          className="mt-1"
                          value={assignment.percentage}
                          onChange={(e) => updateAssignment(index, 'percentage', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-medium">Consultant</label>
                        <Select
                          value={assignment.consultantId}
                          onValueChange={(value) => updateAssignment(index, 'consultantId', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select consultant" />
                          </SelectTrigger>
                          <SelectContent>
                            {consultants.map((consultant) => (
                              <SelectItem key={consultant.id} value={consultant.id}>
                                {consultant.firstName} {consultant.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5"
                        onClick={() => removeAssignment(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {calculatedResult && calculatedResult.warnings.length > 0 && (
                  <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                    {calculatedResult.warnings.map((warning, idx) => (
                      <p key={idx} className="text-sm text-destructive">{warning}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { form.reset(); setRoleAssignments([]); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!calculatedResult || roleAssignments.length === 0}>
                  Create Commission
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {calculatedResult && (
        <CommissionSplitVisualizer
          roleAssignments={calculatedResult.roleCommissions.map((rc, idx) => ({
            ...rc,
            id: `preview_${idx}`,
          }))}
          totalAmount={calculatedResult.totalCommissionAmount}
        />
      )}
    </div>
  );
}
