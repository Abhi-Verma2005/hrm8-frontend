import { Badge } from "@/components/ui/badge";
import { DocumentType } from "@/types/employerCRM";
import { cn } from "@/lib/utils";

interface DocumentTypeBadgeProps {
  type: DocumentType;
}

const typeConfig: Record<DocumentType, { label: string; className: string }> = {
  'contract': {
    label: 'Contract',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  'proposal': {
    label: 'Proposal',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'agreement': {
    label: 'Agreement',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  'invoice': {
    label: 'Invoice',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'msa': {
    label: 'MSA',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  'other': {
    label: 'Other',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

export function DocumentTypeBadge({ type }: DocumentTypeBadgeProps) {
  const config = typeConfig[type];
  
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}
