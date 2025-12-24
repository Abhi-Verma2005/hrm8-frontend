/**
 * Apply Page
 * Page for submitting job applications
 */

import { useParams, useNavigate } from 'react-router-dom';
import { JobApplicationForm } from '@/components/candidate/JobApplicationForm';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { PublicCandidatePageLayout } from '@/components/layouts/PublicCandidatePageLayout';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useCandidateAuth();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid job ID</p>
      </div>
    );
  }

  const Layout = isAuthenticated ? CandidatePageLayout : PublicCandidatePageLayout;

  return (
    <Layout showSidebarTrigger={false}>
      <div className="p-6 space-y-6">
        <div className="max-w-3xl mx-auto">
        <JobApplicationForm
          jobId={id}
          onSuccess={(applicationId) => {
              if (applicationId) {
            navigate(`/candidate/applications/${applicationId}/confirmation`);
              } else {
                navigate(`/candidate/applications/confirmation`);
              }
          }}
        />
      </div>
    </div>
    </Layout>
  );
}

