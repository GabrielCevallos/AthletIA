import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enum/notification-type.enum';

export class NotificationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Rutina completada' })
  title: string;

  @ApiProperty({ example: 'Has completado tu rutina de fuerza.' })
  message: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.SUCCESS })
  type: NotificationType;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2024-02-03T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;
}

export class NotificationListDto {
  @ApiProperty({ type: [NotificationDto] })
  items: NotificationDto[];

  @ApiProperty({ example: 10 })
  total: number;
}

export class UnreadCountDto {
  @ApiProperty({ example: 5 })
  count: number;
}
