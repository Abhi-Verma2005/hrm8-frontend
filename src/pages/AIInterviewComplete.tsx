import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Video,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getRefereeByToken } from '@/lib/backgroundChecks/refereeStorage';
import { getAISessionsByReferee } from '@/lib/backgroundChecks/aiReferenceCheckStorage';
import type { AIReferenceCheckSession } from '@/types/aiReferenceCheck';
import type { RefereeDetails } from '@/types/referee';

export default function AIInterviewComplete() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIReferenceCheckSession | null>(null);
  const [referee, setReferee] = useState<RefereeDetails | null>(null);

  useEffect(() => {
    loadSessionData();
  }, [token]);

  const loadSessionData = async () => {
    if (!token) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    try {
      const foundReferee = getRefereeByToken(token);
      if (!foundReferee) {
        setError('Session not found');
        setLoading(false);
        return;
      }

      const sessions = getAISessionsByReferee(foundReferee.id);
      const completedSession = sessions.find(s => s.status === 'completed');

      if (!completedSession) {
        setError('Interview not completed');
        setLoading(false);
        return;
      }

      setReferee(foundReferee);
      setSession(completedSession);
      setLoading(false);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session data');
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading session details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-2">Unable to Load Session</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!session || !referee) return null;

  const interviewIcon = session.mode === 'video' ? Video : Phone;
  const InterviewIcon = interviewIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-bold">Interview Complete!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for completing the AI reference check
            </p>
          </div>
        </div>

        {/* Confirmation Message */}
        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-semibold">Your Responses Have Been Recorded</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your reference interview has been successfully completed and securely saved. 
                The audio recording, transcript, and AI analysis will be shared with the requesting 
                organization to help them make an informed hiring decision about the candidate.
              </p>
            </div>
          </div>
        </Card>

        {/* Session Summary */}
        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h2 className="text-lg font-semibold mb-4">Interview Summary</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  <InterviewIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Interview Mode</p>
                  <p className="font-medium">
                    {session.mode === 'video' ? 'Video Interview' : 'Phone Interview'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(session.duration)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Questions</p>
                  <p className="font-medium">
                    {session.transcript?.turns.filter(t => t.speaker === 'referee').length || 0} responses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="default" className="bg-green-600">Completed</Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed At</span>
                <span className="font-medium">{formatDate(session.completedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referee Name</span>
                <span className="font-medium">{referee.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referee Email</span>
                <span className="font-medium">{referee.email}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* What Happens Next */}
        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450">
          <h2 className="text-lg font-semibold mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                1
              </div>
              <div>
                <p className="font-medium mb-1">AI Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Your responses are being analyzed by AI to extract key insights about the candidate's 
                  professional capabilities and performance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                2
              </div>
              <div>
                <p className="font-medium mb-1">Report Generation</p>
                <p className="text-sm text-muted-foreground">
                  A comprehensive reference report will be generated, including your transcript, 
                  audio recording, and AI-derived insights.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                3
              </div>
              <div>
                <p className="font-medium mb-1">Shared with Organization</p>
                <p className="text-sm text-muted-foreground">
                  The reference report will be shared with the requesting organization to help 
                  them make their hiring decision.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Data */}
        <Card className="p-6 bg-muted/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Privacy & Data Retention</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Your interview data is securely encrypted and stored</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Data will be retained for 24 months as per our retention policy</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>You can request data deletion by contacting support</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>All processing complies with GDPR and data protection regulations</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-6 border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Need Help or Have Questions?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you have any questions about this reference check or would like to make changes 
                to your responses, please contact our support team.
              </p>
              <a 
                href="mailto:support@hrm8.com" 
                className="text-sm font-medium text-primary hover:underline"
              >
                support@hrm8.com
              </a>
            </div>
          </div>
        </Card>

        {/* Footer Message */}
        <div className="text-center text-sm text-muted-foreground pt-4 animate-in fade-in duration-700 delay-1000">
          <p>
            Thank you for taking the time to provide this reference. You may now close this window.
          </p>
        </div>
      </div>
    </div>
  );
}
