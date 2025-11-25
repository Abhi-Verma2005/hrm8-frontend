import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAssessmentByToken, updateAssessment } from '@/lib/mockAssessmentStorage';
import { ASSESSMENT_PRICING } from '@/lib/assessments/pricingConstants';
import type { Assessment } from '@/types/assessment';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function TakeAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid assessment link');
      setLoading(false);
      return;
    }

    const foundAssessment = getAssessmentByToken(token);
    
    if (!foundAssessment) {
      setError('Assessment not found or link is invalid');
      setLoading(false);
      return;
    }

    // Check if expired
    const now = new Date();
    const expiryDate = new Date(foundAssessment.expiryDate);
    if (now > expiryDate) {
      setError('This assessment has expired');
      setLoading(false);
      return;
    }

    // Check if already completed
    if (foundAssessment.status === 'completed') {
      setError('This assessment has already been completed');
      setLoading(false);
      return;
    }

    // Check if cancelled
    if (foundAssessment.status === 'cancelled') {
      setError('This assessment has been cancelled');
      setLoading(false);
      return;
    }

    setAssessment(foundAssessment);
    setLoading(false);
  }, [token]);

  const handleStart = () => {
    if (!assessment) return;

    // Update status to in-progress
    updateAssessment(assessment.id, {
      status: 'in-progress',
    });

    setStarted(true);
  };

  const handleComplete = () => {
    if (!assessment) return;

    // Simulate assessment completion with mock results
    const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const passed = mockScore >= assessment.passThreshold;

    updateAssessment(assessment.id, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      overallScore: mockScore,
      passed,
      result: {
        assessmentType: assessment.assessmentType,
        score: mockScore,
        percentile: Math.floor(Math.random() * 40) + 60,
        status: passed ? 'passed' : (mockScore >= assessment.passThreshold - 10 ? 'needs-review' : 'failed'),
        completedDate: new Date().toISOString(),
        timeSpent: ASSESSMENT_PRICING[assessment.assessmentType].duration,
        details: {
          categoryScores: {
            'Problem Solving': Math.floor(Math.random() * 30) + 70,
            'Critical Thinking': Math.floor(Math.random() * 30) + 70,
            'Communication': Math.floor(Math.random() * 30) + 70,
          },
          strengths: ['Analytical thinking', 'Attention to detail'],
          weaknesses: ['Time management'],
          recommendations: ['Consider additional training in time management'],
        },
      },
    });

    setCompleted(true);
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

  const assessmentInfo = ASSESSMENT_PRICING[assessment.assessmentType];
  const Icon = assessmentInfo.icon;

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
            <CardDescription>
              Thank you for completing the {assessmentInfo.name}
            </CardDescription>
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
            <CardTitle className="text-base font-semibold">{assessmentInfo.name}</CardTitle>
            <CardDescription>
              This is a simulated assessment interface. In production, this would embed the actual provider's assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted transition-[background,border-color,box-shadow,color] duration-500">
              <div className="text-center space-y-3">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground transition-colors duration-500">
                  Assessment content would be embedded here
                </p>
                <p className="text-sm text-muted-foreground transition-colors duration-500">
                  Provider: {assessment.provider} • Duration: {assessmentInfo.duration} minutes
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleComplete} size="lg">
                Complete Assessment
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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{assessmentInfo.name}</CardTitle>
              <CardDescription>
                Invited by {assessment.invitedByName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 transition-colors duration-500">Candidate Information</h3>
              <div className="text-sm text-muted-foreground space-y-1 transition-colors duration-500">
                <p>Name: {assessment.candidateName}</p>
                <p>Email: {assessment.candidateEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 transition-colors duration-500">Assessment Details</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground transition-colors duration-500">
                    Duration: {assessmentInfo.duration} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground transition-colors duration-500">
                    Pass Threshold: {assessment.passThreshold}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground transition-colors duration-500">
                    Expires: {format(new Date(assessment.expiryDate), 'PPP')}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted p-4 transition-[background,border-color,box-shadow,color] duration-500">
              <h3 className="font-medium mb-2 transition-colors duration-500">Instructions</h3>
              <p className="text-sm text-muted-foreground transition-colors duration-500">
                {assessmentInfo.description}
              </p>
              {assessment.notes && (
                <p className="text-sm text-muted-foreground mt-2 transition-colors duration-500">
                  {assessment.notes}
                </p>
              )}
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
