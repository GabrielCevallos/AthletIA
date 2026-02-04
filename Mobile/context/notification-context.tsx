import { NotificationItem, NotificationsApi } from '@/services/notifications-api';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './auth-context';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  hasMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 20;

  // Poll for unread count
  const checkUnreadCount = useCallback(async () => {
    if (!user?.token) return;
    try {
      const response = await NotificationsApi.getUnreadCount(user.token);
      if (response.success && response.data) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user?.token]);

  // Initial load request
  const fetchNotifications = useCallback(async (reset = false) => {
    if (!user?.token) return;

    if (reset) {
      setLoading(true);
      setOffset(0);
    }

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await NotificationsApi.getUserNotifications(user.token, PAGE_SIZE, currentOffset);
      
      if (response.success && response.data) {
        const newItems = response.data.items;
        
        if (reset) {
          setNotifications(newItems);
        } else {
          setNotifications(prev => [...prev, ...newItems]);
        }

        setHasMore(newItems.length === PAGE_SIZE);
        setOffset(prev => (reset ? PAGE_SIZE : prev + PAGE_SIZE));
        
        // Update unread count as well when fetching list
        checkUnreadCount();
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (reset) setLoading(false);
    }
  }, [user?.token, offset, checkUnreadCount]);

  const refreshNotifications = async () => {
    await fetchNotifications(true);
  };

  const loadMoreNotifications = async () => {
    if (!loading && hasMore) {
      await fetchNotifications(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user?.token) return;
    
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await NotificationsApi.markAsRead(user.token, id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert if error? For now, we keep optimistic UI
    }
  };

  const markAllAsRead = async () => {
    if (!user?.token) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await NotificationsApi.markAllAsRead(user.token);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Poll on mount and app focus
  useEffect(() => {
    if (!user?.token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
    }

    checkUnreadCount();
    
    // Poll every 60 seconds
    const intervalId = setInterval(checkUnreadCount, 60000);

    // Also check when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkUnreadCount();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [user?.token, checkUnreadCount]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      loadMoreNotifications,
      markAsRead,
      markAllAsRead,
      hasMore
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
