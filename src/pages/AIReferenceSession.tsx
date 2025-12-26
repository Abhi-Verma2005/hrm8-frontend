import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video, 
  Phone, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Shield,
  Camera,
  Mic,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRefereeByToken } from '@/lib/backgroundChecks/refereeStorage';
import { getAISessionsByReferee, updateAISession } from '@/lib/backgroundChecks/aiReferenceCheckStorage';
import type { AIReferenceCheckSession } from '@/types/aiReferenceCheck';
import type { RefereeDetails } from '@/types/referee';

export default function AIReferenceSession() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [referee, setReferee] = useState<RefereeDetails | null>(null);
  const [session, setSession] = useState<AIReferenceCheckSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // System checks
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [browserSupported, setBrowserSupported] = useState(true);
  
  // Consent
  const [consentGiven, setConsentGiven] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    validateToken();
    checkBrowserSupport();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setError('Invalid session link');
      setLoading(false);
      return;
    }

    try {
      // Find referee by token
      const foundReferee = getRefereeByToken(token);
      if (!foundReferee) {
        setError('Invalid or expired session link');
        setLoading(false);
        return;
      }

      // Get AI session
      const sessions = getAISessionsByReferee(foundReferee.id);
      const aiSession = sessions[0]; // Get the latest session

      if (!aiSession) {
        setError('No AI session found for this referee');
        setLoading(false);
        return;
      }

      // Check session status
      if (aiSession.status === 'completed') {
        setError('This session has already been completed');
        setLoading(false);
        return;
      }

      if (aiSession.status === 'cancelled') {
        setError('This session has been cancelled');
        setLoading(false);
        return;
      }

      // Check expiry (14 days from creation)
      const createdDate = new Date(aiSession.createdAt);
      const expiryDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      if (new Date() > expiryDate) {
        setError('This session link has expired');
        setLoading(false);
        return;
      }

      setReferee(foundReferee);
      setSession(aiSession);
      setLoading(false);
    } catch (err) {
      console.error('Error validating token:', err);
      setError('Failed to validate session. Please contact support.');
      setLoading(false);
    }
  };

  const checkBrowserSupport = () => {
    // Check for required browser APIs
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasWebRTC = !!(window.RTCPeerConnection);
    setBrowserSupported(hasGetUserMedia && hasWebRTC);
  };

  const checkPermissions = async () => {
    if (!session) return;

    try {
      // Check microphone permission (required for all modes)
      setMicPermission('checking');
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
      } catch (err) {
        console.error('Microphone permission error:', err);
        setMicPermission('denied');
      }

      // Check camera permission (only for video mode)
      if (session.mode === 'video') {
        setCameraPermission('checking');
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoStream.getTracks().forEach(track => track.stop());
          setCameraPermission('granted');
        } catch (err) {
          console.error('Camera permission error:', err);
          setCameraPermission('denied');
        }
      } else {
        setCameraPermission('granted'); // Not needed for phone mode
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      toast({
        title: 'Permission Check Failed',
        description: 'Unable to check device permissions',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (session && !loading && !error) {
      checkPermissions();
    }
  }, [session, loading, error]);

  const canStartSession = () => {
    if (!session) return false;
    
    const permissionsGranted = session.mode === 'video' 
      ? cameraPermission === 'granted' && micPermission === 'granted'
      : micPermission === 'granted';
    
    return consentGiven && privacyAccepted && permissionsGranted && browserSupported;
  };

  const handleStartSession = async () => {
    if (!session || !referee) return;

    try {
      // Update session status to in-progress
      updateAISession(session.id, {
        status: 'in-progress',
        startedAt: new Date().toISOString()
      });

      toast({
        title: 'Starting Session',
        description: 'Connecting to AI recruiter...'
      });

      // Navigate to appropriate interview interface
      if (session.mode === 'video') {
        navigate(`/ai-reference/${token}/video`);
      } else if (session.mode === 'phone') {
        navigate(`/ai-reference/${token}/phone`);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      toast({
        title: 'Error',
        description: 'Failed to start session. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Validating session...</p>
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
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-2">Session Unavailable</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Need help? Contact support at support@hrm8.com
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!session || !referee) return null;

  const interviewIcon = session.mode === 'video' ? Video : Phone;
  const InterviewIcon = interviewIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <InterviewIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">AI Reference Check</h1>
          <p className="text-muted-foreground">
            You've been invited to provide a reference via AI interview
          </p>
        </div>

        {/* Session Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Session Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Referee Name</span>
              <span className="font-medium">{referee.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Interview Mode</span>
              <Badge variant={session.mode === 'video' ? 'default' : 'secondary'}>
                {session.mode === 'video' ? 'Video Interview' : 'Phone Interview'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Estimated Duration</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                10-15 minutes
              </span>
            </div>
          </div>
        </Card>

        {/* System Requirements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            System Check
          </h2>

          {!browserSupported && (
            <Alert className="mb-4 border-destructive">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                Your browser doesn't support the required features. Please use Chrome, Firefox, or Safari.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {session.mode === 'video' && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Camera Access</p>
                    <p className="text-xs text-muted-foreground">Required for video interview</p>
                  </div>
                </div>
                {cameraPermission === 'checking' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : cameraPermission === 'granted' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Microphone Access</p>
                  <p className="text-xs text-muted-foreground">Required for audio interview</p>
                </div>
              </div>
              {micPermission === 'checking' ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : micPermission === 'granted' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>

            {(cameraPermission === 'denied' || micPermission === 'denied') && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please allow camera and microphone access in your browser settings to continue.
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-1"
                    onClick={checkPermissions}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        {/* Privacy & Consent */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy & Consent</h2>
          
          <div className="space-y-4 mb-6 text-sm text-muted-foreground">
            <p>
              This AI-powered reference check interview will be recorded for quality assurance and verification purposes. 
              The recording and transcript will be shared with the requesting organization to help them make informed hiring decisions.
            </p>
            <p>
              Your responses will be analyzed using artificial intelligence to generate insights about the candidate's 
              professional capabilities. All data is processed in accordance with GDPR and data protection regulations.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium text-foreground mb-2">Your Rights:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your participation is voluntary</li>
                <li>You can end the interview at any time</li>
                <li>Data will be retained for 24 months</li>
                <li>You can request data deletion by contacting support</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="consent" 
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
              />
              <label 
                htmlFor="consent" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                I consent to this interview being recorded and my responses being analyzed by AI for 
                reference check purposes.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
              />
              <label 
                htmlFor="privacy" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read and agree to the{' '}
                <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </a>{' '}
                and understand how my data will be used.
              </label>
            </div>
          </div>
        </Card>

        {/* Start Session Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={handleStartSession}
            disabled={!canStartSession()}
            className="w-full max-w-md h-12 text-base"
          >
            {!canStartSession() ? (
              'Complete requirements above'
            ) : (
              <>
                <InterviewIcon className="h-5 w-5 mr-2" />
                Start {session.mode === 'video' ? 'Video' : 'Phone'} Interview
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center max-w-md">
            By starting the interview, you acknowledge that you have read and understood all requirements 
            and consent to the recording and processing of your responses.
          </p>
        </div>
      </div>
    </div>
  );
}
