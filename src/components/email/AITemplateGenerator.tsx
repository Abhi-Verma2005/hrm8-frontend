import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { emailTemplateService, EmailTemplateType, GeneratedEmailTemplate } from '@/lib/api/emailTemplateService';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

interface AITemplateGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
  jobRoundId?: string;
  onGenerate: (template: GeneratedEmailTemplate) => void;
}

const TEMPLATE_TYPES: { value: EmailTemplateType; label: string }[] = [
  { value: 'APPLICATION_CONFIRMATION', label: 'Application Confirmation' },
  { value: 'INTERVIEW_INVITATION', label: 'Interview Invitation' },
  { value: 'REJECTION', label: 'Rejection' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
  { value: 'STAGE_CHANGE', label: 'Stage Change' },
  { value: 'REMINDER', label: 'Reminder' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'CUSTOM', label: 'Custom' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

export function AITemplateGenerator({
  open,
  onOpenChange,
  jobId,
  jobRoundId,
  onGenerate,
}: AITemplateGeneratorProps) {
  const [templateType, setTemplateType] = useState<EmailTemplateType>('CUSTOM');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual' | 'formal'>('professional');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!templateType) {
      toast.error('Please select a template type');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await emailTemplateService.generateAITemplate({
        templateType,
        jobId,
        jobRoundId,
        tone,
        additionalContext: additionalContext || undefined,
      });

      onGenerate(generated);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate template');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Email Template with AI
          </DialogTitle>
          <DialogDescription>
            Let AI create a professional email template based on your requirements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-type">Template Type</Label>
            <Select value={templateType} onValueChange={(value) => setTemplateType(value as EmailTemplateType)}>
              <SelectTrigger id="template-type">
                <SelectValue placeholder="Select template type" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(value) => setTone(value as typeof tone)}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((toneOption) => (
                  <SelectItem key={toneOption.value} value={toneOption.value}>
                    {toneOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Any specific requirements or context for the email template..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

