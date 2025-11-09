import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, DollarSign, Check, Info } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RECRUITMENT_SERVICES, ADDON_SERVICES, PRICING_NOTES } from "@/lib/subscriptionConfig";

const pricingTierSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().trim().max(200, "Description must be less than 200 characters").optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").refine((val) => parseFloat(val) >= 0, "Price must be positive"),
  billingPeriod: z.enum(["monthly", "yearly", "lifetime"]),
  currency: z.string().min(3, "Currency code is required").max(3, "Invalid currency code"),
  isActive: z.boolean(),
  features: z.string().trim().max(1000, "Features must be less than 1000 characters"),
  maxUsers: z.string().regex(/^\d+$/, "Must be a number").optional(),
  isPopular: z.boolean(),
});

type PricingTierFormData = z.infer<typeof pricingTierSchema>;

interface PricingTier extends PricingTierFormData {
  id: string;
}

const mockTiers: PricingTier[] = [
  {
    id: "1",
    name: "Free",
    description: "Perfect for individuals getting started",
    price: "0",
    billingPeriod: "monthly",
    currency: "USD",
    isActive: true,
    features: "1 user\n5 projects\nBasic support\n1GB storage",
    maxUsers: "1",
    isPopular: false,
  },
  {
    id: "2",
    name: "Pro",
    description: "For growing teams and businesses",
    price: "29",
    billingPeriod: "monthly",
    currency: "USD",
    isActive: true,
    features: "10 users\nUnlimited projects\nPriority support\n100GB storage\nAdvanced analytics",
    maxUsers: "10",
    isPopular: true,
  },
  {
    id: "3",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: "99",
    billingPeriod: "monthly",
    currency: "USD",
    isActive: true,
    features: "Unlimited users\nUnlimited projects\n24/7 support\nUnlimited storage\nCustom integrations\nDedicated account manager",
    maxUsers: "999999",
    isPopular: false,
  },
];

