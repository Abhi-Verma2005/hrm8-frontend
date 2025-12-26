import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, UserPlus, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { ApplicationStage, ApplicationStatus } from "@/types/application";
import { BulkEmailComposerDialog } from "./BulkEmailComposerDialog";

interface ApplicationBulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: ApplicationStatus, stage: ApplicationStage) => void;
  onBulkAssignRecruiter: (recruiterId: string) => void;
  onBulkEmail: () => void;
  onBulkScheduleInterview: () => void;
  onBulkReject: () => void;
}

export function ApplicationBulkActionsToolbar({ 
  selectedCount, 
  onClearSelection, 
  onBulkStatusUpdate,
  onBulkAssignRecruiter,
  onBulkEmail,
  onBulkScheduleInterview,
  onBulkReject,
}: ApplicationBulkActionsToolbarProps) {
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  if (selectedCount === 0) return null;

  const handleStageUpdate = (stage: string) => {
    const stageMapping: Record<string, { status: ApplicationStatus; stage: ApplicationStage }> = {
      'new': { status: 'applied', stage: 'New Application' },
      'screening': { status: 'screening', stage: 'Resume Review' },
      'phone-screen': { status: 'screening', stage: 'Phone Screen' },
      'technical': { status: 'interview', stage: 'Technical Interview' },
      'manager': { status: 'interview', stage: 'Manager Interview' },
      'final': { status: 'interview', stage: 'Final Round' },
      'offer': { status: 'offer', stage: 'Offer Extended' },
      'hired': { status: 'hired', stage: 'Offer Accepted' },
    };

    const mapping = stageMapping[stage];
    if (mapping) {
      onBulkStatusUpdate(mapping.status, mapping.stage);
      toast({
        title: "Status updated",
        description: `${selectedCount} application(s) moved to ${mapping.stage}.`,
      });
    }
  };

  const handleAssignRecruiter = (recruiterId: string) => {
    onBulkAssignRecruiter(recruiterId);
    toast({
      title: "Recruiter assigned",
      description: `${selectedCount} application(s) assigned successfully.`,
    });
  };

  const handleReject = () => {
    onBulkReject();
    setShowRejectDialog(false);
    toast({
      title: "Applications rejected",
      description: `${selectedCount} application(s) rejected.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-primary/10 border-b border-primary/20 p-4 mb-4 rounded-lg">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="font-semibold">
              {selectedCount} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select onValueChange={handleStageUpdate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Move to Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Application</SelectItem>
                <SelectItem value="screening">Resume Review</SelectItem>
                <SelectItem value="phone-screen">Phone Screen</SelectItem>
                <SelectItem value="technical">Technical Interview</SelectItem>
                <SelectItem value="manager">Manager Interview</SelectItem>
                <SelectItem value="final">Final Round</SelectItem>
                <SelectItem value="offer">Offer Extended</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleAssignRecruiter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Assign Recruiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter-1">Sarah Johnson</SelectItem>
                <SelectItem value="recruiter-2">Michael Chen</SelectItem>
                <SelectItem value="recruiter-3">Emily Rodriguez</SelectItem>
                <SelectItem value="recruiter-4">David Kim</SelectItem>
                <SelectItem value="recruiter-5">Jessica Brown</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailDialog(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkScheduleInterview}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {selectedCount} application(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the selected applications to the rejected stage. 
              You can optionally send rejection emails to the candidates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject Applications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkEmailComposerDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        selectedCount={selectedCount}
        onSend={(subject, body) => {
          onBulkEmail();
          // In the future, this will pass subject and body to the backend
          console.log('Email to send:', { subject, body });
        }}
      />
    </>
  );
}
