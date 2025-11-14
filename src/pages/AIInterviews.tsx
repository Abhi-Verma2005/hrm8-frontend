import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { AIInterviewList } from '@/components/aiInterview/common/AIInterviewList';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';
import { getAIInterviewSessions, saveAIInterviewSession } from '@/lib/aiInterview/aiInterviewStorage';
import { generateMockSessions } from '@/lib/aiInterview/mockData';
import type { AIInterviewSession } from '@/types/aiInterview';

export default function AIInterviews() {
  const navigate = useNavigate();

  useEffect(() => {
    const sessions = getAIInterviewSessions();
    if (sessions.length === 0) {
      generateMockSessions().forEach(saveAIInterviewSession);
    }
  }, []);

  const sessions = getAIInterviewSessions();

  const handleViewDetails = (session: AIInterviewSession) => {
    navigate(`/ai-interviews/${session.id}`);
  };

  const handleStartInterview = (session: AIInterviewSession) => {
    navigate(`/ai-interviews/session/${session.invitationToken}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="AI Interviews"
        description="AI-powered interviews for efficient candidate screening"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/ai-interviews/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button onClick={() => navigate('/ai-interviews/schedule')}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        }
      />

      <AIInterviewList
        sessions={sessions}
        onViewDetails={handleViewDetails}
        onStartInterview={handleStartInterview}
      />
    </div>
  );
}
