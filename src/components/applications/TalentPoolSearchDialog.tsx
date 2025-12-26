import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, UserPlus, MapPin, Mail, Phone, Linkedin, CheckCircle } from "lucide-react";
import { talentPoolService, TalentPoolCandidate } from "@/lib/applicationService";
import { toast } from "sonner";
import { applicationService } from "@/lib/applicationService";

interface TalentPoolSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle?: string;
  onCandidateAdded?: () => void;
}

export function TalentPoolSearchDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle = "this position",
  onCandidateAdded,
}: TalentPoolSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<(TalentPoolCandidate & { hasApplied?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingCandidateId, setAddingCandidateId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (open) {
      handleSearch();
    } else {
      // Reset when dialog closes
      setSearchQuery("");
      setCandidates([]);
      setOffset(0);
      setTotal(0);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && candidates.length === 0) {
      // Initial load - show some candidates
      setLoading(true);
      try {
        const response = await talentPoolService.searchCandidates({
          jobId, // Pass jobId to check if candidates have already applied
          limit,
          offset: 0,
        });
        if (response.success) {
          setCandidates(response.data?.candidates || []);
          setTotal(response.data?.total || 0);
          setOffset(limit);
        }
      } catch (error) {
        console.error("Failed to search talent pool:", error);
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await talentPoolService.searchCandidates({
        search: searchQuery,
        jobId, // Pass jobId to check if candidates have already applied
        limit,
        offset: 0,
      });
      if (response.success) {
        setCandidates(response.data?.candidates || []);
        setTotal(response.data?.total || 0);
        setOffset(limit);
      }
    } catch (error) {
      console.error("Failed to search talent pool:", error);
      toast.error("Failed to search candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const response = await talentPoolService.searchCandidates({
        search: searchQuery,
        jobId, // Pass jobId to check if candidates have already applied
        limit,
        offset,
      });
      if (response.success) {
        setCandidates((prev) => [...prev, ...(response.data?.candidates || [])]);
        setOffset((prev) => prev + limit);
      }
    } catch (error) {
      console.error("Failed to load more candidates:", error);
      toast.error("Failed to load more candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (candidate: TalentPoolCandidate & { hasApplied?: boolean }) => {
    // Check if already applied
    if (candidate.hasApplied) {
      toast.info(`${candidate.firstName} ${candidate.lastName} has already applied to this job`);
      return;
    }

    setAddingCandidateId(candidate.id);
    try {
      const response = await applicationService.addFromTalentPool({
        jobId,
        candidateId: candidate.id,
      });
      if (response.success) {
        toast.success(`Added ${candidate.firstName} ${candidate.lastName} to ${jobTitle}`);
        onCandidateAdded?.();
        onOpenChange(false);
      } else {
        if (response.code === 'ALREADY_APPLIED') {
          toast.info(`${candidate.firstName} ${candidate.lastName} has already applied to this job`);
          // Refresh the list to update hasApplied status
          handleSearch();
        } else {
          toast.error(response.error || "Failed to add candidate");
        }
      }
    } catch (error) {
      console.error("Failed to add candidate:", error);
      toast.error("Failed to add candidate to job");
    } finally {
      setAddingCandidateId(null);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingInvite(true);
    try {
      const response = await talentPoolService.sendJobInvitation({
        email: inviteEmail,
        jobId,
      });
      if (response.success) {
        toast.success(`Invitation email sent to ${inviteEmail}`);
        setInviteEmail("");
        setShowInviteForm(false);
      } else {
        if (response.code === 'CANDIDATE_EXISTS') {
          toast.info("This candidate already exists in the talent pool. Search for them to add directly.");
        } else {
          toast.error(response.error || "Failed to send invitation");
        }
      }
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation email");
    } finally {
      setSendingInvite(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Talent Pool</DialogTitle>
          <DialogDescription>
            Search and add candidates from the HRM8 Talent Pool to {jobTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Invite by Email
          </Button>
        </div>

        {/* Invite by Email Form */}
        {showInviteForm && (
          <div className="p-4 border rounded-lg bg-muted/50 mt-2">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendInvite();
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={handleSendInvite} 
                disabled={sendingInvite || !inviteEmail.trim()}
              >
                {sendingInvite ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowInviteForm(false);
                  setInviteEmail("");
                }}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Send a job invitation email to candidates not yet in the talent pool
            </p>
          </div>
        )}

        {/* Results */}
        <ScrollArea className="flex-1 mt-4">
          {loading && candidates.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No candidates found. Try a different search term.
            </div>
          ) : (
            <div className="space-y-2">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.photo} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(candidate.firstName, candidate.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">
                        {candidate.firstName} {candidate.lastName}
                      </h4>
                      {candidate.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      {candidate.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                      )}
                      {candidate.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{candidate.phone}</span>
                        </div>
                      )}
                      {(candidate.city || candidate.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {[candidate.city, candidate.state].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      {candidate.linkedInUrl && (
                        <a
                          href={candidate.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Linkedin className="h-3 w-3" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                    {candidate.jobTypePreference.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {candidate.jobTypePreference.slice(0, 3).map((pref, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAddCandidate(candidate)}
                    disabled={addingCandidateId === candidate.id || candidate.hasApplied}
                    variant={candidate.hasApplied ? "outline" : "default"}
                  >
                    {addingCandidateId === candidate.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : candidate.hasApplied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Applied
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              ))}

              {candidates.length < total && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Load More ({total - candidates.length} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <div className="text-sm text-muted-foreground mt-2">
          Showing {candidates.length} of {total} candidates
        </div>
      </DialogContent>
    </Dialog>
  );
}

