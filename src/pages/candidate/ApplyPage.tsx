/**
 * Apply Page
 * Page for submitting job applications
 */

import { useParams, useNavigate } from 'react-router-dom';
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
  );
}

