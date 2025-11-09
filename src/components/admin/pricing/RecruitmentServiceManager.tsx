import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RecruitmentService } from '@/types/pricing';
import { getRecruitmentServices } from '@/lib/pricingStorage';
import { RecruitmentServiceList } from './RecruitmentServiceList';
import { RecruitmentServiceDialog } from './RecruitmentServiceDialog';

export function RecruitmentServiceManager() {
  const [services, setServices] = useState<RecruitmentService[]>(getRecruitmentServices());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<RecruitmentService | undefined>();

  const handleCreate = () => {
    setSelectedService(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (service: RecruitmentService) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setServices(getRecruitmentServices());
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg md:text-xl">Recruitment Services</CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage recruitment service offerings and pricing</CardDescription>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto touch-manipulation min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <RecruitmentServiceList services={services} onEdit={handleEdit} />
        <RecruitmentServiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          service={selectedService}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
}
