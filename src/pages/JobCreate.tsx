import { Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JobWizard } from "@/components/jobs/JobWizard";

export default function JobCreate() {
  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Job</h1>
            <p className="text-muted-foreground">Post a new job opening to attract top talent</p>
          </div>
        </div>
        <JobWizard />
      </div>
    </DashboardPageLayout>
  );
}
