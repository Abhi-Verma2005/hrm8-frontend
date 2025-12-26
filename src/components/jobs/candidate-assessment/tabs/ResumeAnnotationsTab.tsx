import { ResumeAnnotations } from '../ResumeAnnotations';

interface ResumeAnnotationsTabProps {
  candidateId: string;
}

export function ResumeAnnotationsTab({ candidateId }: ResumeAnnotationsTabProps) {
  return (
    <div className="space-y-6">
      <ResumeAnnotations
        candidateId={candidateId}
        resumeText="Sample resume text for annotations"
      />
    </div>
  );
}
