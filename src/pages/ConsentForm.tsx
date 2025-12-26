import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ConsentFormView } from '@/components/backgroundChecks/consent/ConsentFormView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getConsentByToken, validateConsentToken, acceptConsent, declineConsent, markConsentAsViewed } from '@/lib/backgroundChecks/consentService';
import type { ConsentRequest } from '@/types/consent';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'accepted' | 'declined';

export default function ConsentForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('loading');
  const [consent, setConsent] = useState<ConsentRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    // Validate token and load consent request
    const isValid = validateConsentToken(token);
    
    if (!isValid) {
      const consentData = getConsentByToken(token);
      if (consentData) {
        if (consentData.status === 'expired') {
          setState('expired');
        } else if (consentData.status === 'accepted') {
          setState('accepted');
        } else if (consentData.status === 'declined') {
          setState('declined');
        }
      } else {
        setState('invalid');
      }
      return;
    }

    const consentData = getConsentByToken(token);
    if (consentData) {
      setConsent(consentData);
      setState('valid');
      
      // Mark as viewed
      markConsentAsViewed(token);
    } else {
      setState('invalid');
    }
  }, [token]);

  const handleAccept = async (signatureDataUrl: string) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      // Simulate getting IP address (in production, this would be done server-side)
      const ipAddress = '0.0.0.0';
      
      acceptConsent(token, signatureDataUrl, ipAddress);
      
      toast.success('Consent accepted successfully', {
        description: 'Background checks will now begin processing.'
      });
      
      setState('accepted');
    } catch (error) {
      console.error('Error accepting consent:', error);
      toast.error('Failed to accept consent', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      declineConsent(token);
      
      toast.info('Consent declined', {
        description: 'The recruiter has been notified.'
      });
      
      setState('declined');
    } catch (error) {
      console.error('Error declining consent:', error);
      toast.error('Failed to decline consent', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Background Check Consent - HRM8</title>
        <meta name="description" content="Review and provide consent for background check request" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">HRM8</h1>
            <p className="text-muted-foreground">Background Check Consent Portal</p>
          </div>

          {/* Loading State */}
          {state === 'loading' && (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading consent request...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Valid Consent Form */}
          {state === 'valid' && consent && (
            <ConsentFormView
              consentRequest={consent}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Accepted State */}
          {state === 'accepted' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Consent Accepted</CardTitle>
                <CardDescription>Thank you for providing your consent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>What happens next?</AlertTitle>
                  <AlertDescription>
                    Your background checks are now being processed. The recruiter will be notified once all checks are complete. 
                    You will receive an email notification with the results.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You can safely close this page.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Declined State */}
          {state === 'declined' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl">Consent Declined</CardTitle>
                <CardDescription>You have declined the background check request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>What happens next?</AlertTitle>
                  <AlertDescription>
                    The recruiter has been notified of your decision. If you have any questions or concerns, 
                    please contact them directly.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You can safely close this page.
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
                <CardDescription>This consent link is not valid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Link Not Found</AlertTitle>
                  <AlertDescription>
                    The consent link you're trying to access doesn't exist or has been removed.
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

          {/* Expired Token */}
          {state === 'expired' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl">Link Expired</CardTitle>
                <CardDescription>This consent link has expired</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Request Expired</AlertTitle>
                  <AlertDescription>
                    This consent request has expired. Consent links are valid for 7 days from the date they were sent.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Please contact the recruiter to request a new consent link.
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
