import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EmailTrigger, TriggerType } from '@/lib/api/emailTriggerService';
import { EmailTemplate } from '@/lib/api/emailTemplateService';
import { emailTriggerService } from '@/lib/api/emailTriggerService';
import { emailTemplateService } from '@/lib/api/emailTemplateService';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Mail, Clock } from 'lucide-react';
import { EmailTriggerEditor } from './EmailTriggerEditor';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface RoundEmailConfigurationProps {
  roundId: string;
  roundName?: string;
  className?: string;
}

const TRIGGER_TYPE_LABELS: Record<TriggerType, string> = {
  STAGE_CHANGE: 'Stage Change',
  SCHEDULED_DATE: 'Scheduled Date',
  APPLICATION_SUBMITTED: 'Application Submitted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  OFFER_EXTENDED: 'Offer Extended',
  OFFER_ACCEPTED: 'Offer Accepted',
  OFFER_DECLINED: 'Offer Declined',
};

export function RoundEmailConfiguration({ roundId, roundName, className }: RoundEmailConfigurationProps) {
  const [triggers, setTriggers] = useState<EmailTrigger[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<EmailTrigger | null>(null);
  const [deletingTrigger, setDeletingTrigger] = useState<EmailTrigger | null>(null);

  useEffect(() => {
    loadData();
  }, [roundId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [triggersData, templatesData] = await Promise.all([
        emailTriggerService.getTriggers(roundId),
        emailTemplateService.getTemplates({ jobRoundId: roundId }),
      ]);
      setTriggers(triggersData);
      setTemplates(templatesData);
    } catch (error: any) {
      toast.error('Failed to load email configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTrigger(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (trigger: EmailTrigger) => {
    setEditingTrigger(trigger);
    setIsEditorOpen(true);
  };

  const handleDelete = async (trigger: EmailTrigger) => {
    try {
      await emailTriggerService.deleteTrigger(trigger.id);
      toast.success('Trigger deleted successfully');
      loadData();
      setDeletingTrigger(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete trigger');
    }
  };

  const handleSuccess = () => {
    loadData();
    setIsEditorOpen(false);
    setEditingTrigger(null);
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Unknown Template';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading email configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Automation</CardTitle>
              <CardDescription>
                Configure automated emails for {roundName || 'this round'}
              </CardDescription>
            </div>
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {triggers.length === 0 ? (
            <div className="py-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No email triggers configured</p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Trigger
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {triggers.map((trigger) => (
                <Card key={trigger.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{getTemplateName(trigger.templateId)}</h4>
                          <Badge variant={trigger.isActive ? 'default' : 'secondary'}>
                            {trigger.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">
                            {TRIGGER_TYPE_LABELS[trigger.triggerType]}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {(trigger.delayDays > 0 || trigger.delayHours > 0) && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Delay: {trigger.delayDays > 0 && `${trigger.delayDays} day(s)`}
                              {trigger.delayDays > 0 && trigger.delayHours > 0 && ', '}
                              {trigger.delayHours > 0 && `${trigger.delayHours} hour(s)`}
                            </div>
                          )}
                          <div>
                            Created {formatDistanceToNow(new Date(trigger.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(trigger)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingTrigger(trigger)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EmailTriggerEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        roundId={roundId}
        trigger={editingTrigger}
        templates={templates}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={!!deletingTrigger} onOpenChange={(open) => !open && setDeletingTrigger(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Trigger</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this email trigger? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTrigger && handleDelete(deletingTrigger)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

