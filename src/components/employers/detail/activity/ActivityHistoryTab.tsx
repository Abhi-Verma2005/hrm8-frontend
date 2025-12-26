import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityTimeline } from "./ActivityTimeline";
import { NotesSection } from "./NotesSection";
import { TasksSection } from "./TasksSection";

interface ActivityHistoryTabProps {
  employerId: string;
}

export function ActivityHistoryTab({ employerId }: ActivityHistoryTabProps) {
  return (
    <Tabs defaultValue="timeline" className="space-y-6">
      <TabsList>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline">
        <ActivityTimeline employerId={employerId} />
      </TabsContent>
      
      <TabsContent value="notes">
        <NotesSection employerId={employerId} />
      </TabsContent>
      
      <TabsContent value="tasks">
        <TasksSection employerId={employerId} />
      </TabsContent>
    </Tabs>
  );
}