export function PricingManagementTab() {
  const [tiers, setTiers] = useState<PricingTier[]>(mockTiers);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PricingTierFormData>({
    resolver: zodResolver(pricingTierSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      billingPeriod: "monthly",
      currency: "USD",
      isActive: true,
      features: "",
      maxUsers: "",
      isPopular: false,
    },
  });

  const onSubmit = (data: PricingTierFormData) => {
    if (editingTier) {
      setTiers(tiers.map(tier => 
        tier.id === editingTier.id 
          ? { ...data, id: editingTier.id } 
          : tier
      ));
      toast({
        title: "Tier Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newTier: PricingTier = {
        ...data,
        id: Date.now().toString(),
      };
      setTiers([...tiers, newTier]);
      toast({
        title: "Tier Created",
        description: `${data.name} has been created successfully.`,
      });
    }
    setDialogOpen(false);
    setEditingTier(null);
    form.reset();
  };

  const handleEdit = (tier: PricingTier) => {
    setEditingTier(tier);
    form.reset(tier);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const tier = tiers.find(t => t.id === id);
    setTiers(tiers.filter(t => t.id !== id));
    toast({
      title: "Tier Deleted",
      description: `${tier?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTier(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Pricing Management</CardTitle>
              <CardDescription>Configure pricing for ATS subscriptions, HRMS add-on, additional services, and recruitment services</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ats">ATS Subscriptions</TabsTrigger>
          <TabsTrigger value="addons">Additional Services</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment Services</TabsTrigger>
          <TabsTrigger value="notes">Pricing Notes</TabsTrigger>
        </TabsList>

        {/* ATS Subscriptions Tab */}
        <TabsContent value="ats">
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Pricing Tiers</CardTitle>
                <CardDescription>Manage subscription plans and pricing</CardDescription>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingTier ? "Edit Pricing Tier" : "Create Pricing Tier"}</DialogTitle>
                  <DialogDescription>
                    {editingTier ? "Update the pricing tier details below." : "Add a new pricing tier for your subscription plans."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tier Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Pro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="29.99" {...field} />
                            </FormControl>
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
                            <Input placeholder="Brief description of this tier" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Period</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="lifetime">Lifetime</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
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
                      control={form.control}
                      name="maxUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Users</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="10" {...field} />
                          </FormControl>
                          <FormDescription>Leave empty for unlimited</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter features (one per line)&#10;e.g.,&#10;Unlimited projects&#10;Priority support&#10;Advanced analytics"
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>One feature per line</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-6">
                      <FormField
                        control={form.control}
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
                      <FormField
                        control={form.control}
                        name="isPopular"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="!mt-0">Popular (Featured)</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
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
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tier.name}</span>
                      {tier.isPopular && (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    {tier.description && (
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{tier.currency} ${tier.price}</span>
                  </TableCell>
                  <TableCell className="capitalize">{tier.billingPeriod}</TableCell>
                  <TableCell>{tier.maxUsers ? tier.maxUsers : "Unlimited"}</TableCell>
                  <TableCell>
                    <Badge variant={tier.isActive ? "default" : "secondary"}>
                      {tier.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tier)}
                      >
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
                            <AlertDialogTitle>Delete Pricing Tier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{tier.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(tier.id)}>
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

        {/* Additional Services Tab */}
        <TabsContent value="addons" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate Assessments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Candidate Assessments</span>
                  <Badge variant="secondary">Assessment-based</Badge>
                </CardTitle>
                <CardDescription>{ADDON_SERVICES.assessments.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Pricing Model:</span>
                  <span className="text-sm">Variable by type</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Configure Pricing
                </Button>
              </CardContent>
            </Card>

            {/* Reference Checking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Reference Checking</span>
                  <Badge variant="secondary">$69/candidate</Badge>
                </CardTitle>
                <CardDescription>{ADDON_SERVICES.referenceChecking.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Per Candidate:</span>
                  <span className="text-lg font-bold">${ADDON_SERVICES.referenceChecking.perCandidateCost}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pricing
                </Button>
              </CardContent>
            </Card>

            {/* Video Interviewing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Video Interviewing</span>
                  <Badge variant="secondary">$99/job</Badge>
                </CardTitle>
                <CardDescription>{ADDON_SERVICES.videoInterviewing.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Per Job:</span>
                  <span className="text-lg font-bold">${ADDON_SERVICES.videoInterviewing.perJobCost}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pricing
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recruitment Services Tab */}
        <TabsContent value="recruitment">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Services Pricing</CardTitle>
              <CardDescription>Configure pricing for on-demand recruitment services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Base Fee</TableHead>
                    <TableHead>Upfront</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium">{RECRUITMENT_SERVICES.shortlisting.name}</div>
                        <div className="text-sm text-muted-foreground">Per vacancy</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${RECRUITMENT_SERVICES.shortlisting.baseFee.toLocaleString()}</TableCell>
                    <TableCell>{(RECRUITMENT_SERVICES.shortlisting.upfrontPercentage * 100)}%</TableCell>
                    <TableCell><Badge variant="outline">Standard</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium">{RECRUITMENT_SERVICES['full-service'].name}</div>
                        <div className="text-sm text-muted-foreground">Per vacancy</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${RECRUITMENT_SERVICES['full-service'].baseFee.toLocaleString()}</TableCell>
                    <TableCell>{(RECRUITMENT_SERVICES['full-service'].upfrontPercentage * 100)}%</TableCell>
                    <TableCell><Badge variant="outline">Standard</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium">{RECRUITMENT_SERVICES['executive-search'].name} (≤$100k)</div>
                        <div className="text-sm text-muted-foreground">Per vacancy</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${RECRUITMENT_SERVICES['executive-search'].baseFeeUnder100k.toLocaleString()}</TableCell>
                    <TableCell>{(RECRUITMENT_SERVICES['executive-search'].upfrontPercentage * 100)}%</TableCell>
                    <TableCell><Badge variant="outline">Standard</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium">{RECRUITMENT_SERVICES['executive-search'].name} (&gt;$100k)</div>
                        <div className="text-sm text-muted-foreground">Per vacancy</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${RECRUITMENT_SERVICES['executive-search'].baseFeeOver100k.toLocaleString()}</TableCell>
                    <TableCell>{(RECRUITMENT_SERVICES['executive-search'].upfrontPercentage * 100)}%</TableCell>
                    <TableCell><Badge variant="outline">Standard</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-orange-50/50 dark:bg-orange-950/10">
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {RECRUITMENT_SERVICES.rpo.name}
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-300">
                            Tailored
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{RECRUITMENT_SERVICES.rpo.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold">${RECRUITMENT_SERVICES.rpo.baseMonthlyPerConsultant.toLocaleString()}/consultant/mo</div>
                        <div className="text-sm text-muted-foreground">+ ${RECRUITMENT_SERVICES.rpo.basePerVacancy.toLocaleString()}/vacancy</div>
                      </div>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Info className="h-3 w-3" />
                        Guide Price
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {/* RPO Note */}
              <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                    <p className="font-medium">RPO Pricing Model</p>
                    <p className="text-xs">{RECRUITMENT_SERVICES.rpo.note}</p>
                    <p className="text-xs">Min contract: {RECRUITMENT_SERVICES.rpo.minimumContract} months | Min consultants: {RECRUITMENT_SERVICES.rpo.minimumConsultants}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Notes & Guidelines</CardTitle>
              <CardDescription>Important information about pricing structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.annualPayment}</p>
                    <p className="text-sm text-muted-foreground mt-1">All ATS subscription fees are billed annually</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.hrmsBlocks}</p>
                    <p className="text-sm text-muted-foreground mt-1">HRMS is charged at $6/employee in blocks of 50 employees, billed annually</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.optionalServices}</p>
                    <p className="text-sm text-muted-foreground mt-1">Additional services like assessments, reference checking, and video interviewing are optional add-ons</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.currency}</p>
                    <p className="text-sm text-muted-foreground mt-1">All prices shown in USD</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                  <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">{PRICING_NOTES.rpoCustom}</p>
                    <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">RPO pricing is customized based on volume, duration, and specific requirements of each employer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
