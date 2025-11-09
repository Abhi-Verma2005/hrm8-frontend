import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Percent, TrendingUp, DollarSign } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const commissionRuleSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  ruleType: z.enum(["flat_rate", "tiered", "performance_based"]),
  baseRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate format").refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 100, "Rate must be between 0 and 100"),
  appliesTo: z.enum(["all", "sales", "recruitment", "projects"]),
  minThreshold: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount").optional(),
  isActive: z.boolean(),
  payoutFrequency: z.enum(["immediate", "weekly", "biweekly", "monthly"]),
  currency: z.string().min(3, "Currency code required").max(3, "Invalid currency code"),
});

type CommissionRuleFormData = z.infer<typeof commissionRuleSchema>;

interface CommissionRule extends CommissionRuleFormData {
  id: string;
  createdAt: string;
}

const commissionTierSchema = z.object({
  ruleName: z.string().trim().min(1, "Rule name is required"),
  tierName: z.string().trim().min(1, "Tier name is required").max(50, "Name must be less than 50 characters"),
  minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format").optional(),
  commissionRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate format").refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 100, "Rate must be between 0 and 100"),
  bonusAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount").optional(),
});

type CommissionTierFormData = z.infer<typeof commissionTierSchema>;

interface CommissionTier extends CommissionTierFormData {
  id: string;
}

const mockRules: CommissionRule[] = [
  {
    id: "1",
    name: "Standard Sales Commission",
    description: "Standard commission rate for all sales transactions",
    ruleType: "flat_rate",
    baseRate: "10.00",
    appliesTo: "sales",
    isActive: true,
    payoutFrequency: "monthly",
    currency: "USD",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Tiered Sales Performance",
    description: "Commission increases with sales volume",
    ruleType: "tiered",
    baseRate: "8.00",
    appliesTo: "sales",
    minThreshold: "1000.00",
    isActive: true,
    payoutFrequency: "monthly",
    currency: "USD",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Recruitment Commission",
    description: "Commission for successful candidate placements",
    ruleType: "flat_rate",
    baseRate: "15.00",
    appliesTo: "recruitment",
    isActive: true,
    payoutFrequency: "immediate",
    currency: "USD",
    createdAt: "2024-02-01",
  },
];

const mockTiers: CommissionTier[] = [
  {
    id: "1",
    ruleName: "Tiered Sales Performance",
    tierName: "Bronze Tier",
    minAmount: "0",
    maxAmount: "10000",
    commissionRate: "8.00",
  },
  {
    id: "2",
    ruleName: "Tiered Sales Performance",
    tierName: "Silver Tier",
    minAmount: "10000",
    maxAmount: "50000",
    commissionRate: "10.00",
    bonusAmount: "500.00",
  },
  {
    id: "3",
    ruleName: "Tiered Sales Performance",
    tierName: "Gold Tier",
    minAmount: "50000",
    commissionRate: "12.00",
    bonusAmount: "2000.00",
  },
];

