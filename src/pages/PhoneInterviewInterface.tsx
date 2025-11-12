import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Phone, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRefereeByToken } from '@/lib/backgroundChecks/refereeStorage';
import { getAISessionsByReferee, updateAISession } from '@/lib/backgroundChecks/aiReferenceCheckStorage';
import { AudioWaveform } from '@/components/backgroundChecks/ai-interview/AudioWaveform';
import { CurrentQuestionDisplay } from '@/components/backgroundChecks/ai-interview/CurrentQuestionDisplay';
import { TranscriptDisplay, TranscriptTurn } from '@/components/backgroundChecks/ai-interview/TranscriptDisplay';
import { PhoneControls } from '@/components/backgroundChecks/ai-interview/PhoneControls';
import { AudioRecorder, encodeAudioForAPI, AudioQueue } from '@/utils/audioRecorder';
import type { AIReferenceCheckSession } from '@/types/aiReferenceCheck';

export default function PhoneInterviewInterface() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AIReferenceCheckSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  
  // Call state
  const [callActive, setCallActive] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  
  const [transcriptTurns, setTranscriptTurns] = useState<TranscriptTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [duration, setDuration] = useState('00:00');
  
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const currentAITextRef = useRef<string>('');

  // Initialize session
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, [token]);

  // Duration timer
  useEffect(() => {
    if (!callActive) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callActive]);

  const initializeSession = async () => {
    if (!token) {
      setError('Invalid session token');
      setLoading(false);
      return;
    }

    try {
      const referee = getRefereeByToken(token);
      if (!referee) {
        setError('Invalid session');
        setLoading(false);
        return;
      }

      const sessions = getAISessionsByReferee(referee.id);
      const aiSession = sessions[0];

      if (!aiSession || aiSession.status !== 'in-progress') {
        setError('Session not available');
        setLoading(false);
        return;
      }

      setSession(aiSession);
      
      // Pre-fill phone if available
      if (referee.phone) {
        setPhoneNumber(referee.phone);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to initialize interview session');
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        variant: 'destructive'
      });
      return;
    }

    setVerifyingPhone(true);
    
    // Simulate verification (in production, would send SMS)
    setTimeout(() => {
      setPhoneVerified(true);
      setVerifyingPhone(false);
      toast({
        title: 'Phone Verified',
        description: 'You can now start the call',
      });
    }, 1500);
  };

  const handleStartCall = async () => {
    if (!phoneVerified) return;

    try {
      // Initialize audio context with gain node for volume control
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Connect to WebSocket
      connectWebSocket();
      
      setCallActive(true);
      startTimeRef.current = Date.now();
      
      toast({
        title: 'Call Starting',
        description: 'Connecting to AI recruiter...',
      });
    } catch (err) {
      console.error('Error starting call:', err);
      toast({
        title: 'Error',
        description: 'Failed to start call',
        variant: 'destructive'
      });
    }
  };

  const connectWebSocket = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const wsUrl = supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const websocket = new WebSocket(`${wsUrl}/functions/v1/ai-reference-interview`);

    websocket.onopen = () => {
      console.log('Connected to AI interview service');
      setWsConnected(true);
      startAudioRecording();
      
      toast({
        title: 'Connected',
        description: 'AI interviewer is ready. Start speaking naturally.',
      });
    };

    websocket.onmessage = (event) => {
      handleWebSocketMessage(event.data);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please refresh the page.');
    };

    websocket.onclose = () => {
      console.log('WebSocket closed');
      setWsConnected(false);
    };

    setWs(websocket);
  };

  const handleWebSocketMessage = (data: string) => {
    try {
      const message = JSON.parse(data);
      console.log('Received message:', message.type);

      switch (message.type) {
        case 'response.audio.delta':
          handleAudioDelta(message.delta);
          break;
          
        case 'response.audio_transcript.delta':
          handleAITranscriptDelta(message.delta);
          setCurrentQuestion(prev => prev + message.delta);
          break;
          
        case 'conversation.item.input_audio_transcription.completed':
          handleUserTranscriptCompleted(message.transcript);
          break;
          
        case 'response.done':
          handleResponseDone();
          break;
          
        case 'error':
          console.error('AI error:', message.error);
          toast({
            title: 'Error',
            description: message.error || 'An error occurred',
            variant: 'destructive'
          });
          break;
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };

  const handleAudioDelta = async (base64Audio: string) => {
    if (!audioQueueRef.current || volume === 0) return;

    setAiSpeaking(true);
    
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    await audioQueueRef.current.addToQueue(bytes);
  };

  const handleAITranscriptDelta = (delta: string) => {
    currentAITextRef.current += delta;
  };

  const handleUserTranscriptCompleted = (transcript: string) => {
    if (!transcript.trim()) return;

    const turn: TranscriptTurn = {
      id: `user-${Date.now()}`,
      speaker: 'referee',
      text: transcript,
      timestamp: new Date().toLocaleTimeString()
    };

    setTranscriptTurns(prev => [...prev, turn]);
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleResponseDone = () => {
    setAiSpeaking(false);
    
    if (currentAITextRef.current.trim()) {
      const turn: TranscriptTurn = {
        id: `ai-${Date.now()}`,
        speaker: 'ai',
        text: currentAITextRef.current,
        timestamp: new Date().toLocaleTimeString()
      };

      setTranscriptTurns(prev => [...prev, turn]);
      setCurrentQuestion(currentAITextRef.current);
      currentAITextRef.current = '';
    }
  };

  const startAudioRecording = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    audioRecorderRef.current = new AudioRecorder((audioData) => {
      if (!micEnabled || !ws || ws.readyState !== WebSocket.OPEN) return;

      const base64Audio = encodeAudioForAPI(audioData);
      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64Audio
      }));
    });

    audioRecorderRef.current.start().catch(err => {
      console.error('Error starting audio recorder:', err);
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone',
        variant: 'destructive'
      });
      setMicEnabled(false);
    });
  };

  const handleToggleMic = useCallback(() => {
    setMicEnabled(prev => !prev);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, []);

  const handleEndCall = async () => {
    try {
      if (session) {
        updateAISession(session.id, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
        });
      }

      toast({
        title: 'Call Ended',
        description: 'Thank you for your time. Your responses have been recorded.',
      });

      setTimeout(() => {
        navigate(`/ai-reference/${token}/complete`);
      }, 1500);
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  const cleanup = () => {
    audioRecorderRef.current?.stop();
    ws?.close();
    audioContextRef.current?.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading interview...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Phone verification screen
  if (!phoneVerified && !callActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Phone Interview</h1>
              <p className="text-sm text-muted-foreground">
                Please verify your phone number to begin the AI interview
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={verifyingPhone}
                />
                <p className="text-xs text-muted-foreground">
                  This number will be used to deliver the interview audio
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyPhone}
                disabled={verifyingPhone || !phoneNumber}
              >
                {verifyingPhone ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Verify & Continue
                  </>
                )}
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This is a simulated phone interface. In production, you would 
                receive an automated call from our AI system. For now, click verify to proceed with 
                the audio-only interview through your browser.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Call initiation screen
  if (phoneVerified && !callActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Phone Verified</h1>
              <p className="text-sm text-muted-foreground">
                Ready to start your AI reference check interview
              </p>
            </div>

            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium">What to expect:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>AI recruiter will ask you questions about the candidate</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Speak naturally and wait for AI to finish before responding</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Interview typically takes 10-15 minutes</span>
                </li>
              </ul>
            </div>

            <Button
              className="w-full h-14"
              size="lg"
              onClick={handleStartCall}
            >
              <Phone className="h-5 w-5 mr-2" />
              Start Interview Call
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active call interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Phone Interview Active</h1>
          <p className="text-sm text-muted-foreground">
            {wsConnected ? 'Speak naturally with the AI recruiter' : 'Connecting...'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Audio Visualization & Current Question */}
          <div className="lg:col-span-2 space-y-4">
            {/* Audio Waveform */}
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center">Audio Activity</h2>
                <div className="h-24 flex items-center">
                  <AudioWaveform
                    isActive={callActive && wsConnected}
                    isSpeaking={aiSpeaking}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {aiSpeaking ? 'AI Recruiter is speaking...' : 'Listening for your response...'}
                </p>
              </div>
            </Card>

            {/* Current Question */}
            <CurrentQuestionDisplay
              currentQuestion={currentQuestion}
              questionNumber={questionsAnswered + 1}
              totalQuestions={10}
              isAISpeaking={aiSpeaking}
            />

            {/* Transcript */}
            <div className="h-[300px]">
              <TranscriptDisplay turns={transcriptTurns} />
            </div>
          </div>

          {/* Right Column - Controls */}
          <div>
            <PhoneControls
              micEnabled={micEnabled}
              volume={volume}
              onToggleMic={handleToggleMic}
              onVolumeChange={handleVolumeChange}
              onEndCall={handleEndCall}
              questionsAnswered={questionsAnswered}
              totalQuestions={10}
              duration={duration}
              callActive={callActive && wsConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
