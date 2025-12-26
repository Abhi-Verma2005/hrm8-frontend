import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveAIInterviewSession } from '@/lib/aiInterview/aiInterviewStorage';
import { v4 as uuidv4 } from 'uuid';
import type { Job } from '@/types/job';

interface BulkScheduleDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock applicants - in real app, fetch from applications
const mockApplicants = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', status: 'shortlisted' },
  { id: '2', name: 'Michael Chen', email: 'michael.c@email.com', status: 'new' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', status: 'screening' },
  { id: '4', name: 'David Kim', email: 'david.k@email.com', status: 'shortlisted' },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.a@email.com', status: 'new' },
];

export function BulkScheduleDialog({ job, open, onOpenChange }: BulkScheduleDialogProps) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const handleToggleApplicant = (applicantId: string) => {
    setSelectedApplicants(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplicants.length === mockApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(mockApplicants.map(a => a.id));
    }
  };

  const handleSchedule = async () => {
    if (selectedApplicants.length === 0) {
      toast({
        title: 'No applicants selected',
        description: 'Please select at least one applicant to schedule interviews',
        variant: 'destructive',
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: 'Date required',
        description: 'Please select a date and time for the interviews',
        variant: 'destructive',
      });
      return;
    }

    setIsScheduling(true);

    // Schedule interviews for selected applicants
    const scheduledInterviews = selectedApplicants.map((applicantId) => {
      const applicant = mockApplicants.find(a => a.id === applicantId);
      if (!applicant) return null;

      return {
        id: uuidv4(),
        candidateId: applicantId,
        candidateName: applicant.name,
        candidateEmail: applicant.email,
        jobId: job.id,
        jobTitle: job.title,
        status: 'scheduled' as const,
        scheduledDate,
        interviewMode: job.aiInterviewConfig?.defaultMode || 'text' as const,
        questionSource: job.aiInterviewConfig?.questionSource || 'hybrid' as const,
        questions: [],
        currentQuestionIndex: 0,
        transcript: [],
        invitationToken: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user',
      };
    }).filter(Boolean);

    // Save all interviews
    scheduledInterviews.forEach(interview => {
      if (interview) saveAIInterviewSession(interview);
    });

    toast({
      title: 'Interviews scheduled',
      description: `Successfully scheduled ${scheduledInterviews.length} AI interviews`,
    });

    setIsScheduling(false);
    onOpenChange(false);
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Schedule AI Interviews</DialogTitle>
          <DialogDescription>
            Schedule AI interviews for multiple applicants at once for {job.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
            <p className="text-sm text-muted-foreground">
              All selected applicants will receive interview invitations for this time
            </p>
          </div>

          {/* Applicant Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                <Users className="h-4 w-4 inline mr-2" />
                Select Applicants ({selectedApplicants.length} selected)
              </Label>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedApplicants.length === mockApplicants.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-4">
              <div className="space-y-3">
                {mockApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={applicant.id}
                      checked={selectedApplicants.includes(applicant.id)}
                      onCheckedChange={() => handleToggleApplicant(applicant.id)}
                    />
                    <label
                      htmlFor={applicant.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-muted-foreground">{applicant.email}</div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {applicant.status}
                        </Badge>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Interview Configuration Info */}
          {job.aiInterviewConfig && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <p className="font-medium">Interview Configuration:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mode: <span className="capitalize">{job.aiInterviewConfig.defaultMode}</span></li>
                <li>• Questions: {job.aiInterviewConfig.questionSource === 'predefined' ? 'Predefined' : job.aiInterviewConfig.questionSource === 'ai-generated' ? 'AI-Generated' : 'Hybrid'}</li>
                {job.aiInterviewConfig.defaultQuestions && job.aiInterviewConfig.defaultQuestions.length > 0 && (
                  <li>• {job.aiInterviewConfig.defaultQuestions.length} default question(s) configured</li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={isScheduling}>
              {isScheduling ? 'Scheduling...' : `Schedule ${selectedApplicants.length} Interview${selectedApplicants.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
