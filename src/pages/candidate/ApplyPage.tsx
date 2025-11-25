/**
 * Apply Page
 * Page for submitting job applications
 */

import { useParams, useNavigate } from 'react-router-dom';
import { CandidateAuthGuard } from '@/components/auth/CandidateAuthGuard';
import { JobApplicationForm } from '@/components/candidate/JobApplicationForm';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid job ID</p>
      </div>
    );
  }

  return (
    <CandidateAuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <JobApplicationForm
            jobId={id}
            onSuccess={(applicationId) => {
              navigate(`/candidate/applications/${applicationId}/confirmation`);
            }}
          />
        </div>
      </div>
    </CandidateAuthGuard>
  );
}

