import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Settings, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CommissionRule } from "@/types/commissionRule";
import type { CommissionRoleType } from "@/types/commissionRole";
import { getAllCommissionRules, createCommissionRule, updateCommissionRule, deleteCommissionRule } from "@/lib/multiRoleCommissionStorage";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ruleSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().trim().max(200, "Description must be less than 200 characters").optional(),
  priority: z.string().regex(/^\d+$/, "Must be a number"),
  transactionType: z.enum(['ats-subscription', 'hrms-addon', 'recruitment-service', 'rpo-service', 'additional-service']),
  isActive: z.boolean(),
});

type RuleFormData = z.infer<typeof ruleSchema>;

const transactionTypeLabels = {
  'ats-subscription': 'ATS Subscription',
  'hrms-addon': 'HRMS Add-on',
  'recruitment-service': 'Recruitment Service',
  'rpo-service': 'RPO Service',
  'additional-service': 'Additional Service',
};

const roleTypeLabels: Record<CommissionRoleType, string> = {
  'sales-agent': 'Sales Agent',
  'recruiter': 'Recruiter',
  'account-manager': 'Account Manager',
  'team-lead': 'Team Lead',
  'sourcing-specialist': 'Sourcing Specialist',
  'custom': 'Custom Role',
};

interface RoleAction {
  roleType: CommissionRoleType;
  percentage: number;
}

export function CommissionRuleBuilder() {
  const [rules, setRules] = useState<CommissionRule[]>(getAllCommissionRules());
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleActions, setRoleActions] = useState<RoleAction[]>([]);
  const { toast } = useToast();

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "100",
      transactionType: "ats-subscription",
      isActive: true,
    },
  });

  const onSubmit = (data: RuleFormData) => {
    try {
      if (roleActions.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one role action.",
          variant: "destructive",
        });
        return;
      }

      const ruleData = {
        name: data.name,
        description: data.description,
        priority: parseInt(data.priority),
        conditions: [
          { field: 'transactionType' as const, operator: 'equals' as const, value: data.transactionType }
        ],
        actions: roleActions.map(ra => ({
          roleType: ra.roleType,
          percentage: ra.percentage,
        })),
        isActive: data.isActive,
        effectiveFrom: new Date().toISOString(),
      };

      if (editingRule) {
        const updated = updateCommissionRule(editingRule.id, ruleData);
        if (updated) {
          setRules(getAllCommissionRules());
          toast({
            title: "Rule Updated",
            description: `${data.name} has been updated successfully.`,
          });
        }
      } else {
        createCommissionRule(ruleData);
        setRules(getAllCommissionRules());
        toast({
          title: "Rule Created",
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setDialogOpen(false);
      setEditingRule(null);
      setRoleActions([]);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save commission rule.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (rule: CommissionRule) => {
    setEditingRule(rule);
    const transactionType = rule.conditions.find(c => c.field === 'transactionType')?.value || 'ats-subscription';
    form.reset({
      name: rule.name,
      description: rule.description || "",
      priority: rule.priority.toString(),
      transactionType,
      isActive: rule.isActive,
    });
    setRoleActions(rule.actions.map(a => ({
      roleType: a.roleType,
      percentage: a.percentage || 0,
    })));
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (deleteCommissionRule(id)) {
      setRules(getAllCommissionRules());
      toast({
        title: "Rule Deleted",
        description: `${rule?.name} has been deleted successfully.`,
      });
    }
  };

  const handleToggleActive = (rule: CommissionRule) => {
    const updated = updateCommissionRule(rule.id, { isActive: !rule.isActive });
    if (updated) {
      setRules(getAllCommissionRules());
      toast({
        title: rule.isActive ? "Rule Deactivated" : "Rule Activated",
        description: `${rule.name} is now ${!rule.isActive ? 'active' : 'inactive'}.`,
      });
    }
  };

  const addRoleAction = () => {
    setRoleActions([...roleActions, { roleType: 'sales-agent', percentage: 0 }]);
  };

  const updateRoleAction = (index: number, field: keyof RoleAction, value: any) => {
    const updated = [...roleActions];
    updated[index] = { ...updated[index], [field]: value };
    setRoleActions(updated);
  };

  const removeRoleAction = (index: number) => {
    setRoleActions(roleActions.filter((_, i) => i !== index));
  };

  const totalPercentage = roleActions.reduce((sum, ra) => sum + ra.percentage, 0);

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingRule(null);
      setRoleActions([]);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Commission Rules</CardTitle>
              <CardDescription>Define automated commission assignment rules</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRule ? "Edit Commission Rule" : "Create Commission Rule"}</DialogTitle>
                <DialogDescription>
                  {editingRule ? "Update the commission rule details below." : "Add a new automated commission rule."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rule Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Standard ATS Split" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="100" {...field} />
                          </FormControl>
                          <FormDescription>Higher number = higher priority</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of when this rule applies"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormDescription>This rule will apply to this transaction type</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Role Assignments</h4>
                        <p className="text-sm text-muted-foreground">Define commission splits for each role</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addRoleAction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </div>

                    {roleActions.map((action, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Role Type</label>
                            <Select 
                              value={action.roleType} 
                              onValueChange={(value) => updateRoleAction(index, 'roleType', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(roleTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
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
                              value={action.percentage}
                              onChange={(e) => updateRoleAction(index, 'percentage', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="mt-5"
                          onClick={() => removeRoleAction(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    {roleActions.length > 0 && (
                      <div className={`p-3 rounded-lg ${totalPercentage > 100 ? 'bg-destructive/10 border-destructive' : 'bg-muted'} border`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Commission:</span>
                          <span className={`text-lg font-bold ${totalPercentage > 100 ? 'text-destructive' : 'text-primary'}`}>
                            {totalPercentage}%
                          </span>
                        </div>
                        {totalPercentage > 100 && (
                          <p className="text-xs text-destructive mt-1">Warning: Total exceeds 100%</p>
                        )}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Enable this rule for automatic commission assignment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingRule ? "Update" : "Create"} Rule
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Badge variant="outline">{rule.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    {rule.description && (
                      <div className="text-sm text-muted-foreground">{rule.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {transactionTypeLabels[rule.conditions.find(c => c.field === 'transactionType')?.value as keyof typeof transactionTypeLabels]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {roleTypeLabels[action.roleType]}: {action.percentage}%
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(rule)}
                    >
                      <Switch checked={rule.isActive} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{rule.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(rule.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
