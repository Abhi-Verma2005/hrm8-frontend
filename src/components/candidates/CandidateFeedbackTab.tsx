import { CollaborativeFeedbackPanel } from '@/components/feedback/CollaborativeFeedbackPanel';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface CandidateFeedbackTabProps {
  candidateId: string;
  candidateName: string;
}

export function CandidateFeedbackTab({ candidateId, candidateName }: CandidateFeedbackTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Team Feedback & Evaluation</h3>
      </div>
      
      <CollaborativeFeedbackPanel
        candidateId={candidateId}
        candidateName={candidateName}
      />
    </div>
  );
}
