import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobEmailInboxTab } from './JobEmailInboxTab';
import { JobTemplateManagerTab } from './JobTemplateManagerTab';
import { JobRoundAutomationTab } from './JobRoundAutomationTab';
import { Inbox, FileText, Zap } from 'lucide-react';

interface JobEmailHubDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

export function JobEmailHubDrawer({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: JobEmailHubDrawerProps) {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl lg:max-w-4xl flex flex-col p-0">
        <SheetHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetTitle>Email Center</SheetTitle>
          <SheetDescription>
            Manage emails, templates, and automation for {jobTitle}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="inbox" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  Inbox
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Automation
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inbox" className="flex-1 flex flex-col min-h-0 mt-0 px-6 pb-6 overflow-hidden">
              <JobEmailInboxTab jobId={jobId} />
            </TabsContent>

            <TabsContent value="templates" className="flex-1 flex flex-col min-h-0 mt-0 px-6 pb-6 overflow-hidden">
              <JobTemplateManagerTab jobId={jobId} />
            </TabsContent>

            <TabsContent value="automation" className="flex-1 flex flex-col min-h-0 mt-0 px-6 pb-6 overflow-hidden">
              <JobRoundAutomationTab jobId={jobId} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

