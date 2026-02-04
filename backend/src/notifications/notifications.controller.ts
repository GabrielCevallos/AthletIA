import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetNotifications,
  ApiGetUnreadCount,
  ApiMarkAllAsRead,
  ApiMarkAsRead,
} from './swagger.decorators';
import { ResponseBody } from '../common/response/api.response';

@ApiTags('Notifications')
@UseGuards(AuthGuard)
@Controller('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiGetNotifications()
  async getUserNotifications(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const data = await this.notificationsService.findAllByUser(
      req.user.id,
      limit,
      offset,
    );
    return ResponseBody.success(data, 'Notifications retrieved successfully');
  }

  @Get('unread-count')
  @ApiGetUnreadCount()
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return ResponseBody.success({ count }, 'Count retrieved successfully');
  }

  @Patch(':id/read')
  @ApiMarkAsRead()
  async markAsRead(@Request() req, @Param('id') id: string) {
    await this.notificationsService.markAsRead(id, req.user.id);
    return ResponseBody.success(
      { success: true },
      'Notification marked as read',
    );
  }

  @Patch('read-all')
  @ApiMarkAllAsRead()
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return ResponseBody.success(
      { success: true },
      'All notifications marked as read',
    );
  }
}
