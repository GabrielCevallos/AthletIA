import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationType } from './enum/notification-type.enum';

export function ApiGetNotifications() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user notifications' }),
    ApiBearerAuth(),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'offset', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Notifications retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Notifications retrieved successfully',
          data: {
            items: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Rutina completada',
                message: 'Has completado tu rutina de fuerza.',
                type: NotificationType.SUCCESS,
                isRead: false,
                createdAt: '2024-02-03T12:00:00Z',
                userId: '123e4567-e89b-12d3-a456-426614174001',
              },
            ],
            total: 1,
          },
        },
      },
    }),
  );
}

export function ApiGetUnreadCount() {
  return applyDecorators(
    ApiOperation({ summary: 'Get unread notifications count' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Count retrieved successfully',
      schema: {
        example: {
          success: true,
          message: 'Count retrieved successfully',
          data: {
            count: 5,
          },
        },
      },
    }),
  );
}

export function ApiMarkAsRead() {
  return applyDecorators(
    ApiOperation({ summary: 'Mark notification as read' }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: String, format: 'uuid' }),
    ApiResponse({
      status: 200,
      description: 'Marked as read successfully',
      schema: {
        example: {
          success: true,
          message: 'Notification marked as read',
          data: { success: true },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Notification not found' }),
  );
}

export function ApiMarkAllAsRead() {
  return applyDecorators(
    ApiOperation({ summary: 'Mark all notifications as read' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'All marked as read successfully',
      schema: {
        example: {
          success: true,
          message: 'All notifications marked as read',
          data: { success: true },
        },
      },
    }),
  );
}

