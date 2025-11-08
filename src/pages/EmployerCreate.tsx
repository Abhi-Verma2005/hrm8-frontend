import { useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EmployerFormWizard } from '@/components/employers/EmployerFormWizard';
import { createEmployer } from '@/lib/employerService';
import { Employer } from '@/types/entities';

export default function EmployerCreate() {
  const navigate = useNavigate();

  const handleSave = async (data: Partial<Employer>) => {
    const newEmployer = createEmployer(data as Omit<Employer, 'id' | 'createdAt' | 'updatedAt'>);
    navigate('/employers');
  };

  const handleCancel = () => {
    navigate('/employers');
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Employer</h1>
          <p className="text-muted-foreground">
            Complete the form below to add a new employer account
          </p>
        </div>

        <EmployerFormWizard onSave={handleSave} onCancel={handleCancel} />
      </div>
    </DashboardPageLayout>
  );
}
