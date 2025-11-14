import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, FileText, Users, Calendar, ClipboardCheck, MessageSquare, Activity, Briefcase } from "lucide-react";
import { Application } from "@/types/application";
import { CandidateProfileHeader } from "./CandidateProfileHeader";
import { AIMatchScoreCard } from "./AIMatchScoreCard";
import { QuickActionsToolbar } from "./QuickActionsToolbar";
import { OverviewTab } from "./tabs/OverviewTab";
import { ApplicationDetailsTab } from "./tabs/ApplicationDetailsTab";
import { ResumeWorkHistoryTab } from "./tabs/ResumeWorkHistoryTab";
import { QuestionnaireResponsesTab } from "./tabs/QuestionnaireResponsesTab";
import { ScorecardsTab } from "./tabs/ScorecardsTab";
import { InterviewsTab } from "./tabs/InterviewsTab";

interface CandidateAssessmentViewProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  jobTitle: string;
}

export function CandidateAssessmentView({
  application,
  open,
  onOpenChange,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  jobTitle,
}: CandidateAssessmentViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "n" && hasNext && onNext) {
      onNext();
    } else if (e.key === "p" && hasPrevious && onPrevious) {
      onPrevious();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] h-[95vh] p-0 gap-0"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                  Candidate Assessment
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  disabled={!hasNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CandidateProfileHeader application={application} jobTitle={jobTitle} />
            <QuickActionsToolbar application={application} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b px-4 bg-muted/20">
                <ScrollArea className="w-full whitespace-nowrap">
                  <TabsList className="h-12 bg-transparent">
                    <TabsTrigger value="overview" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="application" className="gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      Application
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="gap-2">
                      <Briefcase className="h-4 w-4" />
                      Resume & Work
                    </TabsTrigger>
                    <TabsTrigger value="questionnaire" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Questionnaire
                    </TabsTrigger>
                    <TabsTrigger value="scorecards" className="gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      Scorecards
                    </TabsTrigger>
                    <TabsTrigger value="interviews" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Interviews
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="gap-2">
                      <Users className="h-4 w-4" />
                      Team Reviews
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                      <Activity className="h-4 w-4" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                </ScrollArea>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    <OverviewTab application={application} />
                  </TabsContent>

                  <TabsContent value="application" className="mt-0">
                    <ApplicationDetailsTab application={application} />
                  </TabsContent>

                  <TabsContent value="resume" className="mt-0">
                    <ResumeWorkHistoryTab application={application} />
                  </TabsContent>

                  <TabsContent value="questionnaire" className="mt-0">
                    <QuestionnaireResponsesTab application={application} />
                  </TabsContent>

                  <TabsContent value="scorecards" className="mt-0">
                    <ScorecardsTab application={application} />
                  </TabsContent>

                  <TabsContent value="interviews" className="mt-0">
                    <InterviewsTab application={application} />
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <div className="text-center py-12 text-muted-foreground">
                      Team Reviews tab will be implemented in Phase 4
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0">
                    <div className="text-center py-12 text-muted-foreground">
                      Activity timeline tab will be implemented in Phase 4
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
