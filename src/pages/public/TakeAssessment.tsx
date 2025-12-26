import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { QuestionRenderer } from '@/components/candidate/assessment/QuestionRenderer';
import type { Question } from '@/lib/candidateAssessmentService';

export default function TakeAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<{
    id: string;
    status: string;
    expiryDate?: string;
    passThreshold?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[] | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid assessment link');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await apiClient.get<{ assessment: { id: string; status: string; expiryDate?: string; passThreshold?: number }; questions: Question[] }>(`/api/public/assessment/${token}`);
        if (!res.success || !res.data) {
          setError('Assessment not found or link is invalid');
          setLoading(false);
          return;
        }
        const a = res.data.assessment;
        setAssessment({
          id: a.id,
          status: a.status,
          expiryDate: a.expiryDate,
          passThreshold: a.passThreshold,
        });
        setQuestions(res.data.questions || []);
        if (a.status === 'IN_PROGRESS') {
          setStarted(true);
        }
      } catch {
        setError('Assessment not found or link is invalid');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleStart = async () => {
    if (!assessment) return;
    try {
      const res = await apiClient.post(`/api/public/assessment/${token}/start`, {});
      if (res.success) {
        setStarted(true);
      } else {
        setError('Unable to start assessment');
      }
    } catch {
      setError('Unable to start assessment');
    }
  };

  const handleComplete = async () => {
    if (!assessment || !token) return;
    setSubmitting(true);
    try {
      const formatted = Object.entries(answers).map(([questionId, response]) => ({ questionId, response }));
      const res = await apiClient.post(`/api/public/assessment/${token}/submit`, { responses: formatted });
      if (res.success) {
        setCompleted(true);
      } else {
        setError('Failed to submit assessment');
        setSubmitting(false);
      }
    } catch {
      setError('Failed to submit assessment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground transition-colors duration-500">Loading assessment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base font-semibold">Assessment Unavailable</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground transition-colors duration-500">{error}</p>
            <p className="text-sm text-muted-foreground transition-colors duration-500">
              If you believe this is an error, please contact the organization that sent you this assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const assessmentInfo = null;

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Assessment Completed!</CardTitle>
            <CardDescription>Thank you for completing the assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Your results have been submitted and will be reviewed by the hiring team.
                You will be notified of the next steps via email.
              </AlertDescription>
            </Alert>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground transition-colors duration-500">
                You can now close this window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Assessment</CardTitle>
              <CardDescription>Answer the questions and submit when finished</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="rounded-lg border p-4">
                    <div className="font-medium mb-2">{q.questionText}</div>
                    <QuestionRenderer
                      question={q}
                      value={answers[q.id]}
                      onChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                    />
                  </div>
                ))}
              </div>

            <div className="flex justify-end">
              <Button onClick={handleComplete} size="lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Complete Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Assessment Invitation</CardTitle>
          <CardDescription>Click start to begin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 transition-colors duration-500">Candidate Information</h3>
              <div className="text-sm text-muted-foreground space-y-1 transition-colors duration-500">
                <p>Expires: {assessment.expiryDate ? format(new Date(assessment.expiryDate), 'PPP') : 'N/A'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 transition-colors duration-500">Assessment Details</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground transition-colors duration-500">
                    Questions: {questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground transition-colors duration-500">
                    Pass Threshold: {assessment.passThreshold ?? 'N/A'}%
                  </span>
                </div>
                
              </div>
            </div>

            <div className="rounded-lg border bg-muted p-4 transition-[background,border-color,box-shadow,color] duration-500">
              <h3 className="font-medium mb-2 transition-colors duration-500">Instructions</h3>
              <p className="text-sm text-muted-foreground transition-colors duration-500">
                Start when you are ready. Answer all questions and submit your responses.
              </p>
              
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Once you start the assessment, you must complete it in one sitting.
              Make sure you have enough time and are in a quiet environment.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleStart} size="lg">
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
