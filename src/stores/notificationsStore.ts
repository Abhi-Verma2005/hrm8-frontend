/**
 * Notifications Store
 * Manages notification state with WebSocket integration using Zustand
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Notification, NotificationStats } from "@/types/notification";
import type { NotificationPreferences } from "@/types/notificationPreferences";

interface NotificationsState {
  // State
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  setStats: (stats: NotificationStats) => void;
  setPreferences: (preferences: NotificationPreferences) => void;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotifications: () => void;

  // Computed
  getUnreadNotifications: () => Notification[];
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      stats: null,
      preferences: null,
      isLoading: false,
      lastFetched: null,
      error: null,

      // Set all notifications
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({
          notifications,
          unreadCount,
          lastFetched: Date.now(),
          isLoading: false,
        });
      },

      // Add a new notification (from WebSocket)
      addNotification: (notification) => {
        set((state) => {
          const exists = state.notifications.some((n) => n.id === notification.id);
          if (exists) return state;

          return {
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read
              ? state.unreadCount
              : state.unreadCount + 1,
          };
        });
      },

      // Mark a notification as read
      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        });
      },

      // Mark all notifications as read
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.read ? n : { ...n, read: true, readAt: new Date().toISOString() }
          ),
          unreadCount: 0,
        }));
      },

      // Archive a notification
      archiveNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, archived: true } : n
          ),
        }));
      },

      // Remove a notification
      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      // Set notification stats
      setStats: (stats) => {
        set({ stats, unreadCount: stats.unread });
      },

      // Set preferences
      setPreferences: (preferences) => {
        set({ preferences });
      },

      // Update preferences
      updatePreferences: (updates) => {
        set((state) => ({
          preferences: state.preferences
            ? { ...state.preferences, ...updates }
            : null,
        }));
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Clear all notifications
      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
          stats: null,
          lastFetched: null,
        });
      },

      // Get unread notifications
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read && !n.archived);
      },
    }),
    { name: "notificationsStore" }
  )
);

// Selectors
export const selectNotifications = (state: NotificationsState) => state.notifications;
export const selectUnreadCount = (state: NotificationsState) => state.unreadCount;
export const selectStats = (state: NotificationsState) => state.stats;
export const selectPreferences = (state: NotificationsState) => state.preferences;
export const selectIsLoading = (state: NotificationsState) => state.isLoading;
export const selectNotificationsError = (state: NotificationsState) => state.error;
