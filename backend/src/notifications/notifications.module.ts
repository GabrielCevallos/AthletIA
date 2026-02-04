import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { Profile } from '../users/profiles/profile.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AuthModule } from '../auth/auth.module';
import { AccountsModule } from '../users/accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Profile]), AuthModule, AccountsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
