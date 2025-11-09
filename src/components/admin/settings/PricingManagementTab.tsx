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
import { Plus, Edit, Trash2, DollarSign, Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
    </div>
  );
}
