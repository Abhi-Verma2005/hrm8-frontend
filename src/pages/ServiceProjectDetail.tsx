import { useParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getServiceProjectById } from '@/lib/recruitmentServiceStorage';

export default function ServiceProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = id ? getServiceProjectById(id) : null;

  if (!id || !project) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <Button onClick={() => navigate('/recruitment-services')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/recruitment-services')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.clientName}</p>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-muted/50 rounded-lg p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Service Project Detail Page</h2>
          <p className="text-muted-foreground">
            This detailed view is coming soon and will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground max-w-md mx-auto text-left">
            <li>• Project overview and timeline</li>
            <li>• Team members and assignments</li>
            <li>• Candidate pipeline and progress</li>
            <li>• Tasks and milestones</li>
            <li>• Activity history</li>
            <li>• Documents and communications</li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Project Data:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
