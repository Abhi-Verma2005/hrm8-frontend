import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ATSPricingComparisonTable() {
  const features = [
    { name: "Users", lite: "Unlimited", payg: "Unlimited", small: "Unlimited", medium: "Unlimited", large: "Unlimited", enterprise: "Unlimited" },
    { name: "Open Job Postings", lite: "Unlimited", payg: "Unlimited", small: "5", medium: "25", large: "50", enterprise: "Unlimited" },
    { name: "Core ATS Features", lite: true, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "AI Screening & Matching", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Custom Application Forms", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Team Collaboration", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Dedicated Talent Pool", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Branded Corporate Careers Page", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Multi-Post Job Board Marketplace", lite: "$", payg: "$", small: "$", medium: "$", large: "$", enterprise: "$", note: "Charges apply" },
    { name: "Post to HRM8 Job Board", lite: false, payg: "$", small: "$", medium: "$", large: "$", enterprise: "$", note: "Charges apply" },
    { name: "Direct Job Board Integration", lite: false, payg: "$", small: "$", medium: "$", large: "$", enterprise: "$", note: "Charges apply" },
    { name: "Post to Company Job Board accounts", lite: false, payg: false, small: false, medium: false, large: false, enterprise: false },
    { name: "Location Manager", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Department Manager", lite: false, payg: true, small: true, medium: true, large: true, enterprise: true },
    { name: "Division Manager", lite: false, payg: false, small: false, medium: false, large: false, enterprise: true },
    { name: "Reports & Analytics", lite: "Basic", payg: "Standard", small: "Advanced", medium: "Advanced", large: "Advanced", enterprise: "Advanced" },
    { name: "HRMS Integration", lite: false, payg: "$6/emp/mo", small: "$6/emp/mo", medium: "$6/emp/mo", large: "$6/emp/mo", enterprise: "$6/emp/mo", note: "Optional" },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
      );
    }
    
    if (value === "$") {
      return (
        <div className="flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
      );
    }
    
    if (value.includes("/emp/mo")) {
      return (
        <span className="text-sm text-muted-foreground">{value}</span>
      );
    }
    
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>ATS Subscription Pricing</CardTitle>
              <CardDescription>Compare features across all subscription tiers</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px] font-semibold">Feature</TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>ATS Lite</span>
                    <Badge variant="outline" className="text-xs">FREE</Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>PAYG</span>
                    <span className="text-sm font-normal text-muted-foreground">$195/mo*</span>
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>Small</span>
                    <span className="text-sm font-normal text-muted-foreground">$295/mo*</span>
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>Medium</span>
                    <span className="text-sm font-normal text-muted-foreground">$495/mo*</span>
                    <Badge variant="default" className="text-xs">Popular</Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>Large</span>
                    <span className="text-sm font-normal text-muted-foreground">$695/mo*</span>
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <span>Enterprise</span>
                    <span className="text-sm font-normal text-muted-foreground">$995/mo*</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{feature.name}</span>
                      {feature.note && (
                        <span className="text-xs text-muted-foreground italic">{feature.note}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{renderCell(feature.lite)}</TableCell>
                  <TableCell className="text-center">{renderCell(feature.payg)}</TableCell>
                  <TableCell className="text-center">{renderCell(feature.small)}</TableCell>
                  <TableCell className="text-center bg-primary/5">{renderCell(feature.medium)}</TableCell>
                  <TableCell className="text-center">{renderCell(feature.large)}</TableCell>
                  <TableCell className="text-center">{renderCell(feature.enterprise)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium">* Paid annually</p>
          <p>$ = Charges apply per usage</p>
          <p>All tiers include unlimited users</p>
          <p>HRMS Integration is optional add-on at $6 per employee per month</p>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm">
            Export to PDF
          </Button>
          <Button variant="outline" size="sm">
            Export to CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
