import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRefereeByToken, updateReferee } from '@/lib/backgroundChecks/refereeStorage';
import { getAISessionsByReferee, updateAISession } from '@/lib/backgroundChecks/aiReferenceCheckStorage';
import { AIAvatarDisplay } from '@/components/backgroundChecks/ai-interview/AIAvatarDisplay';
import { VideoFeed } from '@/components/backgroundChecks/ai-interview/VideoFeed';
import { TranscriptDisplay, TranscriptTurn } from '@/components/backgroundChecks/ai-interview/TranscriptDisplay';
import { InterviewControls } from '@/components/backgroundChecks/ai-interview/InterviewControls';
import { AudioRecorder, encodeAudioForAPI, AudioQueue } from '@/utils/audioRecorder';
import type { AIReferenceCheckSession } from '@/types/aiReferenceCheck';

export default function VideoInterviewInterface() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AIReferenceCheckSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  
  const [transcriptTurns, setTranscriptTurns] = useState<TranscriptTurn[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [duration, setDuration] = useState('00:00');
  
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const currentAITextRef = useRef<string>('');
  const currentUserTextRef = useRef<string>('');

  // Initialize session and WebSocket
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, [token]);

  // Duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      
      // Initialize video stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false // Audio handled separately by AudioRecorder
        });
        setVideoStream(stream);
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast({
          title: 'Camera Error',
          description: 'Could not access camera. Continuing with audio only.',
          variant: 'destructive'
        });
        setCameraEnabled(false);
      }

      // Initialize audio context and queue
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Connect to WebSocket
      connectWebSocket();
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to initialize interview session');
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    // Get Supabase project URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const wsUrl = supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const websocket = new WebSocket(`${wsUrl}/functions/v1/ai-reference-interview`);

    websocket.onopen = () => {
      console.log('Connected to AI interview service');
      setWsConnected(true);
      
      // Start audio recording
      startAudioRecording();
      
      toast({
        title: 'Connected',
        description: 'AI interviewer is ready. You can start speaking.',
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
    if (!speakerEnabled || !audioQueueRef.current) return;

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

  const handleToggleCamera = useCallback(() => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
    }
    setCameraEnabled(prev => !prev);
  }, [videoStream, cameraEnabled]);

  const handleToggleSpeaker = useCallback(() => {
    setSpeakerEnabled(prev => !prev);
    if (audioQueueRef.current) {
      audioQueueRef.current.clear();
    }
  }, []);

  const handleEndInterview = async () => {
    try {
      if (session) {
        updateAISession(session.id, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
        });
      }

      toast({
        title: 'Interview Completed',
        description: 'Thank you for your time. Your responses have been recorded.',
      });

      setTimeout(() => {
        navigate(`/ai-reference/${token}/complete`);
      }, 1500);
    } catch (err) {
      console.error('Error ending interview:', err);
    }
  };

  const cleanup = () => {
    audioRecorderRef.current?.stop();
    ws?.close();
    videoStream?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Initializing interview...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">AI Reference Check Interview</h1>
          <p className="text-sm text-muted-foreground">
            {wsConnected ? 'Connected - Speak naturally with the AI recruiter' : 'Connecting...'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Video Feeds */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Avatar */}
            <Card className="p-6 flex items-center justify-center min-h-[350px]">
              <AIAvatarDisplay isSpeaking={aiSpeaking} />
            </Card>

            {/* Referee Video */}
            <div className="h-64">
              <VideoFeed
                stream={videoStream}
                cameraEnabled={cameraEnabled}
                onToggleCamera={handleToggleCamera}
              />
            </div>
          </div>

          {/* Right Column - Transcript & Controls */}
          <div className="space-y-4">
            {/* Transcript */}
            <div className="h-[450px]">
              <TranscriptDisplay turns={transcriptTurns} />
            </div>

            {/* Controls */}
            <InterviewControls
              micEnabled={micEnabled}
              speakerEnabled={speakerEnabled}
              onToggleMic={handleToggleMic}
              onToggleSpeaker={handleToggleSpeaker}
              onEndInterview={handleEndInterview}
              questionsAnswered={questionsAnswered}
              totalQuestions={10}
              duration={duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
