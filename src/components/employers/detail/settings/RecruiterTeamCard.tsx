import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Plus, Star, Trash2 } from "lucide-react";
import { getEmployerRecruiters, addRecruiter, removeRecruiter, setPrimaryRecruiter } from "@/lib/recruiterTeamStorage";
import { mockRecruiters } from "@/data/mockRecruiters";
import { RecruiterAssignment } from "@/types/teamAssignment";

interface RecruiterTeamCardProps {
  employerId: string;
}

export function RecruiterTeamCard({ employerId }: RecruiterTeamCardProps) {
  const [recruiters, setRecruiters] = useState<RecruiterAssignment[]>(
    getEmployerRecruiters(employerId)
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recruiterToDelete, setRecruiterToDelete] = useState<RecruiterAssignment | null>(null);

  const refreshRecruiters = () => {
    setRecruiters(getEmployerRecruiters(employerId));
  };

  const handleAddRecruiter = () => {
    if (!selectedRecruiterId) return;

    const recruiter = mockRecruiters.find(r => r.id === selectedRecruiterId);
    if (!recruiter) return;

    // Check if recruiter already assigned
    const existing = recruiters.find(r => r.recruiterId === selectedRecruiterId);
    if (existing) {
      toast({
        title: "Recruiter already assigned",
        description: `${recruiter.name} is already part of this team.`,
        variant: "destructive",
      });
      return;
    }

    addRecruiter({
      employerId,
      recruiterId: recruiter.id,
      recruiterName: recruiter.name,
      specialization: recruiter.specialization,
      isPrimary: recruiters.length === 0, // First recruiter is primary
      assignedBy: 'current_user',
      assignedByName: 'Current User',
      notes: '',
    });

    refreshRecruiters();
    setAddDialogOpen(false);
    setSelectedRecruiterId("");
    toast({
      title: "Recruiter added successfully",
      description: `${recruiter.name} has been added to the team.`,
    });
  };

  const handleSetPrimary = (assignment: RecruiterAssignment) => {
    if (assignment.isPrimary) return;

    setPrimaryRecruiter(assignment.id, employerId);
    refreshRecruiters();
    toast({
      title: "Primary recruiter updated",
      description: `${assignment.recruiterName} is now the primary recruiter.`,
    });
  };

  const handleRemoveClick = (assignment: RecruiterAssignment) => {
    setRecruiterToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (!recruiterToDelete) return;

    removeRecruiter(recruiterToDelete.id, employerId);
    refreshRecruiters();
    setDeleteDialogOpen(false);
    setRecruiterToDelete(null);
    toast({
      title: "Recruiter removed",
      description: `${recruiterToDelete.recruiterName} has been removed from the team.`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const availableRecruiters = mockRecruiters.filter(
    r => !recruiters.some(assigned => assigned.recruiterId === r.id)
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recruiter Team</CardTitle>
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Recruiter
          </Button>
        </CardHeader>
        <CardContent>
          {recruiters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recruiters assigned yet.</p>
              <p className="text-sm mt-1">Add your first recruiter to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recruiters.map((assignment) => {
                const recruiterData = mockRecruiters.find(r => r.id === assignment.recruiterId);
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(assignment.recruiterName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{assignment.recruiterName}</span>
                          {assignment.isPrimary && (
                            <Badge variant="default" className="gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {assignment.specialization && (
                            <span>{assignment.specialization}</span>
                          )}
                          {recruiterData?.activeJobs && (
                            <>
                              <span>•</span>
                              <span>{recruiterData.activeJobs} active jobs</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!assignment.isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPrimary(assignment)}
                        >
                          Set as Primary
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveClick(assignment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Recruiter Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Recruiter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Recruiter</label>
              <Select value={selectedRecruiterId} onValueChange={setSelectedRecruiterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a recruiter..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRecruiters.length === 0 ? (
                    <SelectItem value="none" disabled>
                      All recruiters already assigned
                    </SelectItem>
                  ) : (
                    availableRecruiters.map(recruiter => (
                      <SelectItem key={recruiter.id} value={recruiter.id}>
                        <div>
                          <div className="font-medium">{recruiter.name}</div>
                          {recruiter.specialization && (
                            <div className="text-xs text-muted-foreground">
                              {recruiter.specialization}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecruiter} disabled={!selectedRecruiterId}>
              Add Recruiter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Recruiter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {recruiterToDelete?.recruiterName} from the team?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConfirm}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