export function CommissionSettingsTab() {
  const [rules, setRules] = useState<CommissionRule[]>(mockRules);
  const [tiers, setTiers] = useState<CommissionTier[]>(mockTiers);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const { toast } = useToast();

  const ruleForm = useForm<CommissionRuleFormData>({
    resolver: zodResolver(commissionRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      ruleType: "flat_rate",
      baseRate: "0",
      appliesTo: "all",
      minThreshold: "",
      isActive: true,
      payoutFrequency: "monthly",
      currency: "USD",
    },
  });

  const tierForm = useForm<CommissionTierFormData>({
    resolver: zodResolver(commissionTierSchema),
    defaultValues: {
      ruleName: "",
      tierName: "",
      minAmount: "0",
      maxAmount: "",
      commissionRate: "0",
      bonusAmount: "",
    },
  });

  const onSubmitRule = (data: CommissionRuleFormData) => {
    if (editingRule) {
      setRules(rules.map(rule => 
        rule.id === editingRule.id 
          ? { ...data, id: editingRule.id, createdAt: editingRule.createdAt } 
          : rule
      ));
      toast({
        title: "Rule Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newRule: CommissionRule = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRules([...rules, newRule]);
      toast({
        title: "Rule Created",
        description: `${data.name} has been created successfully.`,
      });
    }
    setRuleDialogOpen(false);
    setEditingRule(null);
    ruleForm.reset();
  };

  const onSubmitTier = (data: CommissionTierFormData) => {
    if (editingTier) {
      setTiers(tiers.map(tier => 
        tier.id === editingTier.id 
          ? { ...data, id: editingTier.id } 
          : tier
      ));
      toast({
        title: "Tier Updated",
        description: `${data.tierName} has been updated successfully.`,
      });
    } else {
      const newTier: CommissionTier = {
        ...data,
        id: Date.now().toString(),
      };
      setTiers([...tiers, newTier]);
      toast({
        title: "Tier Created",
        description: `${data.tierName} has been created successfully.`,
      });
    }
    setTierDialogOpen(false);
    setEditingTier(null);
    tierForm.reset();
  };

  const handleEditRule = (rule: CommissionRule) => {
    setEditingRule(rule);
    ruleForm.reset(rule);
    setRuleDialogOpen(true);
  };

  const handleEditTier = (tier: CommissionTier) => {
    setEditingTier(tier);
    tierForm.reset(tier);
    setTierDialogOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    toast({
      title: "Rule Deleted",
      description: `${rule?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleDeleteTier = (id: string) => {
    const tier = tiers.find(t => t.id === id);
    setTiers(tiers.filter(t => t.id !== id));
    toast({
      title: "Tier Deleted",
      description: `${tier?.tierName} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  return (
    <Tabs defaultValue="rules" className="space-y-4">
      <TabsList>
        <TabsTrigger value="rules">Commission Rules</TabsTrigger>
        <TabsTrigger value="tiers">Commission Tiers</TabsTrigger>
        <TabsTrigger value="settings">Payout Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="rules" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Commission Rules</CardTitle>
                  <CardDescription>Define commission structures and rates</CardDescription>
                </div>
              </div>
              <Dialog open={ruleDialogOpen} onOpenChange={(open) => {
                setRuleDialogOpen(open);
                if (!open) {
                  setEditingRule(null);
                  ruleForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingRule ? "Edit Commission Rule" : "Create Commission Rule"}</DialogTitle>
                    <DialogDescription>
                      {editingRule ? "Update the commission rule details below." : "Add a new commission rule."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...ruleForm}>
                    <form onSubmit={ruleForm.handleSubmit(onSubmitRule)} className="space-y-4">
                      <FormField
                        control={ruleForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rule Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Standard Sales Commission" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ruleForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description of this rule" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={ruleForm.control}
                          name="ruleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rule Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="flat_rate">Flat Rate</SelectItem>
                                  <SelectItem value="tiered">Tiered</SelectItem>
                                  <SelectItem value="performance_based">Performance Based</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ruleForm.control}
                          name="appliesTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Applies To</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="all">All Transactions</SelectItem>
                                  <SelectItem value="sales">Sales Only</SelectItem>
                                  <SelectItem value="recruitment">Recruitment Only</SelectItem>
                                  <SelectItem value="projects">Projects Only</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={ruleForm.control}
                          name="baseRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Rate (%)</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="10.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ruleForm.control}
                          name="minThreshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Threshold</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="1000.00" {...field} />
                              </FormControl>
                              <FormDescription>Optional minimum amount</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ruleForm.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <FormControl>
                                <Input placeholder="USD" maxLength={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={ruleForm.control}
                        name="payoutFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payout Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="immediate">Immediate</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ruleForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="!mt-0">Active</FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setRuleDialogOpen(false)}>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{rule.name}</span>
                        {rule.description && (
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{rule.ruleType.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{rule.baseRate}%</span>
                    </TableCell>
                    <TableCell className="capitalize">{rule.appliesTo}</TableCell>
                    <TableCell className="capitalize">{rule.payoutFrequency}</TableCell>
                    <TableCell>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Commission Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{rule.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
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
      </TabsContent>

      <TabsContent value="tiers" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Commission Tiers</CardTitle>
                  <CardDescription>Define tiered commission structures</CardDescription>
                </div>
              </div>
              <Dialog open={tierDialogOpen} onOpenChange={(open) => {
                setTierDialogOpen(open);
                if (!open) {
                  setEditingTier(null);
                  tierForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTier ? "Edit Commission Tier" : "Create Commission Tier"}</DialogTitle>
                    <DialogDescription>
                      {editingTier ? "Update the tier details below." : "Add a new commission tier."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...tierForm}>
                    <form onSubmit={tierForm.handleSubmit(onSubmitTier)} className="space-y-4">
                      <FormField
                        control={tierForm.control}
                        name="ruleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Associated Rule</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a rule" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rules.filter(r => r.ruleType === "tiered").map(rule => (
                                  <SelectItem key={rule.id} value={rule.name}>{rule.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={tierForm.control}
                        name="tierName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tier Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Gold Tier" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={tierForm.control}
                          name="minAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Amount</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={tierForm.control}
                          name="maxAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Amount</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="10000" {...field} />
                              </FormControl>
                              <FormDescription>Leave empty for unlimited</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={tierForm.control}
                          name="commissionRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commission Rate (%)</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="10.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={tierForm.control}
                          name="bonusAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bonus Amount</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="500.00" {...field} />
                              </FormControl>
                              <FormDescription>Optional bonus</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setTierDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingTier ? "Update" : "Create"} Tier
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
                  <TableHead>Rule</TableHead>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.ruleName}</TableCell>
                    <TableCell>{tier.tierName}</TableCell>
                    <TableCell>
                      ${tier.minAmount} - {tier.maxAmount ? `$${tier.maxAmount}` : "Unlimited"}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{tier.commissionRate}%</span>
                    </TableCell>
                    <TableCell>
                      {tier.bonusAmount ? `$${tier.bonusAmount}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTier(tier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Commission Tier</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{tier.tierName}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTier(tier.id)}>
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
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Configure global payout rules and settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Automatic Payouts</h4>
                  <p className="text-sm text-muted-foreground">Automatically process commission payouts</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Require Approval</h4>
                  <p className="text-sm text-muted-foreground">Require admin approval before payouts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Send email notifications for payouts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Default Payout Method</h4>
                <Select defaultValue="bank_transfer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Minimum Payout Amount</h4>
                <Input type="text" placeholder="50.00" defaultValue="50.00" />
                <p className="text-sm text-muted-foreground">Minimum amount required to process a payout</p>
              </div>
            </div>

            <Button className="w-full">Save Payout Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
