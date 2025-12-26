import { RecruitmentService } from '@/types/pricing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteRecruitmentService } from '@/lib/pricingStorage';
import { useToast } from '@/hooks/use-toast';

interface RecruitmentServiceListProps {
  services: RecruitmentService[];
  onEdit: (service: RecruitmentService) => void;
}

export function RecruitmentServiceList({ services, onEdit }: RecruitmentServiceListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<RecruitmentService | null>(null);
  const { toast } = useToast();

  const handleDelete = (service: RecruitmentService) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteRecruitmentService(serviceToDelete.id);
      toast({
        title: 'Recruitment service deleted',
        description: `${serviceToDelete.name} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      window.location.reload();
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'shortlisting': 'Shortlisting',
      'full-service': 'Full Service',
      'executive-search': 'Executive Search',
      'rpo': 'RPO',
    };
    return labels[type] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'shortlisting': 'bg-blue-500/10 text-blue-500',
      'full-service': 'bg-purple-500/10 text-purple-500',
      'executive-search': 'bg-orange-500/10 text-orange-500',
      'rpo': 'bg-green-500/10 text-green-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      draft: 'bg-yellow-500/10 text-yellow-500',
      archived: 'bg-gray-500/10 text-gray-500',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No recruitment services found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">Service Name</th>
              <th className="p-4 text-left font-medium">Type</th>
              <th className="p-4 text-left font-medium">Pricing</th>
              <th className="p-4 text-left font-medium">Duration</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={getServiceTypeColor(service.serviceType)} variant="secondary">
                    {getServiceTypeLabel(service.serviceType)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {service.baseFee > 0 && <div>Base: £{service.baseFee.toLocaleString()}</div>}
                    {service.percentageFee && <div>{service.percentageFee}% of salary</div>}
                    {service.minFee && <div className="text-muted-foreground">Min: £{service.minFee.toLocaleString()}</div>}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {service.estimatedDuration || 'Variable'}
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(service.status)} variant="secondary">
                    {service.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(service)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Recruitment Service"
        itemName={serviceToDelete?.name}
      />
    </>
  );
}
