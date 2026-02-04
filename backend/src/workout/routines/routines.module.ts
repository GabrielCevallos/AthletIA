import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './routines.entity';
import { Exercise } from '../exercises/exercises.entity';
import { AccountsModule } from 'src/users/accounts/accounts.module';
import { ProfilesModule } from 'src/users/profiles/profiles.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Routine, Exercise]),
    AccountsModule,
    ProfilesModule,
    NotificationsModule,
  ],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}
