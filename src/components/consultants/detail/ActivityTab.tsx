import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, CheckSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityTimeline } from './ActivityTimeline';
import { NotesSection } from './NotesSection';
import { TasksSection } from './TasksSection';

interface ActivityTabProps {
  consultantId: string;
}

export function ActivityTab({ consultantId }: ActivityTabProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquare className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <ActivityTimeline consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesSection consultantId={consultantId} />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksSection consultantId={consultantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
