import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';
import { NotificationType } from './enum/notification-type.enum';
import { Profile } from '../users/profiles/profile.entity';
import { NotificationCategory } from './enum/notification-category.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepo: Repository<Notification>,
    @InjectRepository(Profile)
    private profilesRepo: Repository<Profile>,
  ) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    category: NotificationCategory = NotificationCategory.SYSTEM,
  ) {
    const profile = await this.profilesRepo.findOne({
      where: { account: { id: userId } },
      relations: ['account'],
    });

    const prefs = profile?.notificationPreferences || {
      routines: true,
      exercises: true,
      system: true,
    };

    if (prefs[category] === false) {
      return null;
    }

    const notification = this.notificationsRepo.create({
      userId,
      title,
      message,
      type,
    });
    return this.notificationsRepo.save(notification);
  }

  async findAllByUser(userId: string, limit = 20, offset = 0) {
    const [items, total] = await this.notificationsRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { items, total };
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationsRepo.update({ id, userId }, { isRead: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationsRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string) {
    return this.notificationsRepo.count({ where: { userId, isRead: false } });
  }
}
