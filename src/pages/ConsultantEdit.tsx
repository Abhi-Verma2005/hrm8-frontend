import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { ConsultantFormWizard } from '@/components/consultants/ConsultantFormWizard';
import { getConsultantById, updateConsultant } from '@/lib/consultantStorage';
import { Consultant } from '@/types/consultant';

export default function ConsultantEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const consultant = id ? getConsultantById(id) : null;

  if (!consultant) {
    return <Navigate to="/consultants" replace />;
  }

  const handleSave = async (data: Partial<Consultant>) => {
    updateConsultant(consultant.id, data);
    navigate(`/consultants/${consultant.id}`);
  };

  const handleCancel = () => {
    navigate(`/consultants/${consultant.id}`);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Consultant</h1>
          <p className="text-muted-foreground">
            Update consultant information
          </p>
        </div>

        <ConsultantFormWizard
          consultant={consultant}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardPageLayout>
  );
}
