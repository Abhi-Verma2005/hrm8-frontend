import { useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { ConsultantFormWizard } from '@/components/consultants/ConsultantFormWizard';
import { createConsultant } from '@/lib/consultantStorage';
import { Consultant } from '@/types/consultant';

export default function ConsultantCreate() {
  const navigate = useNavigate();

  const handleSave = async (data: Partial<Consultant>) => {
    const newConsultant = createConsultant(data as Omit<Consultant, 'id' | 'createdAt' | 'updatedAt'>);
    navigate('/consultants');
  };

  const handleCancel = () => {
    navigate('/consultants');
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Consultant</h1>
          <p className="text-muted-foreground">
            Complete the form below to add a new consultant to your team
          </p>
        </div>

        <ConsultantFormWizard onSave={handleSave} onCancel={handleCancel} />
      </div>
    </DashboardPageLayout>
  );
}
