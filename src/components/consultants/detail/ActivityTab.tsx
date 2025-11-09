import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, CheckSquare, History } from 'lucide-react';
import { EnhancedActivityTimeline } from './EnhancedActivityTimeline';
import { EnhancedNotesSection } from './EnhancedNotesSection';
import { EnhancedTasksSection } from './EnhancedTasksSection';

interface ActivityTabProps {
  consultantId: string;
}

export function ActivityTab({ consultantId }: ActivityTabProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Activity Timeline</span>
            <span className="sm:hidden">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <EnhancedActivityTimeline consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <EnhancedNotesSection consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <EnhancedTasksSection consultantId={consultantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
