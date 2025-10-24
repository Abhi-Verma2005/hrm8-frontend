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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Invoice } from "@/types/billing";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SendInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function SendInvoiceDialog({ open, onOpenChange, invoice }: SendInvoiceDialogProps) {
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendCopy, setSendCopy] = useState(true);

  // Initialize with defaults when invoice changes
  useState(() => {
    if (invoice) {
      setSubject(`Invoice ${invoice.invoiceNumber} from Your Company`);
      setMessage(`Dear ${invoice.employerName},\n\nPlease find attached invoice ${invoice.invoiceNumber} for your review.\n\nTotal Amount Due: $${invoice.total.toFixed(2)}\nDue Date: ${invoice.dueDate.toLocaleDateString()}\n\nThank you for your business!\n\nBest regards`);
    }
  });

  const handleSend = () => {
    if (!emailTo) {
      toast({
        title: "Email required",
        description: "Please enter recipient email address.",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would send the email
    toast({
      title: "Invoice sent",
      description: `Invoice sent to ${emailTo}`,
    });
    
    onOpenChange(false);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Invoice
          </DialogTitle>
          <DialogDescription>
            Send {invoice.invoiceNumber} to {invoice.employerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="emailTo">To *</Label>
            <Input
              id="emailTo"
              type="email"
              placeholder="client@company.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="emailCc">CC</Label>
            <Input
              id="emailCc"
              type="email"
              placeholder="cc@company.com"
              value={emailCc}
              onChange={(e) => setEmailCc(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendCopy"
              checked={sendCopy}
              onCheckedChange={(checked) => setSendCopy(checked as boolean)}
            />
            <Label
              htmlFor="sendCopy"
              className="text-sm font-normal cursor-pointer"
            >
              Send me a copy
            </Label>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium mb-1">Invoice Preview</p>
            <p className="text-muted-foreground">
              {invoice.invoiceNumber} • ${invoice.total.toFixed(2)} • {invoice.lineItems.length} items
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
