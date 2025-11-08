import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EmployerFormWizard } from '@/components/employers/EmployerFormWizard';
import { getEmployerById, updateEmployer } from '@/lib/employerService';
import { Employer } from '@/types/entities';

export default function EmployerEdit() {
  const navigate = useNavigate();
  const { employerId } = useParams<{ employerId: string }>();
  const employer = employerId ? getEmployerById(employerId) : null;

  if (!employer) {
    return <Navigate to="/employers" replace />;
  }

  const handleSave = async (data: Partial<Employer>) => {
    updateEmployer(employer.id, data);
    navigate(`/employers/${employer.id}`);
  };

  const handleCancel = () => {
    navigate(`/employers/${employer.id}`);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Employer</h1>
          <p className="text-muted-foreground">
            Update employer information
          </p>
        </div>

        <EmployerFormWizard
          employer={employer}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardPageLayout>
  );
}
