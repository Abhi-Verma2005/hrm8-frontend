import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail } from "lucide-react";

interface OnboardingEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onSend: (emailType: string, message: string) => void;
}

export function OnboardingEmailDialog({
  open,
  onOpenChange,
  selectedCount,
  onSend,
}: OnboardingEmailDialogProps) {
  const [emailType, setEmailType] = useState<string>("welcome");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(emailType, message);
    setMessage("");
    setEmailType("welcome");
    onOpenChange(false);
  };

  const emailTemplates = {
    welcome: "Welcome to the team! We're excited to have you onboard. Your onboarding process has been prepared and we look forward to working with you.",
    reminder: "This is a friendly reminder about your pending onboarding tasks. Please complete them at your earliest convenience to ensure a smooth start.",
    checkin: "We hope your onboarding is going well! Please let us know if you have any questions or need any assistance.",
  };

  const handleTypeChange = (type: string) => {
    setEmailType(type);
    setMessage(emailTemplates[type as keyof typeof emailTemplates]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to {selectedCount} Workflow{selectedCount > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Compose an email to send to selected employees. Choose a template or write your own message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-type">Email Type</Label>
            <Select value={emailType} onValueChange={handleTypeChange}>
              <SelectTrigger id="email-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="reminder">Onboarding Reminder</SelectItem>
                <SelectItem value="checkin">Check-in Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
