import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Video, Phone, MessageSquare, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveAIInterviewSession } from '@/lib/aiInterview/aiInterviewStorage';
import { v4 as uuidv4 } from 'uuid';
import type { Application } from '@/types/application';
import type { InterviewMode } from '@/types/aiInterview';

interface AutoScheduleAIInterviewDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

export function AutoScheduleAIInterviewDialog({ 
  application, 
  open, 
  onOpenChange,
  onScheduled 
}: AutoScheduleAIInterviewDialogProps) {
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('text');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledDate) {
      toast({
        title: 'Date required',
        description: 'Please select a date and time for the interview',
        variant: 'destructive',
      });
      return;
    }

    setIsScheduling(true);

    const interview = {
      id: uuidv4(),
      candidateId: application.candidateId,
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      applicationId: application.id,
      jobId: application.jobId,
      jobTitle: application.jobTitle,
      status: 'scheduled' as const,
      scheduledDate,
      interviewMode,
      questionSource: 'hybrid' as const,
      questions: [],
      currentQuestionIndex: 0,
      transcript: [],
      invitationToken: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
    };

    saveAIInterviewSession(interview);

    toast({
      title: 'AI Interview scheduled',
      description: `${application.candidateName} will receive an interview invitation`,
    });

    setIsScheduling(false);
    onScheduled?.();
    onOpenChange(false);
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule AI Interview</DialogTitle>
          <DialogDescription>
            Configure and schedule an AI interview for {application.candidateName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interview Mode */}
          <div className="space-y-3">
            <Label>Interview Mode</Label>
            <RadioGroup value={interviewMode} onValueChange={(value) => setInterviewMode(value as InterviewMode)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Text Interview</div>
                      <div className="text-sm text-muted-foreground">Chat-based AI interview</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Video Interview</div>
                      <div className="text-sm text-muted-foreground">Face-to-face AI interview</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Phone Interview</div>
                      <div className="text-sm text-muted-foreground">Voice-only AI interview</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">
              <Calendar className="h-4 w-4 inline mr-2" />
              Interview Date & Time
            </Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              min={minDate}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          {/* Info Box */}
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-1">What happens next:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Candidate receives interview invitation via email</li>
              <li>• AI conducts structured interview</li>
              <li>• Automatic analysis and scoring</li>
              <li>• Report available for team review</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={isScheduling}>
              {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
