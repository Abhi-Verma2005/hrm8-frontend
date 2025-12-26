import { NotificationCenter } from "@/components/notifications/NotificationCenter";

// Mock user ID - in production this would come from auth context
const MOCK_USER_ID = "user-1";

export function NotificationsDropdown() {
  return <NotificationCenter userId={MOCK_USER_ID} />;
}
