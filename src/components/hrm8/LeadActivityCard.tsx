import { useState, useEffect } from 'react';
import { Lead } from '@/lib/hrm8/leadService';
import { activityService, Activity, ActivityType } from '@/lib/hrm8/activityService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Phone, Mail, Calendar, StickyNote, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LeadActivityCardProps {
  lead: Lead;
}

const ACTIVITY_ICONS: Record<string, any> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  NOTE: StickyNote,
  TASK: CheckCircle2,
  OTHER: StickyNote,
};

export function LeadActivityCard({ lead }: LeadActivityCardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState<ActivityType>(ActivityType.CALL);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  useEffect(() => {
    loadActivities();
  }, [lead.id]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getByLeadId(lead.id);
      if (response.success && response.data) {
        setActivities(response.data);
      }
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!subject) {
      toast.error('Subject is required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await activityService.create({
        leadId: lead.id,
        type,
        subject,
        description,
        outcome,
        nextSteps
      });

      if (response.success) {
        toast.success('Activity logged successfully');
        setCreateDialogOpen(false);
        resetForm();
        loadActivities();
      } else {
        toast.error(response.error || 'Failed to log activity');
      }
    } catch (error) {
      toast.error('Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setType(ActivityType.CALL);
    setSubject('');
    setDescription('');
    setOutcome('');
    setNextSteps('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Activities</CardTitle>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Log Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ActivityType).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject <span className="text-destructive">*</span></Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Summary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Outcome</Label>
                  <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Result of activity" />
                </div>
                <div className="space-y-2">
                  <Label>Next Steps</Label>
                  <Input value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} placeholder="Follow-up actions" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                 <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Activity
                 </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[500px]">
        {loading ? (
          <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">No activities logged yet</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.OTHER;
              return (
                <div key={activity.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.subject}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    {(activity.outcome || activity.nextSteps) && (
                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                        {activity.outcome && (
                          <div className="flex gap-2">
                            <span className="font-semibold">Outcome:</span>
                            <span>{activity.outcome}</span>
                          </div>
                        )}
                        {activity.nextSteps && (
                          <div className="flex gap-2">
                            <span className="font-semibold">Next Steps:</span>
                            <span>{activity.nextSteps}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
