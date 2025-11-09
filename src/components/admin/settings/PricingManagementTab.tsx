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
import { ATSPricingComparisonTable } from "./ATSPricingComparisonTable";

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
          <ATSPricingComparisonTable />
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
