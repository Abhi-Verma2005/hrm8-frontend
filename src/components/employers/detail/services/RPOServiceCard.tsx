import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Users, Target, Mail } from "lucide-react";
import { ServiceStatusBadge } from "@/components/recruitment-services/ServiceStatusBadge";
import type { ServiceProject } from "@/types/recruitmentService";
import { calculateRPOProgress } from "@/lib/rpoServiceStorage";
import { format } from "date-fns";
import { getEmployerContacts } from "@/lib/employerContactStorage";

interface RPOServiceCardProps {
  service: ServiceProject;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

export function RPOServiceCard({ service, onEdit, onViewDetails }: RPOServiceCardProps) {
  const { overallProgress } = calculateRPOProgress(service);
  
  // Get primary fee structures to display (max 2)
  const primaryFees = service.rpoFeeStructures?.slice(0, 2) || [];
  
  // Get primary contact details if available
  const contacts = getEmployerContacts(service.clientId);
  const primaryContact = service.rpoPrimaryContactId 
    ? contacts.find(c => c.id === service.rpoPrimaryContactId)
    : null;
  
  // Check if using custom pricing
  const isCustomPricing = service.rpoIsCustomPricing || false;
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-300">
                RPO
              </Badge>
              {isCustomPricing && (
                <Badge variant="secondary" className="text-xs">
                  Custom Pricing
                </Badge>
              )}
              <ServiceStatusBadge status={service.status} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {service.clientName} • Started {format(new Date(service.rpoStartDate || service.startDate), 'MMM d, yyyy')}
              </p>
              {primaryContact && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>
                    {primaryContact.firstName} {primaryContact.lastName} ({primaryContact.title})
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Contract Duration */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contract Period</span>
          <span className="font-medium">
            {format(new Date(service.rpoStartDate || service.startDate), 'MMM d, yyyy')} - {' '}
            {format(new Date(service.rpoEndDate || service.deadline), 'MMM d, yyyy')} 
            <span className="text-muted-foreground ml-1">
              ({service.rpoDuration || 12} months)
            </span>
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Fee Structures */}
        {primaryFees.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {primaryFees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{fee.name}</span>
                <span className="font-semibold">
                  ${fee.amount.toLocaleString()}
                  {fee.frequency && fee.frequency !== 'one-time' && (
                    <span className="text-muted-foreground text-xs ml-1">
                      /{fee.frequency === 'monthly' ? 'mth' : 
                        fee.frequency === 'quarterly' ? 'qtr' : 
                        fee.frequency === 'per-placement' ? 'placement' : ''}
                    </span>
                  )}
                </span>
              </div>
            ))}
            {service.rpoTotalContractValue && (
              <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t">
                <span>Total Contract Value</span>
                <span className="text-lg">
                  ${service.rpoTotalContractValue.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Team & Metrics */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {service.consultants.slice(0, 3).map((consultant) => (
                  <Avatar key={consultant.id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {service.consultants.length > 3 && (
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      +{service.consultants.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>
                {service.candidatesShortlisted} shortlisted, {service.candidatesInterviewed} interviewed
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}
