import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JobWizard } from "@/components/jobs/JobWizard";
import { ServiceTypeSelectionDialog } from "@/components/jobs/ServiceTypeSelectionDialog";

export default function JobCreate() {
  const navigate = useNavigate();
  const [showServiceDialog, setShowServiceDialog] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | null>(null);

  const handleServiceTypeSelect = (serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search') => {
    setSelectedServiceType(serviceType);
    setShowServiceDialog(false);
  };

  return (
    <DashboardPageLayout>
      <ServiceTypeSelectionDialog 
        open={showServiceDialog}
        onServiceTypeSelect={handleServiceTypeSelect}
      />
      
      {selectedServiceType && (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/jobs')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Job</h1>
              <p className="text-muted-foreground">Post a new job opening to attract top talent</p>
            </div>
          </div>
          <JobWizard serviceType={selectedServiceType} />
        </div>
      )}
    </DashboardPageLayout>
  );
}
