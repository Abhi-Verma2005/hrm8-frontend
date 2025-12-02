/**
 * Apply Page
 * Page for submitting job applications
 */

import { useParams, useNavigate } from 'react-router-dom';
import { JobApplicationForm } from '@/components/candidate/JobApplicationForm';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <CandidatePageLayout
        title="Apply"
        subtitle="Invalid job ID"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Invalid job ID</p>
        </div>
      </CandidatePageLayout>
    );
  }

  return (
    <CandidatePageLayout
      title="Apply for Job"
      subtitle="Submit your application"
    >
      <div className="p-6">
        <div className="container mx-auto max-w-3xl">
          <JobApplicationForm
            jobId={id}
            onSuccess={(applicationId) => {
              navigate(`/candidate/applications/${applicationId}/confirmation`);
            }}
          />
        </div>
      </div>
    </CandidatePageLayout>
  );
}

