import { Application } from "@/types/application";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, Phone, MapPin, Briefcase, FileText, Calendar, 
  Star, MessageSquare, Clock, ArrowRight, Download, Video, Send 
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStage } from "@/types/application";
import { updateApplicationStatus } from "@/lib/mockApplicationStorage";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InterviewScheduler } from "@/components/interviews/InterviewScheduler";
import { OfferForm } from "@/components/offers/OfferForm";
import { getTemplateById } from "@/lib/mockTemplateStorage";
import { AIInterviewScheduleDialog } from "@/components/applications/AIInterviewScheduleDialog";
import { Video } from "lucide-react";

interface ApplicationDetailPanelProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function ApplicationDetailPanel({ application, open, onOpenChange, onRefresh }: ApplicationDetailPanelProps) {
  const [newNote, setNewNote] = useState("");
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isAIInterviewDialogOpen, setIsAIInterviewDialogOpen] = useState(false);

  if (!application) return null;

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleStageChange = (newStage: ApplicationStage) => {
    const statusMap: Record<ApplicationStage, Application['status']> = {
      "New Application": "applied",
      "Resume Review": "screening",
      "Phone Screen": "screening",
      "Technical Interview": "interview",
      "Manager Interview": "interview",
      "Final Round": "interview",
      "Reference Check": "interview",
      "Offer Extended": "offer",
      "Offer Accepted": "hired",
      "Rejected": "rejected",
      "Withdrawn": "withdrawn",
    };

    updateApplicationStatus(application.id, statusMap[newStage], newStage);
    toast.success("Application stage updated");
    onRefresh();
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // In a real app, this would call an API
    toast.success("Note added");
    setNewNote("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Application Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={application.candidatePhoto} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(application.candidateName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{application.candidateName}</h2>
              <p className="text-muted-foreground">{application.jobTitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{application.stage}</Badge>
                {application.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < application.rating!
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsInterviewDialogOpen(true)}>
              <Video className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsOfferDialogOpen(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send Offer
            </Button>
          </div>

          {/* Stage Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Move to Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={application.stage} onValueChange={handleStageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Application">New Application</SelectItem>
                  <SelectItem value="Resume Review">Resume Review</SelectItem>
                  <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                  <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                  <SelectItem value="Manager Interview">Manager Interview</SelectItem>
                  <SelectItem value="Final Round">Final Round</SelectItem>
                  <SelectItem value="Reference Check">Reference Check</SelectItem>
                  <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                  <SelectItem value="Offer Accepted">Offer Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{application.candidateEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Applied {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>

              {application.resumeUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Resume.pdf
                      <Download className="h-4 w-4 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {application.customAnswers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Application Answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {application.customAnswers.map((answer) => (
                      <div key={answer.questionId}>
                        <p className="text-sm font-medium mb-1">{answer.question}</p>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-3 mt-4">
              {application.activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-2 bg-primary rounded-full" />
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                      {activity.userName && ` by ${activity.userName}`}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note about this candidate..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} size="sm">
                  Add Note
                </Button>
              </div>

              <Separator />

              {application.notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{note.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Interview Dialog */}
        <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <InterviewScheduler
              candidateName={application.candidateName}
              jobTitle={application.jobTitle}
              onSubmit={(data) => {
                const template = data.templateId ? getTemplateById(data.templateId) : null;
                setIsInterviewDialogOpen(false);
                toast.success(
                  template 
                    ? `Interview scheduled with ${template.name} template`
                    : "Interview scheduled successfully"
                );
              }}
              onCancel={() => setIsInterviewDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Offer Dialog */}
        <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Offer Letter</DialogTitle>
            </DialogHeader>
            <OfferForm
              candidateName={application.candidateName}
              jobTitle={application.jobTitle}
              onSubmit={(data) => {
                setIsOfferDialogOpen(false);
                toast.success("Offer letter generated successfully");
              }}
              onCancel={() => setIsOfferDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}
