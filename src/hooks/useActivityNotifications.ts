import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Application } from "@/types/application";

export function useActivityNotifications(application: Application) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastActivityId, setLastActivityId] = useState<string | null>(null);

  useEffect(() => {
    if (!application.activities || application.activities.length === 0) {
      return;
    }

    const latestActivity = application.activities[0];
    
    // Check if this is a new activity
    if (lastActivityId && latestActivity.id !== lastActivityId) {
      // Show toast notification for new activity
      const activityType = latestActivity.type.replace(/_/g, ' ');
      
      toast({
        title: "New Activity",
        description: `${latestActivity.userName || 'Someone'} ${activityType}: ${latestActivity.description}`,
      });
      
      setUnreadCount(prev => prev + 1);
    }
    
    setLastActivityId(latestActivity.id);
  }, [application.activities, lastActivityId]);

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  return {
    unreadCount,
    clearUnreadCount,
  };
}
