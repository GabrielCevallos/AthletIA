import { Config } from '@/constants/config';
import { handleApiError } from './api-error-handler';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: string;
  data?: any; // For any extra payload
}

export interface NotificationsResponse {
  items: NotificationItem[];
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const NotificationsApi = {
  getUserNotifications: async (token: string, limit: number = 20, offset: number = 0) => {
    try {
      const response = await fetch(
        `${Config.apiUrl}/Notifications?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      await handleApiError(error);
      throw error;
    }
  },

  getUnreadCount: async (token: string) => {
    try {
      const response = await fetch(`${Config.apiUrl}/Notifications/unread-count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Sesión expirada');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      await handleApiError(error);
      throw error;
    }
  },

  markAsRead: async (token: string, notificationId: string) => {
    try {
      const response = await fetch(`${Config.apiUrl}/Notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Sesión expirada');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      await handleApiError(error);
      throw error;
    }
  },

  markAllAsRead: async (token: string) => {
    try {
      const response = await fetch(`${Config.apiUrl}/Notifications/read-all`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Sesión expirada');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      await handleApiError(error);
      throw error;
    }
  },
};
