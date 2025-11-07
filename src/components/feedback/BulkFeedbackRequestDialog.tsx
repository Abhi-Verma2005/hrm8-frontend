import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Send, Users } from 'lucide-react';
import { getTeamMembers, createBulkFeedbackRequests } from '@/lib/feedbackRequestService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BulkFeedbackRequestDialogProps {
  candidateId: string;
  candidateName: string;
  trigger?: React.ReactNode;
}

const bulkRequestSchema = z.object({
  selectedMembers: z.array(z.string()).min(1, 'Select at least one team member'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export function BulkFeedbackRequestDialog({ 
  candidateId, 
  candidateName,
  trigger 
}: BulkFeedbackRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const teamMembers = getTeamMembers();
  const currentUser = { id: 'current-user', name: 'Current User' };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
    setErrors(prev => ({ ...prev, selectedMembers: '' }));
  };

  const selectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map(m => m.id));
    }
  };

  const handleSubmit = () => {
    // Validate inputs
    const result = bulkRequestSchema.safeParse({
      selectedMembers,
      dueDate,
      message,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const selectedMemberData = teamMembers.filter(m => 
      selectedMembers.includes(m.id)
    );

    const requests = selectedMemberData.map(member => ({
      candidateId,
      candidateName,
      requestedBy: currentUser.id,
      requestedByName: currentUser.name,
      requestedTo: member.id,
      requestedToName: member.name,
      requestedToEmail: member.email,
      dueDate: dueDate!.toISOString(),
      message: message || undefined,
    }));

    createBulkFeedbackRequests(requests);

    toast({
      title: 'Bulk Requests Sent',
      description: `Email notifications sent to ${selectedMembers.length} team member${selectedMembers.length > 1 ? 's' : ''}`,
    });

    // Reset form
    setSelectedMembers([]);
    setDueDate(undefined);
    setMessage('');
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Bulk Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Feedback from Multiple Team Members</DialogTitle>
          <DialogDescription>
            Send email notifications to request feedback for {candidateName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Team Members *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAll}
              >
                {selectedMembers.length === teamMembers.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <Card>
              <CardContent className="pt-4 space-y-2 max-h-[250px] overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <div className="flex-1 cursor-pointer" onClick={() => toggleMember(member.id)}>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={member.id}
                          className="font-medium cursor-pointer"
                        >
                          {member.name}
                        </label>
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.email} • {member.department}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {selectedMembers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedMembers.length} team member{selectedMembers.length > 1 ? 's' : ''} selected
              </p>
            )}
            {errors.selectedMembers && (
              <p className="text-sm text-destructive">{errors.selectedMembers}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setErrors(prev => ({ ...prev, dueDate: '' }));
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-message">Message (Optional)</Label>
            <Textarea
              id="bulk-message"
              value={message}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  setMessage(value);
                  setErrors(prev => ({ ...prev, message: '' }));
                }
              }}
              placeholder="Add any specific instructions or context..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500 characters
            </p>
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {selectedMembers.length > 0 && dueDate && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm font-medium mb-2">Summary:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {selectedMembers.length} email notification{selectedMembers.length > 1 ? 's' : ''} will be sent</li>
                  <li>• Due date: {format(dueDate, 'MMMM d, yyyy')}</li>
                  <li>• Candidate: {candidateName}</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedMembers.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Send {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ''}Request{selectedMembers.length > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
