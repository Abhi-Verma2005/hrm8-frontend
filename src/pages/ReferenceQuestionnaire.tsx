import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { QuestionnaireForm } from '@/components/backgroundChecks/references/QuestionnaireForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getRefereeByToken, submitReferenceResponse } from '@/lib/backgroundChecks/referenceCheckService';
import { getQuestionnaireTemplate } from '@/lib/backgroundChecks/questionnaireTemplateStorage';
import type { RefereeDetails, QuestionAnswer } from '@/types/referee';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

type PageState = 'loading' | 'valid' | 'invalid' | 'completed' | 'submitted';

export default function ReferenceQuestionnaire() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [referee, setReferee] = useState<RefereeDetails | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [candidateName, setCandidateName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(5);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    try {
      const refereeData = getRefereeByToken(token);
      
      if (!refereeData) {
        setState('invalid');
        return;
      }

      // Check if already completed
      if (refereeData.status === 'completed') {
        setState('completed');
        return;
      }

      // Get questionnaire template
      const template = getQuestionnaireTemplate('default');
      if (!template) {
        setState('invalid');
        return;
      }

      setReferee(refereeData);
      setQuestions(template.questions);
      setCandidateName(refereeData.name); // This should be candidate name from the background check
      setEstimatedTime(Math.ceil(template.questions.length * 0.8)); // ~45 seconds per question
      setState('valid');

      // Mark as opened (status update)
      // updateReferee would be called here in production
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      setState('invalid');
    }
  }, [token]);

  const handleSubmit = async (answers: QuestionAnswer[]) => {
    if (!token || !referee) return;

    setIsSubmitting(true);
    try {
      submitReferenceResponse(token, 'default', answers);
      
      toast.success('Reference submitted successfully', {
        description: 'Thank you for your time and feedback.'
      });
      
      setState('submitted');
    } catch (error) {
      console.error('Error submitting reference:', error);
      toast.error('Failed to submit reference', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reference Questionnaire - HRM8</title>
        <meta name="description" content="Complete reference check questionnaire" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">HRM8</h1>
            <p className="text-muted-foreground">Reference Check Portal</p>
          </div>

          {/* Loading State */}
          {state === 'loading' && (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading questionnaire...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Valid Questionnaire Form */}
          {state === 'valid' && referee && (
            <>
              {/* Introduction Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Welcome, {referee.name}</CardTitle>
                  <CardDescription>
                    You have been requested to provide a professional reference for {candidateName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Estimated Time</AlertTitle>
                    <AlertDescription>
                      This questionnaire should take approximately {estimatedTime} minutes to complete.
                      All questions are required unless marked as optional.
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Your relationship:</strong> {referee.relationship === 'manager' ? 'Manager' : 
                        referee.relationship === 'colleague' ? 'Colleague' : 
                        referee.relationship === 'direct-report' ? 'Direct Report' : 
                        referee.relationship === 'client' ? 'Client' : 'Other'}
                    </p>
                    {referee.companyName && (
                      <p><strong>Company:</strong> {referee.companyName}</p>
                    )}
                    <p className="italic pt-2">
                      Your responses will be kept confidential and used only for employment verification purposes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <QuestionnaireForm
                questions={questions}
                candidateName={candidateName}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </>
          )}

          {/* Submitted State */}
          {state === 'submitted' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Reference Submitted</CardTitle>
                <CardDescription>Thank you for completing the reference check</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Response Recorded</AlertTitle>
                  <AlertDescription>
                    Your reference has been successfully submitted. The recruiter has been notified and will review your feedback.
                    We appreciate you taking the time to provide this valuable information.
                  </AlertDescription>
                </Alert>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    You can safely close this page.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If you need to make any changes, please contact the recruiter directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Already Completed */}
          {state === 'completed' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Already Completed</CardTitle>
                <CardDescription>This reference has already been submitted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Reference Already Submitted</AlertTitle>
                  <AlertDescription>
                    You have already completed and submitted this reference questionnaire. 
                    Each reference link can only be used once for security purposes.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    If you need to make changes, please contact the recruiter directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invalid Token */}
          {state === 'invalid' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl">Invalid Link</CardTitle>
                <CardDescription>This questionnaire link is not valid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Link Not Found</AlertTitle>
                  <AlertDescription>
                    The questionnaire link you're trying to access doesn't exist, has expired, or has already been used.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    If you believe this is an error, please contact the recruiter who sent you this link.
                  </p>
                  <div className="flex justify-center">
                    <Button variant="outline" asChild>
                      <a href="mailto:support@hrm8.com">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© 2024 HRM8. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Terms of Service</a>
              <span>•</span>
              <a href="mailto:support@hrm8.com" className="hover:underline">Support</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
