import { useState, useEffect, useCallback } from 'react';
import { 
  getNotificationPreferences, 
  updateNotificationPreferences 
} from '@/lib/notificationPreferencesStorage';
import { NotificationPreferences } from '@/types/notificationPreferences';
import { toast } from 'sonner';

export function useNotificationPreferences(userId: string) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefs = getNotificationPreferences(userId);
    setPreferences(prefs);
    setLoading(false);
  }, [userId]);

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    if (!preferences) return;

    const updated = updateNotificationPreferences(userId, updates);
    setPreferences(updated);
    
    toast.success('Preferences updated', {
      description: 'Your notification preferences have been saved',
    });
  }, [userId, preferences]);

  const toggleEventNotification = useCallback((eventType: keyof NotificationPreferences['eventPreferences']) => {
    if (!preferences) return;

    const currentPref = preferences.eventPreferences[eventType];
    updatePreferences({
      eventPreferences: {
        ...preferences.eventPreferences,
        [eventType]: {
          ...currentPref,
          enabled: !currentPref.enabled,
        },
      },
    });
  }, [preferences, updatePreferences]);

  const updateEventChannels = useCallback((
    eventType: keyof NotificationPreferences['eventPreferences'],
    channels: string[]
  ) => {
    if (!preferences) return;

    updatePreferences({
      eventPreferences: {
        ...preferences.eventPreferences,
        [eventType]: {
          ...preferences.eventPreferences[eventType],
          channels: channels as any,
        },
      },
    });
  }, [preferences, updatePreferences]);

  const toggleQuietHours = useCallback(() => {
    if (!preferences) return;

    updatePreferences({
      quietHours: {
        ...preferences.quietHours!,
        enabled: !preferences.quietHours?.enabled,
      },
    });
  }, [preferences, updatePreferences]);

  const updateQuietHoursTimes = useCallback((start: string, end: string) => {
    if (!preferences) return;

    updatePreferences({
      quietHours: {
        enabled: preferences.quietHours?.enabled || false,
        start,
        end,
      },
    });
  }, [preferences, updatePreferences]);

  return {
    preferences,
    loading,
    updatePreferences,
    toggleEventNotification,
    updateEventChannels,
    toggleQuietHours,
    updateQuietHoursTimes,
  };
}
