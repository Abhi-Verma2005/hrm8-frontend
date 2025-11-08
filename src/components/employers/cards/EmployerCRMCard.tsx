import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Employer } from "@/types/entities";
import { 
  UserCircle, 
  Mail, 
  Phone, 
  DollarSign,
  Tag,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";
import { SalesStageBadge } from "../badges/SalesStageBadge";
import { HealthScoreBadge } from "../badges/HealthScoreBadge";
import { PriorityBadge } from "../badges/PriorityBadge";
import { formatCurrency } from "@/lib/employerModuleUtils";

interface EmployerCRMCardProps {
  employer: Employer;
}

export function EmployerCRMCard({ employer }: EmployerCRMCardProps) {
  const { crm } = employer;
  
  const leadSourceLabels: Record<NonNullable<typeof crm.leadSource>, string> = {
    'website': 'Website',
    'referral': 'Referral',
    'cold-outreach': 'Cold Outreach',
    'event': 'Event',
    'partner': 'Partner',
    'other': 'Other'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCircle className="w-5 h-5" />
          CRM Information
        </CardTitle>
        <CardDescription>Client relationship management details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <SalesStageBadge stage={crm.salesStage} />
          <HealthScoreBadge score={crm.healthScore} />
          <PriorityBadge priority={crm.priority} />
        </div>

        {/* Primary Contact */}
        {crm.primaryContactName && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Primary Contact</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-muted-foreground" />
                <span>{crm.primaryContactName}</span>
              </div>
              {crm.primaryContactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${crm.primaryContactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {crm.primaryContactEmail}
                  </a>
                </div>
              )}
              {crm.primaryContactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`tel:${crm.primaryContactPhone}`}
                    className="text-primary hover:underline"
                  >
                    {crm.primaryContactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Manager */}
        {crm.accountManagerName && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Account Manager</span>
            </div>
            <span className="text-foreground">{crm.accountManagerName}</span>
          </div>
        )}

        {/* Assigned To */}
        {crm.assignedToName && crm.assignedToName !== crm.accountManagerName && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Assigned To</span>
            </div>
            <span className="text-foreground">{crm.assignedToName}</span>
          </div>
        )}

        {/* Lead Source */}
        {crm.leadSource && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Lead Source</span>
            </div>
            <Badge variant="outline" className="bg-muted">
              {leadSourceLabels[crm.leadSource]}
            </Badge>
          </div>
        )}

        {/* Lifetime Value */}
        {crm.lifetimeValue !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Lifetime Value</span>
            </div>
            <span className="font-semibold text-green-600">
              {formatCurrency(crm.lifetimeValue)}
            </span>
          </div>
        )}

        {/* Tags */}
        {crm.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {crm.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {crm.notes && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>Notes</span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{crm.notes}"
            </p>
          </div>
        )}

        {/* At Risk Warning */}
        {crm.salesStage === 'at-risk' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Account at Risk</p>
              <p className="text-xs">This account requires immediate attention to prevent churn.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
