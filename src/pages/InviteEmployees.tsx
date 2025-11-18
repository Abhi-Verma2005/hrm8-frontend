/**
 * Invite Employees Page
 * Admin page for sending invitations to employees
 */

import { useState } from 'react';
import { invitationService } from '@/lib/invitationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, CheckCircle2, XCircle, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function InviteEmployees() {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    sent: string[];
    failed: Array<{ email: string; reason: string }>;
  } | null>(null);
  const { toast } = useToast();

  const addEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (trimmedEmail && !emails.includes(trimmedEmail)) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmedEmail)) {
        setEmails([...emails, trimmedEmail]);
        setEmailInput('');
      } else {
        toast({
          title: 'Invalid email',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = async () => {
    if (emails.length === 0) {
      toast({
        title: 'No emails',
        description: 'Please add at least one email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await invitationService.sendInvitations({ emails });
      if (response.success && response.data) {
        setResult(response.data);
        if (response.data.sent.length > 0) {
          toast({
            title: 'Invitations sent!',
            description: `Successfully sent ${response.data.sent.length} invitation(s)`,
          });
        }
        if (response.data.failed.length > 0) {
          toast({
            title: 'Some invitations failed',
            description: `${response.data.failed.length} invitation(s) could not be sent`,
            variant: 'destructive',
          });
        }
        // Clear emails if all were sent successfully
        if (response.data.failed.length === 0) {
          setEmails([]);
        }
      } else {
        toast({
          title: 'Failed to send invitations',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to send invitations',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invite Employees</h1>
        <p className="text-muted-foreground mt-1">
          Send invitation emails to employees to join your company
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Invitations</CardTitle>
          <CardDescription>
            Enter email addresses of employees you want to invite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="employee@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addEmail}
                disabled={isLoading || !emailInput.trim()}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click the + button to add an email
            </p>
          </div>

          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Email Addresses ({emails.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
                {emails.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <Mail className="h-3 w-3" />
                    {email}
                    <button
                      onClick={() => removeEmail(email)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || emails.length === 0}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Sending Invitations...' : `Send ${emails.length} Invitation${emails.length !== 1 ? 's' : ''}`}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.sent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Successfully Sent ({result.sent.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {result.sent.map((email) => (
                    <div key={email} className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-green-600" />
                      {email}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.failed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Failed ({result.failed.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.failed.map((failure, index) => (
                    <div key={index} className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{failure.email}</span>
                      </div>
                      <p className="text-muted-foreground ml-6">{failure.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

