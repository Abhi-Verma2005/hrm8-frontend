import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, Send, Inbox, Archive, Star, Clock, CheckCircle, 
  Paperclip, Image as ImageIcon, FileText, MoreVertical, Reply, Forward
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'screening' | 'interview' | 'offer' | 'rejection' | 'general';
}

interface EmailThread {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  subject: string;
  preview: string;
  lastMessageAt: Date;
  status: 'unread' | 'read' | 'replied' | 'archived';
  starred: boolean;
  messageCount: number;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Screening',
    subject: 'Next Steps for {{JobTitle}} Position',
    body: 'Hi {{CandidateName}},\n\nThank you for your interest in the {{JobTitle}} position at {{CompanyName}}. We were impressed with your application and would like to move forward with the next steps.\n\nWould you be available for a brief phone screening this week?\n\nBest regards,\n{{RecruiterName}}',
    category: 'screening'
  },
  {
    id: '2',
    name: 'Interview Invitation',
    subject: 'Interview Invitation for {{JobTitle}}',
    body: 'Hi {{CandidateName}},\n\nWe would like to invite you for an interview for the {{JobTitle}} position.\n\nDate: {{InterviewDate}}\nTime: {{InterviewTime}}\nLocation: {{InterviewLocation}}\n\nPlease confirm your availability.\n\nBest regards,\n{{RecruiterName}}',
    category: 'interview'
  },
  {
    id: '3',
    name: 'Offer Letter',
    subject: 'Job Offer - {{JobTitle}} at {{CompanyName}}',
    body: 'Hi {{CandidateName}},\n\nWe are pleased to extend an offer for the position of {{JobTitle}} at {{CompanyName}}.\n\nPlease find the formal offer letter attached. We look forward to welcoming you to our team!\n\nBest regards,\n{{RecruiterName}}',
    category: 'offer'
  },
  {
    id: '4',
    name: 'Polite Rejection',
    subject: 'Application Update for {{JobTitle}}',
    body: 'Hi {{CandidateName}},\n\nThank you for your interest in the {{JobTitle}} position and for taking the time to interview with us.\n\nAfter careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.\n\nWe appreciate your time and wish you all the best in your job search.\n\nBest regards,\n{{RecruiterName}}',
    category: 'rejection'
  },
];

const mockThreads: EmailThread[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.j@email.com',
    subject: 'Re: Interview for Senior Developer',
    preview: 'Thank you for the interview invitation. I am available...',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'unread',
    starred: true,
    messageCount: 3
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    subject: 'Application for Product Manager',
    preview: 'I wanted to follow up on my application submitted...',
    lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'read',
    starred: false,
    messageCount: 1
  },
];

export function EmailCommunicationCenter() {
  const { toast } = useToast();
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully.",
    });
    setEmailSubject('');
    setEmailBody('');
    setRecipient('');
    setSelectedTemplate('');
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="compose" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">
            <Send className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="inbox">
            <Inbox className="h-4 w-4 mr-2" />
            Inbox
            <Badge variant="secondary" className="ml-2">
              {mockThreads.filter(t => t.status === 'unread').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="flex-1 overflow-auto">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template">Use Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recipient">To</Label>
                <Input
                  id="recipient"
                  type="email"
                  placeholder="candidate@email.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Write your email message..."
                  className="min-h-[300px]"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                </div>
                <Button onClick={handleSendEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="flex-1">
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Thread List */}
            <Card className="col-span-1 p-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {mockThreads.map((thread) => (
                    <Card
                      key={thread.id}
                      className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                        selectedThread?.id === thread.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={thread.candidateAvatar} />
                          <AvatarFallback>
                            {thread.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm truncate">
                              {thread.candidateName}
                            </p>
                            {thread.starred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {thread.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {thread.preview}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={thread.status === 'unread' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {thread.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(thread.lastMessageAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Thread Detail */}
            <Card className="col-span-2 p-6">
              {selectedThread ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedThread.candidateAvatar} />
                        <AvatarFallback>
                          {selectedThread.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedThread.candidateName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedThread.candidateEmail}</p>
                        <p className="text-sm font-medium mt-1">{selectedThread.subject}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="h-4 w-4 mr-2" />
                        Forward
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      <Card className="p-4 bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDistanceToNow(selectedThread.lastMessageAt, { addSuffix: true })}
                        </p>
                        <p className="text-sm">
                          {selectedThread.preview}
                        </p>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a thread to view messages</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      Use Template
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Subject:</span> {template.subject}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.body}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
